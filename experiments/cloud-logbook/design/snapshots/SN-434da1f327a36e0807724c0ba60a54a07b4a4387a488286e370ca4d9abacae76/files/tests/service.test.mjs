import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createService,hashToken,configuration} from '../lib/service.mjs';
import {validateEvent,Fault} from '../lib/schema.mjs';
import {fixtureStore,fixtureOwner,fixtureToken} from '../dev/fixture-store.mjs';
import {supabase} from '../lib/supabase.mjs';
const origin='http://127.0.0.1:4193';
const event=(extra={})=>({id:'E001',time:'2026-10-03T10:00:00+09:00',project:'aide',run:'run1',source:'codex-local',actor:'Codex',phase:'implementation',kind:'action',title:'記録',body:'作業内容',reason:'追えるように',evidence:['src/main.js','https://example.com/proof'],next:'確認する',outcome:'recorded',...extra});
function setup(){const store=fixtureStore();return {store,handle:createService({origin,writers:[{hash:hashToken(fixtureToken),owner:fixtureOwner,project:'aide',sources:['codex-local','claude-local','codex-cloud','claude-cloud']}]},store)};}
const req=(path,method='GET',body,headers={})=>new Request(origin+path,{method,headers:{...(body?{'Content-Type':'application/json'}:{}),...headers},...(body?{body:JSON.stringify(body)}:{})});
const writer={Authorization:'Bearer '+fixtureToken};
async function login(handle,email='reader@example.test'){const r=await handle(req('/api/session','POST',{email,password:'local-fixture-only'},{Origin:origin}));assert.equal(r.status,200);const cookies=r.headers.getSetCookie();assert.equal(cookies.length,2);assert.ok(cookies.every(x=>x.includes('HttpOnly')&&x.includes('SameSite=Strict')));return {Cookie:cookies.map(c=>c.split(';')[0]).join('; ')};}
test('event validation rejects malformed paths, dates, unknown fields and normalizes time',()=>{
  assert.equal(validateEvent(event()).time,'2026-10-03T01:00:00.000Z');
  for(const x of [event({time:'2026-02-30T10:00:00Z'}),event({time:'2026-10-03T10:00:00'}),event({project:'../x'}),event({evidence:['../secret']}),event({evidence:['C:\\secret']}),event({evidence:['https://u:p@example.com']}),event({source:'invented'}),event({title:''}),event({body:'x'.repeat(8001)}),event({extra:'unexpected'})])assert.throws(()=>validateEvent(x),Fault);
});
test('configuration refuses insecure cloud, bad writer and origin',()=>{
  const env={SUPABASE_URL:'https://example.supabase.co',SUPABASE_ANON_KEY:'anon',SUPABASE_SERVICE_ROLE_KEY:'service',APP_ORIGIN:origin,LOGBOOK_WRITERS:JSON.stringify([{hash:hashToken(fixtureToken),owner:fixtureOwner,project:'aide',sources:['codex-local']}])};
  assert.equal(configuration(env).origin,origin);
  for(const changed of [{SUPABASE_URL:'http://example.com'},{APP_ORIGIN:'http://public.example.com'},{LOGBOOK_WRITERS:'[]'},{LOGBOOK_WRITERS:'bad'}])assert.throws(()=>configuration({...env,...changed}),Fault);
});
test('writer denial, scoped write, idempotence and immutable conflict under concurrency',async()=>{
  const {store,handle}=setup();assert.equal((await handle(req('/api/events','POST',event()))).status,401);
  assert.equal((await handle(req('/api/events','POST',event(),{Authorization:'Bearer '+fixtureToken+'bad'}))).status,401);
  assert.equal((await handle(req('/api/events','POST',event({project:'other'}),writer))).status,403);
  const responses=await Promise.all(Array.from({length:10},()=>handle(req('/api/events','POST',event(),writer))));assert.equal(responses.filter(r=>r.status===201).length,1);assert.equal(responses.filter(r=>r.status===200).length,9);assert.equal(store.rows.length,1);
  assert.equal((await handle(req('/api/events','POST',event({body:'changed'}),writer))).status,409);assert.equal(store.rows[0].event.body,'作業内容');
  assert.equal((await handle(req('/api/events','GET',undefined,writer))).status,401);
});
test('viewer isolation, login CSRF, pagination, search, refresh and logout',async()=>{
  const {store,handle}=setup();assert.equal((await handle(req('/api/session','POST',{email:'reader@example.test',password:'local-fixture-only'}))).status,403);
  const reader=await login(handle),other=await login(handle,'other@example.test');
  for(let i=0;i<55;i++)assert.equal((await handle(req('/api/events','POST',event({id:'ID'+i,source:['codex-local','claude-local','codex-cloud','claude-cloud'][i%4]}),writer))).status,201);
  const data=await (await handle(req('/api/events','GET',undefined,reader))).json();assert.equal(data.events.length,50);assert.equal(data.next,'6');assert.equal(typeof data.events[0].sequence,'string');
  const rest=await (await handle(req('/api/events?before='+data.next,'GET',undefined,reader))).json();assert.equal(rest.events.length,5);assert.equal(rest.next,null);
  assert.equal((await (await handle(req('/api/events','GET',undefined,other))).json()).events.length,0);
  assert.equal((await (await handle(req('/api/events?source=claude-cloud&q=%E4%BD%9C%E6%A5%AD','GET',undefined,reader))).json()).events.length,13);
  assert.equal((await handle(req('/api/events?before=-1','GET',undefined,reader))).status,400);
  const refreshOnly={Cookie:reader.Cookie.split('; ')[1]};assert.equal((await handle(req('/api/session','GET',undefined,refreshOnly))).status,200);
  assert.equal((await handle(req('/api/session','DELETE',undefined,{...reader,Origin:origin}))).status,200);
  assert.equal((await handle(req('/api/events','GET',undefined,reader))).status,401);
  assert.equal(store.rows.length,55);
});
test('run and source restrictions, body size and sanitized backend failure',async()=>{
  const store=fixtureStore();const handle=createService({origin,writers:[{hash:hashToken(fixtureToken),owner:fixtureOwner,project:'aide',sources:['codex-local'],run:'run1'}]},store);
  assert.equal((await handle(req('/api/events','POST',event({run:'run2'}),writer))).status,403);
  assert.equal((await handle(req('/api/events','POST',event({source:'claude-cloud'}),writer))).status,403);
  assert.equal((await handle(req('/api/events','POST',{large:'x'.repeat(66000)},writer))).status,413);
  store.record=()=>{throw new Error('SECRET_INTERNAL_PASSWORD');};const r=await handle(req('/api/events','POST',event(),writer));assert.equal(r.status,503);assert.ok(!(await r.text()).includes('SECRET'));
});
test('Supabase boundary uses service key only for insertion and viewer JWT only for reader',async()=>{
  const calls=[];const client=supabase({url:'https://example.supabase.co',anon:'ANON',service:'SECRET'},async(url,options)=>{calls.push({url,options});return Response.json({status:'inserted'});});
  await client.record(fixtureOwner,event());await client.list('VIEWER',{p_limit:51});await client.logout('VIEWER');
  assert.equal(calls[0].options.headers.Authorization,'Bearer SECRET');assert.equal(calls[1].options.headers.Authorization,'Bearer VIEWER');assert.equal(calls[1].options.headers.apikey,'ANON');assert.equal(calls[0].options.redirect,'error');assert.ok(calls[2].url.endsWith('scope=local'));
  const unavailable=supabase({url:'https://example.supabase.co',anon:'ANON',service:'SECRET'},async()=>{throw new Error('SECRET');});await assert.rejects(()=>unavailable.record(fixtureOwner,event()),e=>e.message==='storage_unavailable');
});
