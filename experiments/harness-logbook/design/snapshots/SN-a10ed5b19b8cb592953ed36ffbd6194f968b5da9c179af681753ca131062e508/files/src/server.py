"""Read-only localhost server for the logbook and its evidence."""
from functools import partial
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit
import argparse
import hashlib
import json

from logbook import ROOT, RecordError, markdown, read_events, safe_file


def read_context(root):
    path = safe_file(root, 'design/state.md')
    text = path.read_text(encoding='utf-8')
    meta = json.loads(text.split('---', 2)[1])
    fields = ['plan', 'trial', 'audit', 'adoption', 'cycle', 'human_evaluation', 'next']
    if not isinstance(meta.get('display'), dict) or any(not isinstance(meta['display'].get(field), str) for field in fields):
        raise RecordError('台帳の表示状態が不足しています。')
    return {'project_id': meta['project_id'], 'revision': meta['revision'], 'current_bundle': meta['current_bundle'], 'display': meta['display'], 'observed_at': meta['observed_at'], 'source': 'design/state.md', 'source_sha256': hashlib.sha256(text.encode('utf-8')).hexdigest(), 'plan_subject': meta['operations']['OP-PLAN-001']['subject_hash']}


class Handler(BaseHTTPRequestHandler):
    def __init__(self, *args, root=ROOT, **kwargs):
        self.root = Path(root).resolve()
        super().__init__(*args, **kwargs)

    def send_data(self, data, content_type, status=200, filename=None):
        if isinstance(data, str):
            data = data.encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', content_type)
        self.send_header('Content-Length', str(len(data)))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Content-Security-Policy', "default-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'")
        if filename:
            self.send_header('Content-Disposition', f'attachment; filename="{filename}"')
        self.end_headers()
        self.wfile.write(data)

    def json_data(self, value, status=200):
        self.send_data(json.dumps(value, ensure_ascii=False), 'application/json; charset=utf-8', status)

    def do_GET(self):
        path = unquote(urlsplit(self.path).path)
        try:
            if path == '/api/events':
                return self.json_data(read_events(self.root))
            if path == '/api/context':
                return self.json_data(read_context(self.root))
            if path == '/export/events.json':
                return self.send_data(json.dumps(read_events(self.root), ensure_ascii=False, indent=2), 'application/json; charset=utf-8', filename='aide-events.json')
            if path == '/export/events.md':
                return self.send_data(markdown(read_events(self.root)), 'text/markdown; charset=utf-8', filename='aide-events.md')
            if path.startswith('/evidence/'):
                evidence = safe_file(self.root, path[len('/evidence/'):])
                # References are evidence text, never executable web documents.
                return self.send_data(evidence.read_bytes(), 'text/plain; charset=utf-8')
            assets = {'/': ('index.html', 'text/html'), '/index.html': ('index.html', 'text/html'), '/styles.css': ('styles.css', 'text/css'), '/app.js': ('app.js', 'text/javascript'), '/view.mjs': ('view.mjs', 'text/javascript')}
            if path in assets:
                filename, mime = assets[path]
                return self.send_data(safe_file(self.root, 'src/' + filename).read_bytes(), mime + '; charset=utf-8')
            self.json_data({'error': 'Not found'}, 404)
        except (RecordError, OSError, ValueError, KeyError, IndexError) as error:
            self.json_data({'error': str(error)}, 500 if path.startswith('/api/') or path.startswith('/export/') else 404)

    def do_POST(self):
        self.json_data({'error': '読取専用です。AIはCLIから記録してください。'}, 405)

    do_PUT = do_POST
    do_DELETE = do_POST


def create_server(root=ROOT, port=4183):
    return ThreadingHTTPServer(('127.0.0.1', port), partial(Handler, root=root))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=4183)
    args = parser.parse_args()
    server = create_server(port=args.port)
    print(f'AIDE Logbook: http://127.0.0.1:{server.server_port}', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
