"""Replay actual observed CLI records after the intentionally restarted memory fixture."""
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'cli'))
import logbook
from records import ROOT,snapshot
folder=ROOT/'.local/restore-queue'
folder.mkdir(parents=True,exist_ok=True)
data=snapshot.read_json(ROOT/'evidence/TRIAL-003-cli-observations.json')
for event in data['events']:
    logbook.enqueue(folder,logbook.validate(event))
raise SystemExit(logbook.main(['--queue',str(folder),'--url','http://127.0.0.1:4193','flush']))
