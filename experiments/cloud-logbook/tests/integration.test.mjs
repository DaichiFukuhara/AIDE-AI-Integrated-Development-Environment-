import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import {mkdtemp,readFile,readdir,rm,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import http from 'node:http';
import {fixtureToken} from '../dev/fixture-store.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
test('actual CLI saves offline, flushes unchanged into actual API and reads authenticated logs',async()=>{
  const temp=await mkdtemp(tmpdir()+'/cloud-logbook-');
  const child=spawn(process.execPath,['scripts/dev.mjs','--fixture'],{cwd:root,env:{...process.env,PORT:'4194'},stdio:['ignore','pipe','pipe']});
  try{
    await new Promise((resolve,reject)=>{child.stdout.once('data',resolve);child.once('error',reject);child.once('exit',code=>reject(new Error('server exited '+code)));});
    const cli=(args,env={})=>spawnSync('python',['cli/logbook.py','--queue',temp,...args],{cwd:root,encoding:'utf8',env:{...process.env,LOGBOOK_URL:'http://127.0.0.1:4194',LOGBOOK_TOKEN:fixtureToken,...env}});
    for(const source of ['codex-local','claude-local','codex-cloud','claude-cloud']){
      const r=cli(['record','--id',source,'--project','aide','--run','integration','--source',source,'--actor','Test sender','--title','CLI integration '+source,'--body','Durable queue boundary test','--offline']);assert.equal(r.status,0,r.stderr);assert.ok(!r.stdout.includes(fixtureToken));
    }
    const names=(await readdir(temp)).filter(n=>n.endsWith('.json'));assert.equal(names.length,4);const before=await readFile(temp+'/'+names[0]);
    const denied=cli(['flush'],{LOGBOOK_TOKEN:'wrong-writer-token-0000000000'});assert.equal(denied.status,2);assert.ok(denied.stdout.includes('401'));assert.deepEqual(await readFile(temp+'/'+names[0]),before);
    const offline=cli(['flush'],{LOGBOOK_URL:'http://127.0.0.1:1'});assert.equal(offline.status,2);assert.deepEqual(await readFile(temp+'/'+names[0]),before);
    const sent=cli(['flush']);assert.equal(sent.status,0,sent.stderr);assert.equal((await readdir(temp)).filter(n=>n.endsWith('.json')).length,0);
    // A lost acknowledgement can cause a replay; the persisted content receives duplicate success.
    await writeFile(temp+'/'+names[0],before);const replay=cli(['flush']);assert.equal(replay.status,0);
    const login=await fetch('http://127.0.0.1:4194/api/session',{method:'POST',headers:{Origin:'http://127.0.0.1:4194','Content-Type':'application/json'},body:JSON.stringify({email:'reader@example.test',password:'local-fixture-only'})});assert.equal(login.status,200);const cookie=login.headers.getSetCookie().map(s=>s.split(';')[0]).join('; ');
    const read=await fetch('http://127.0.0.1:4194/api/events',{headers:{Cookie:cookie}});const data=await read.json();assert.equal(data.events.length,4);assert.deepEqual(new Set(data.events.map(r=>r.event.source)),new Set(['codex-local','claude-local','codex-cloud','claude-cloud']));assert.deepEqual(data.events.find(r=>r.event.id===JSON.parse(before).id).event,JSON.parse(before));
    await writeFile(temp+'/.lock','test-lock');const locked=cli(['flush']);assert.equal(locked.status,3);assert.ok(!locked.stderr.includes(fixtureToken));await rm(temp+'/.lock');
    const invalid=cli(['record','--project','aide','--run','x','--source','codex-local','--actor','Test','--title','bad','--evidence','../secret','--offline']);assert.equal(invalid.status,2);assert.equal((await readdir(temp)).filter(n=>n.endsWith('.json')).length,0);
  }finally{child.kill();await rm(temp,{recursive:true,force:true});}
});
test('CLI refuses redirects and retains pending event without exposing token',async()=>{
  const temp=await mkdtemp(tmpdir()+'/cloud-logbook-redirect-');let requests=0;
  const server=http.createServer((req,res)=>{requests++;res.writeHead(302,{Location:'http://127.0.0.1:4194/steal'});res.end();});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try{
    const args=['cli/logbook.py','--queue',temp,'record','--project','aide','--run','redirect','--source','codex-local','--actor','Test','--title','Redirect'];
    // Async child avoids blocking the test HTTP server while the request is in flight.
    const child=spawn('python',args,{cwd:root,env:{...process.env,LOGBOOK_URL:`http://127.0.0.1:${server.address().port}`,LOGBOOK_TOKEN:fixtureToken}});let output='';child.stdout.on('data',d=>output+=d);child.stderr.on('data',d=>output+=d);const code=await new Promise(resolve=>child.on('exit',resolve));assert.equal(code,2);assert.equal(requests,1);assert.equal((await readdir(temp)).filter(n=>n.endsWith('.json')).length,1);assert.ok(!output.includes(fixtureToken));
  }finally{await new Promise(resolve=>server.close(resolve));await rm(temp,{recursive:true,force:true});}
});
