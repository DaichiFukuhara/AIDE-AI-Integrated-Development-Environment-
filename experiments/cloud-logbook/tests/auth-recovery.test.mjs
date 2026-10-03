import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {supabase} from '../lib/supabase.mjs';
import {createService} from '../lib/service.mjs';

const source=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
const origin='http://127.0.0.1:4195';
const row={sequence:'1',event:{id:'OLD',time:'2026-10-03T01:00:00Z',project:'aide',run:'auth',source:'codex-local',actor:'Test',phase:'implementation',kind:'action',title:'前回ログ',body:'保持する内容',reason:'障害回帰',evidence:[],next:'再取得',outcome:'recorded'}};

// The actual adapter, service and UI run together; only transport and DOM are stubs.
// This proves program behavior, not browser rendering or live Supabase Auth.
function fixture(route,initialFault=null){
  const state={fault:initialFault,listCalls:0,cookie:'lb_access=ACCESS; lb_refresh=REFRESH',responses:[],paths:[]};
  const client=supabase({url:'https://stub.invalid',anon:'ANON',service:'SERVICE'},async(url)=>{
    const user=url.includes('/auth/v1/user');
    const refresh=url.includes('grant_type=refresh_token');
    state.paths.push(user?'user':refresh?'refresh':'list');
    if(route==='refresh'&&user&&url&&!state.refreshed)return Response.json({code:'bad_jwt'},{status:401});
    if((route==='user'&&user)||(route==='refresh'&&refresh)){
      const fault=state.fault;
      if(fault==='network')throw new Error('PRIVATE_TRANSPORT_DETAIL');
      if(fault)return Response.json(fault.body||{message:'PRIVATE_UPSTREAM_DETAIL'},{status:fault.status});
    }
    if(refresh){state.refreshed=true;return Response.json({access_token:'NEW_ACCESS',refresh_token:'NEW_REFRESH'});}
    if(user)return Response.json({id:'owner',email:'reader@example.test'});
    state.listCalls++;
    return Response.json([{...row,sequence:String(state.listCalls),event:{...row.event,id:'ROW'+state.listCalls}}]);
  });
  const handle=createService({origin,writers:[]},client);
  state.request=async(path)=>{
    // Force the refresh fallback on each request when testing that route.
    state.refreshed=false;
    const response=await handle(new Request(origin+path,{headers:{Cookie:state.cookie}}));
    const cookies=response.headers.getSetCookie();
    state.responses.push({path,status:response.status,cookies});
    for(const cookie of cookies){
      const [name,value]=cookie.split(';')[0].split('=');
      const jar=Object.fromEntries(state.cookie.split('; ').filter(Boolean).map(c=>c.split('=')));
      if(cookie.includes('Max-Age=0'))delete jar[name];else jar[name]=value;
      state.cookie=Object.entries(jar).map(([k,v])=>k+'='+v).join('; ');
    }
    return response;
  };
  return state;
}

async function ui(state){
  const nodes=new Map();
  const element=()=>({children:[],hidden:false,disabled:false,textContent:'',value:'',open:false,classList:{toggle(){}},append(...children){this.children.push(...children);},replaceChildren(...children){this.children=children;},addEventListener(){},removeAttribute(name){delete this[name];},showModal(){this.open=true;},close(){this.open=false;}});
  const node=id=>{if(!nodes.has(id))nodes.set(id,element());return nodes.get(id);};
  const context=vm.createContext({document:{getElementById:node,createElement:element},URL,URLSearchParams,Blob,AbortSignal,FormData:class{entries(){return [];}},fetch:path=>state.request(path)});
  vm.runInContext(source+'\nglobalThis.probe={load,showDetail,exportRows,read:()=>({rows,next,activeQuery,epoch})};',context);
  for(let i=0;i<10;i++)await new Promise(resolve=>setImmediate(resolve));
  return {probe:context.probe,node};
}

for(const route of ['user','refresh']){
  for(const fault of [{status:500},{status:429},'network']){
    test(`${route}: ${typeof fault==='string'?fault:fault.status} retains cookies/UI and recovers`,async()=>{
      const state=fixture(route),page=await ui(state);
      assert.equal(page.probe.read().rows.length,1);
      page.probe.showDetail(page.probe.read().rows[0]);page.probe.exportRows('json');
      const before=JSON.stringify(page.probe.read());
      const cookies=state.cookie,detail=page.node('detail-body').children,exported=page.node('export-text').value;
      state.fault=fault;
      const session=await state.request('/api/session');
      assert.equal(session.status,503);assert.deepEqual(session.headers.getSetCookie(),[]);
      assert.deepEqual(await session.json(),{error:'storage_unavailable'});
      const calls=state.listCalls;
      await page.probe.load();
      assert.equal(state.responses.at(-1).status,503);
      assert.deepEqual(state.responses.at(-1).cookies,[]);
      assert.equal(state.cookie,cookies);assert.equal(state.listCalls,calls);
      assert.equal(JSON.stringify(page.probe.read()),before);
      assert.equal(page.node('detail-body').children,detail);
      assert.equal(page.node('export-text').value,exported);
      assert.equal(page.node('workspace').hidden,false);
      assert.match(page.node('status').textContent,/未更新/);
      assert.ok(!page.node('status').textContent.includes('PRIVATE'));
      state.fault=null;await page.probe.load();
      assert.equal(state.responses.at(-1).status,200);
      assert.equal(page.probe.read().rows[0].event.id,'ROW'+(calls+1));
      assert.equal(page.node('status').textContent,'保存先から取得しました。');
    });
  }
  for(const fault of [{status:400,body:{error:'invalid_grant'}},{status:401,body:{code:'bad_jwt'}},{status:403,body:{message:'Invalid Refresh Token: Refresh Token Not Found'}}]){
    test(`${route}: true rejection ${fault.status} clears cookies, rows, detail and export`,async()=>{
      const state=fixture(route),page=await ui(state);
      page.probe.showDetail(page.probe.read().rows[0]);page.probe.exportRows('json');
      // Without refresh, a rejected access token cannot be silently renewed.
      if(route==='user')state.cookie='lb_access=ACCESS';
      state.fault=fault;await page.probe.load();
      const response=state.responses.at(-1);
      assert.equal(response.status,401);assert.equal(response.cookies.length,2);
      assert.ok(response.cookies.every(c=>c.includes('Max-Age=0')));
      assert.equal(state.cookie,'');assert.equal(page.probe.read().rows.length,0);
      assert.equal(page.node('workspace').hidden,true);assert.equal(page.node('login').hidden,false);
      assert.equal(page.node('detail').open,false);assert.equal(page.node('detail-body').children.length,0);
      assert.equal(page.node('export').open,false);assert.equal(page.node('export-text').value,'');
      assert.equal(page.node('viewer').textContent,'');
      assert.match(page.node('status').textContent,/セッションが切れました/);
    });
  }
  for(const status of [400,401,403]){
    test(`${route}: unrecognized ${status} does not invalidate a session`,async()=>{
      const state=fixture(route,{status,body:{code:'unexpected_auth_failure'}});
      const response=await state.request('/api/events');
      assert.equal(response.status,503);assert.deepEqual(response.headers.getSetCookie(),[]);
      assert.equal(state.cookie,'lb_access=ACCESS; lb_refresh=REFRESH');
    });
  }
  test(`${route}: startup outage is unupdated and can retry with the same session`,async()=>{
    const state=fixture(route,{status:500}),page=await ui(state);
    assert.match(page.node('status').textContent,/未更新/);
    assert.equal(page.probe.read().epoch,0);
    assert.ok(state.cookie.includes('lb_refresh=REFRESH'));
    state.fault=null;
    const response=await state.request('/api/session');assert.equal(response.status,200);
    await page.probe.load();assert.equal(page.probe.read().rows.length,1);
  });
}

test('expired access token with a valid refresh token still renews and reads',async()=>{
  const state=fixture('refresh');const response=await state.request('/api/events');
  assert.equal(response.status,200);assert.equal(response.headers.getSetCookie().length,2);
  assert.ok(response.headers.getSetCookie().every(c=>!c.includes('Max-Age=0')));
  assert.ok(state.paths.includes('refresh'));assert.equal((await response.json()).events.length,1);
});
