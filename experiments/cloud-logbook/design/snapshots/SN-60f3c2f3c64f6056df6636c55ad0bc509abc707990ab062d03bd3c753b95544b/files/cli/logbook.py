"""Durable log sender. Python standard library only; credentials come from env."""
import argparse
import datetime as dt
import hashlib
import ipaddress
import json
import os
from pathlib import Path
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
import uuid

SOURCES = ['codex-local', 'claude-local', 'codex-cloud', 'claude-cloud']
PHASES = ['intake', 'design', 'plan', 'implementation', 'verification', 'audit', 'adoption', 'closure']


def validate(event):
    for key in ['id', 'project', 'run']:
        if not isinstance(event[key], str) or not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_.-]{0,95}', event[key]):
            raise ValueError('invalid identifier')
    for key, limit in [('actor', 120), ('title', 240), ('body', 8000), ('reason', 4000), ('next', 2000)]:
        if not isinstance(event[key], str) or len(event[key]) > limit or '\0' in event[key] or (key in ['actor', 'title'] and not event[key].strip()):
            raise ValueError('invalid text')
    if len(event['evidence']) > 20:
        raise ValueError('too many evidence references')
    for value in event['evidence']:
        if not isinstance(value, str) or not value or len(value) > 2048 or re.search(r'[\s\x00-\x1f\\]', value):
            raise ValueError('invalid evidence')
        if value.startswith('https://'):
            url = urllib.parse.urlsplit(value)
            if not url.hostname or url.username or url.password:
                raise ValueError('invalid evidence URL')
        elif value.startswith('/') or ':' in value or any(p in ['', '.', '..'] for p in value.split('/')):
            raise ValueError('invalid evidence path')
    return event


def endpoint(value):
    url = urllib.parse.urlsplit(value)
    local = url.hostname in ['localhost', '127.0.0.1', '::1']
    if not url.hostname or url.username or url.password or url.query or url.fragment or url.scheme not in ['https', 'http'] or (url.scheme == 'http' and not local) or url.path not in ['', '/', '/api/events']:
        raise ValueError('endpoint must be HTTPS, or loopback HTTP, without credentials/query')
    return urllib.parse.urlunsplit((url.scheme, url.netloc, '/api/events', '', ''))


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def enqueue(folder, event):
    name = hashlib.sha256(event['id'].encode()).hexdigest() + '.json'
    target = folder / name
    data = json.dumps(event, ensure_ascii=False, sort_keys=True).encode('utf-8')
    if target.exists():
        if target.read_bytes() != data:
            raise ValueError('queued ID already has different content; use a new ID')
        return
    temp = folder / ('.pending-' + uuid.uuid4().hex)
    try:
        with temp.open('xb') as file:
            file.write(data)
            file.flush()
            os.fsync(file.fileno())
        os.replace(temp, target)
    finally:
        temp.unlink(missing_ok=True)


def flush(folder, url, token):
    files = sorted(folder.glob('*.json'))
    if not files:
        return 0
    if not url or not token:
        print(f'pending={len(files)}; configure LOGBOOK_URL and LOGBOOK_TOKEN')
        return 2
    url = endpoint(url)
    if not re.fullmatch(r'[^\s]{24,512}', token):
        raise ValueError('invalid writer token')
    opener = urllib.request.build_opener(NoRedirect)
    for path in files:
        data = path.read_bytes()
        request = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token}, method='POST')
        try:
            with opener.open(request, timeout=15) as response:
                reply = json.loads(response.read(8192))
                if response.status not in [200, 201] or reply.get('status') not in ['inserted', 'duplicate']:
                    raise ValueError('unexpected acknowledgement')
        except urllib.error.HTTPError as error:
            print(f'pending; HTTP {error.code}; queue retained')
            return 2
        except (OSError, ValueError, urllib.error.URLError):
            print('pending; delivery failed; queue retained')
            return 2
        path.unlink()
        print('acknowledged ' + json.loads(data)['id'])
    return 0


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--queue', default=os.getenv('LOGBOOK_QUEUE', '.logbook-queue'))
    parser.add_argument('--url', default=os.getenv('LOGBOOK_URL', ''))
    sub = parser.add_subparsers(dest='command', required=True)
    record = sub.add_parser('record')
    record.add_argument('--id', default=None)
    record.add_argument('--project', required=True)
    record.add_argument('--run', required=True)
    record.add_argument('--source', choices=SOURCES, required=True)
    record.add_argument('--actor', required=True)
    record.add_argument('--phase', choices=PHASES, default='implementation')
    record.add_argument('--kind', choices=['action', 'decision', 'check', 'issue'], default='action')
    record.add_argument('--title', required=True)
    for field in ['body', 'reason', 'next']:
        record.add_argument('--' + field, default='')
    record.add_argument('--evidence', action='append', default=[])
    record.add_argument('--outcome', choices=['recorded', 'pass', 'fail', 'unverified'], default='recorded')
    record.add_argument('--offline', action='store_true')
    sub.add_parser('flush')
    sub.add_parser('status')
    args = parser.parse_args(argv)
    folder = Path(args.queue).resolve()
    folder.mkdir(parents=True, exist_ok=True)
    lock = folder / '.lock'
    try:
        fd = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    except FileExistsError:
        print('queue locked; confirm no sender is active before removing .lock', file=sys.stderr)
        return 3
    try:
        os.write(fd, str(os.getpid()).encode())
        os.close(fd)
        if args.command == 'status':
            print('pending=' + str(len(list(folder.glob('*.json')))))
            return 0
        if args.command == 'record':
            event = {key: getattr(args, key) for key in ['project', 'run', 'source', 'actor', 'phase', 'kind', 'title', 'body', 'reason', 'evidence', 'next', 'outcome']}
            event.update(id=args.id or uuid.uuid4().hex, time=dt.datetime.now(dt.timezone.utc).isoformat(timespec='milliseconds').replace('+00:00', 'Z'))
            enqueue(folder, validate(event))
            print('saved ' + event['id'])
            if args.offline:
                return 0
        return flush(folder, args.url, os.getenv('LOGBOOK_TOKEN', ''))
    except (ValueError, OSError):
        # Do not print exceptions: HTTP/config errors can contain credentials.
        print('invalid input or queue unavailable; saved events retained', file=sys.stderr)
        return 2
    finally:
        lock.unlink(missing_ok=True)


if __name__ == '__main__':
    sys.exit(main())
