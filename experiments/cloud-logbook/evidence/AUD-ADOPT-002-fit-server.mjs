// AUD-ADOPT-002 auditor FIT harness (Claude Opus 5.5). Not product code.
// Serves the fixed public/ files and the fixed createService + supabase adapter.
// Only the adapter's transport is replaced by an in-process fake Supabase Auth/PostgREST
// whose faults are switched from GET /__fault?route=user|refresh&mode=none|500|429|network|reject.
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createService} from '../lib/service.mjs';
import {supabase} from '../lib/supabase.mjs';

const root=fileURLToPath(new URL('../public/',import.meta.url));
const port=Number(process.env.PORT||4196);const origin=`http://127.0.0.1:${port}`;
const fault={route:'user',mode:'none'};let listCalls=0;let seq=0;
const access=new Set(),refresh=new Set();
const issue=()=>{const a='A'+(++seq),r='R'+seq;access.add(a);refresh.add(r);return {access_token:a,refresh_token:r};};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json'}});
function injected(kind){
  if(fault.route!==kind||fault.mode==='none')return null;
  if(fault.mode==='network')throw new Error('fake transport failure');
  if(fault.mode==='500')return json({message:'upstream error'},500);
  if(fault.mode==='429')return json({message:'rate limited'},429);
  if(fault.mode==='reject')return kind==='user'?json({code:403,error_code:'bad_jwt',msg:'invalid JWT: token is expired'},403):json({error:'invalid_grant',error_description:'Invalid Refresh Token: Refresh Token Not Found'},400);
  return null;
}
async function transport(url,options){
  const u=new URL(url);const token=options.headers.Authorization.slice(7);const body=options.body?JSON.parse(options.body):{};
  if(u.pathname==='/auth/v1/token'&&u.searchParams.get('grant_type')==='password'){
    if(body.email!=='reader@example.test'||body.password!=='local-fixture-only')return json({error:'invalid_grant',error_description:'Invalid login credentials'},400);
    return json(issue());
  }
  if(u.pathname==='/auth/v1/token'){const f=injected('refresh');if(f)return f;if(!refresh.delete(body.refresh_token))return json({error:'invalid_grant',error_description:'Invalid Refresh Token: Refresh Token Not Found'},400);return json(issue());}
  if(u.pathname==='/auth/v1/user'){
    // route=refresh: treat every access token as expired so the refresh path is exercised.
    if(fault.route==='refresh'&&fault.mode!=='none')return json({code:403,error_code:'bad_jwt',msg:'invalid JWT: token is expired'},403);
    const f=injected('user');if(f)return f;
    if(!access.has(token))return json({code:403,error_code:'bad_jwt',msg:'invalid JWT'},403);
    return json({id:'11111111-1111-4111-8111-111111111111',email:'reader@example.test'});
  }
  if(u.pathname==='/auth/v1/logout'){access.delete(token);return new Response(null,{status:204});}
  if(u.pathname==='/rest/v1/rpc/logbook_list'){
    listCalls++;
    const base={project:'aide',run:'fit-002',source:'claude-local',actor:'Auditor',phase:'audit',kind:'check',reason:'FIT',evidence:[],next:'次の確認',outcome:'recorded'};
    return json([{sequence:String(listCalls),event:{...base,id:'FIT'+listCalls,time:new Date().toISOString(),title:`取得 ${listCalls} 回目`,body:'監査用の表示行'}}]);
  }
  return json({message:'unexpected'},404);
}
const service=createService({origin,writers:[{hash:'0'.repeat(64),owner:'11111111-1111-4111-8111-111111111111',project:'aide',sources:['claude-local']}]},supabase({url:'https://fake.supabase.invalid',anon:'ANON',service:'SERVICE'},transport));
const files={'/':'index.html','/index.html':'index.html','/styles.css':'styles.css','/app.js':'app.js'};
http.createServer(async(req,res)=>{
  const url=new URL(req.url,origin);
  if(url.pathname==='/__fault'){fault.route=url.searchParams.get('route')||fault.route;fault.mode=url.searchParams.get('mode')||'none';res.setHeader('Content-Type','application/json');res.end(JSON.stringify({...fault,listCalls,access:access.size,refresh:refresh.size}));return;}
  if(url.pathname.startsWith('/api/')){
    const request=new Request(origin+req.url,{method:req.method,headers:req.headers,...(['GET','HEAD'].includes(req.method)?{}:{body:req,duplex:'half'})});
    const response=await service(request);res.statusCode=response.status;for(const [k,v] of response.headers)if(k!=='set-cookie')res.setHeader(k,v);const c=response.headers.getSetCookie();if(c.length)res.setHeader('Set-Cookie',c);res.end(Buffer.from(await response.arrayBuffer()));return;
  }
  const name=files[url.pathname];if(!name){res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type',name.endsWith('.html')?'text/html; charset=utf-8':name.endsWith('.css')?'text/css':'text/javascript');res.setHeader('Cache-Control','no-store');res.end(await readFile(root+name));
}).listen(port,'127.0.0.1',()=>console.log(origin));
