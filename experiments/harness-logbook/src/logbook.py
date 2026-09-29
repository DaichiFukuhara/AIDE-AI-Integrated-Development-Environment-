"""Single-writer event storage and CLI. No audit/adoption decisions are made here."""
from datetime import datetime, timezone
from pathlib import Path
import argparse
import json
import os
import re
import stat
import sys
import uuid

ROOT = Path(__file__).resolve().parents[1]
PHASES = ('intake', 'design', 'plan', 'implementation', 'verification', 'audit', 'adoption', 'closure')
KINDS = ('action', 'decision', 'check', 'issue')
OUTCOMES = ('recorded', 'pass', 'fail', 'unverified')
MAX_BYTES = 5 * 1024 * 1024


class RecordError(ValueError):
    pass


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise RecordError('JSONのキーが重複しています: ' + key)
        result[key] = value
    return result


def read_json(path):
    if path.stat().st_size > MAX_BYTES:
        raise RecordError('ファイルが5MBを超えています。')
    return json.loads(path.read_text(encoding='utf-8'), object_pairs_hook=unique_object)


def validate_evidence_path(relative):
    if not isinstance(relative, str) or not relative or len(relative) > 1000:
        raise RecordError('参照はプロジェクト内の相対パスで指定してください。')
    if '\x00' in relative or '\\' in relative or ':' in relative or relative.startswith('/') or any(part in ('', '.', '..') for part in relative.split('/')):
        raise RecordError('範囲外の参照は記録できません。')


def safe_file(root, relative):
    validate_evidence_path(relative)
    target = root
    for part in relative.split('/'):
        target = target / part
        try:
            info = target.lstat()
        except FileNotFoundError:
            raise RecordError('根拠ファイルが存在しません: ' + relative) from None
        if target.is_symlink() or getattr(info, 'st_file_attributes', 0) & getattr(stat, 'FILE_ATTRIBUTE_REPARSE_POINT', 0x400):
            raise RecordError('リンク経由の参照は許可されません。')
    if not target.resolve().is_relative_to(root.resolve()) or not target.is_file():
        raise RecordError('参照先はプロジェクト内のファイルに限定されます。')
    return target


def normalize_event(value, root, *, check_evidence=True):
    required = {'id', 'time', 'actor', 'phase', 'kind', 'title', 'body', 'reason', 'evidence', 'next', 'outcome'}
    if not isinstance(value, dict) or set(value) != required:
        raise RecordError('イベントの項目が不足しているか、未知の項目があります。')
    result = dict(value)
    for key, maximum in {'id': 100, 'actor': 100, 'title': 160, 'body': 4000, 'reason': 2000, 'next': 1000}.items():
        if not isinstance(value[key], str) or len(value[key]) > maximum or (key in ('id', 'actor', 'title', 'body') and not value[key].strip()):
            raise RecordError(f'{key} は有効な文字列（最大 {maximum} 文字）で指定してください。')
    if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9._:-]{0,99}', value['id']):
        raise RecordError('IDの形式が正しくありません。')
    if value['phase'] not in PHASES or value['kind'] not in KINDS or value['outcome'] not in OUTCOMES:
        raise RecordError('工程・種類・結果のいずれかが不正です。')
    if not isinstance(value['time'], str):
        raise RecordError('日時をISO 8601で指定してください。')
    try:
        parsed = datetime.fromisoformat(value['time'].replace('Z', '+00:00'))
        if parsed.tzinfo is None or parsed.utcoffset() is None:
            raise ValueError()
    except ValueError:
        raise RecordError('日時にはタイムゾーンが必要です。') from None
    result['time'] = parsed.astimezone(timezone.utc).isoformat()
    if not isinstance(value['evidence'], list) or len(value['evidence']) > 12 or any(not isinstance(item, str) for item in value['evidence']):
        raise RecordError('根拠は12件以内のパスの配列で指定してください。')
    if len(set(value['evidence'])) != len(value['evidence']):
        raise RecordError('根拠のパスが重複しています。')
    for path in value['evidence']:
        validate_evidence_path(path)
        if check_evidence:
            safe_file(root, path)
    return result


def read_events(root=ROOT):
    root = Path(root).resolve()
    path = root / 'data/events.json'
    if not path.exists():
        return {'version': 1, 'events': []}
    safe_file(root, 'data/events.json')
    value = read_json(path)
    if not isinstance(value, dict) or set(value) != {'version', 'events'} or value['version'] != 1 or not isinstance(value['events'], list) or len(value['events']) > 5000:
        raise RecordError('保存されたログの形式が正しくありません。上書きせず停止します。')
    # Evidence existence is checked when appending and serving links. A later
    # removed reference must not hide the historical event itself.
    events = [normalize_event(event, root, check_evidence=False) for event in value['events']]
    if len({event['id'] for event in events}) != len(events):
        raise RecordError('保存されたログのIDが重複しています。')
    return {'version': 1, 'events': events}


def append_event(value, root=ROOT):
    root = Path(root).resolve()
    data_folder = root / 'data'
    data_folder.mkdir(exist_ok=True)
    if data_folder.is_symlink() or getattr(data_folder.lstat(), 'st_file_attributes', 0) & getattr(stat, 'FILE_ATTRIBUTE_REPARSE_POINT', 0x400):
        raise RecordError('保存先がリンクになっています。')
    lock = data_folder / '.writer.lock'
    try:
        lock_fd = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    except FileExistsError:
        raise RecordError('別の書き込みか中断したロックが残っています。書き込みを停止します。') from None
    temporary = data_folder / f'.events-{uuid.uuid4().hex}.tmp'
    try:
        os.close(lock_fd)
        store = read_events(root)
        candidate = dict(value)
        existing = next((e for e in store['events'] if e['id'] == candidate.get('id')), None)
        candidate.setdefault('time', existing['time'] if existing else datetime.now(timezone.utc).isoformat())
        for key, default in {'reason': '', 'evidence': [], 'next': '', 'outcome': 'recorded'}.items():
            candidate.setdefault(key, default)
        candidate = normalize_event(candidate, root)
        if existing:
            if existing != candidate:
                raise RecordError('同じIDに異なる内容があります。新しいIDで訂正を追記してください。')
            return {'result': 'unchanged', 'event': existing}
        if len(store['events']) >= 5000:
            raise RecordError('5000件の上限に達しています。')
        store['events'].append(candidate)
        encoded = (json.dumps(store, ensure_ascii=False, indent=2) + '\n').encode('utf-8')
        if len(encoded) > MAX_BYTES:
            raise RecordError('保存後のログが5MBを超えます。')
        with temporary.open('xb') as output:
            output.write(encoded)
            output.flush()
            os.fsync(output.fileno())
        os.replace(temporary, data_folder / 'events.json')
        return {'result': 'appended', 'event': candidate}
    finally:
        if temporary.exists():
            temporary.unlink()
        lock.unlink()


def markdown(store):
    def safe(text):
        return re.sub(r'([\\`*_{}\[\]<>#|])', r'\\\1', str(text))
    lines = ['# AIDE 実行ログ', '', '> イベントの結果は監査合格や採用を意味しません。状態は design/state.md を参照してください。', '']
    for e in store['events']:
        lines += [f'## {safe(e["title"])}', '', f'- ID: {safe(e["id"])}', f'- 記録時刻: {e["time"]}', f'- 担当: {safe(e["actor"])}', f'- 工程: {e["phase"]}', f'- 結果: {e["outcome"]}', '', safe(e['body']), '']
        if e['reason']:
            lines += ['判断理由: ' + safe(e['reason']), '']
        lines += ['根拠: ' + safe(path) for path in e['evidence']]
        if e['next']:
            lines += ['', '次の操作: ' + safe(e['next'])]
        lines += ['', '---', '']
    return '\n'.join(lines)


def main():
    parser = argparse.ArgumentParser(description='AIの観測結果を追記する。監査/採用状態は変更しません。')
    parser.add_argument('--root', type=Path, default=ROOT)
    for key in ['id', 'actor', 'phase', 'kind', 'title', 'body']:
        parser.add_argument('--' + key, required=True)
    for key in ['reason', 'next']:
        parser.add_argument('--' + key, default='')
    parser.add_argument('--time')
    parser.add_argument('--outcome', default='recorded', choices=OUTCOMES)
    parser.add_argument('--evidence', action='append', default=[])
    values = vars(parser.parse_args())
    root = values.pop('root')
    if values['time'] is None:
        values.pop('time')
    try:
        print(json.dumps(append_event(values, root), ensure_ascii=False))
    except (RecordError, OSError, ValueError) as error:
        print(json.dumps({'error': str(error)}, ensure_ascii=False), file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
