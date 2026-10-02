import {createHash,timingSafeEqual} from 'node:crypto';
import {Fault,validateEvent,identifier,readJSON} from './schema.mjs';
import {supabase} from './supabase.mjs';
export const hashToken=t=>createHash('sha256').update(t).digest('hex');
export function configuration(env=process.env) {
  let writers;try{writers=JSON.parse(env.LOGBOOK_WRITERS||'[]');}catch{throw new Fault(503,'configuration_required');}
  const c={url:env.SUPABASE_URL,anon:env.SUPABASE_ANON_KEY,service:env.SUPABASE_SERVICE_ROLE_KEY,origin:env.APP_ORIGIN,writers};
  let u,o;try{u=new URL(c.url);o=new URL(c.origin);}catch{throw new Fault(503,'configuration_required');}
  if(u.protocol!=='https:'||u.username||u.password||u.pathname!=='/'||o.origin!==c.origin||o.username||o.password||!['https:','http:'].includes(o.protocol)||(o.protocol==='http:'&&!['127.0.0.1','localhost','[::1]'].includes(o.hostname))||!c.anon||!c.service||!Array.isArray(writers)||!writers.length)throw new Fault(503,'configuration_required');
  for(const w of writers)if(!/^[a-f0-9]{64}$/.test(w.hash)||!/^[a-f0-9-]{36}$/i.test(w.owner)||!identifier(w.project)||!Array.isArray(w.sources)||!w.sources.length||w.sources.some(s=>!['codex-local','claude-local','codex-cloud','claude-cloud'].includes(s))||(w.run!==undefined&&!identifier(w.run)))throw new Fault(503,'configuration_required');
  return c;
}
export function createService(c,store=supabase(c)) {
  function cookies(req){const out={};for(const part of (req.headers.get('cookie')||'').split(';')){const i=part.indexOf('=');if(i>0){try{out[part.slice(0,i).trim()]=decodeURIComponent(part.slice(i+1));}catch{}}}return out;}
  function sessionCookies(session,headers){for(const [name,value,age] of [['lb_access',session?.access_token||'',session?3600:0],['lb_refresh',session?.refresh_token||'',session?2592000:0]])headers.append('Set-Cookie',`${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${age}${c.origin.startsWith('https:')?'; Secure':''}`);}
  function sameOrigin(req){if(req.headers.get('origin')!==c.origin)throw new Fault(403,'origin_denied');}
  async function viewer(req,headers){const ck=cookies(req);if(!ck.lb_access&&!ck.lb_refresh)throw new Fault(401,'login_required');
    try{if(ck.lb_access){try{return {token:ck.lb_access,user:await store.user(ck.lb_access)};}catch(e){if(e.status!==401)throw e;}}
      if(!ck.lb_refresh)throw new Fault(401,'login_required');
      const session=await store.refresh(ck.lb_refresh);const user=await store.user(session.access_token);sessionCookies(session,headers);return {token:session.access_token,user};
    }catch(e){if(e.status===401)sessionCookies(null,headers);throw e;}
  }
  return async function handle(req){const headers=new Headers({'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Vary':'Cookie'});
    try{const url=new URL(req.url);const path=url.pathname;
      if(path==='/api/health'&&req.method==='GET')return response({configured:true},200);
      if(path==='/api/session'){
        if(req.method==='POST'){sameOrigin(req);const b=await readJSON(req);if(typeof b.email!=='string'||b.email.length>254||typeof b.password!=='string'||!b.password||b.password.length>1024)throw new Fault(400,'invalid_login');const s=await store.login(b.email,b.password);const user=await store.user(s.access_token);sessionCookies(s,headers);return response({user:{email:user.email}},200);}
        if(req.method==='DELETE'){sameOrigin(req);const ck=cookies(req);sessionCookies(null,headers);if(ck.lb_access||ck.lb_refresh){try{let token=ck.lb_access;if(!token)token=(await store.refresh(ck.lb_refresh)).access_token;await store.logout(token);}catch(e){return response({error:e.code||'logout_failed'},e.status||503);}}return response({loggedOut:true},200);}
        if(req.method==='GET'){const {user}=await viewer(req,headers);return response({user:{email:user.email}},200);}
      }
      if(path==='/api/events'&&req.method==='POST'){
        const token=req.headers.get('authorization')?.match(/^Bearer ([^\s]{24,512})$/)?.[1];if(!token)throw new Fault(401,'writer_denied');const hash=Buffer.from(hashToken(token),'hex');
        const writer=c.writers.find(w=>timingSafeEqual(hash,Buffer.from(w.hash,'hex')));if(!writer)throw new Fault(401,'writer_denied');
        const event=validateEvent(await readJSON(req));if(event.project!==writer.project||!writer.sources.includes(event.source)||(writer.run!==undefined&&event.run!==writer.run))throw new Fault(403,'scope_denied');
        const result=await store.record(writer.owner,event);if(result.status==='conflict')throw new Fault(409,'event_conflict');if(!['inserted','duplicate'].includes(result.status))throw new Fault(503,'storage_unavailable');return response(result,result.status==='inserted'?201:200);
      }
      if(path==='/api/events'&&req.method==='GET'){
        const {token}=await viewer(req,headers);const params={p_project:url.searchParams.get('project')||null,p_source:url.searchParams.get('source')||null,p_run:url.searchParams.get('run')||null,p_query:url.searchParams.get('q')||'',p_before:url.searchParams.get('before')||null,p_limit:50};
        if(params.p_query.length>200||['p_project','p_run'].some(k=>params[k]&&!identifier(params[k]))||(params.p_source&&!['codex-local','claude-local','codex-cloud','claude-cloud'].includes(params.p_source))||(params.p_before&&!/^[1-9]\d{0,18}$/.test(params.p_before)))throw new Fault(400,'invalid_filter');
        const rows=await store.list(token,{...params,p_limit:51});if(!Array.isArray(rows))throw new Fault(503,'storage_unavailable');const more=rows.length>50;const events=rows.slice(0,50);return response({events,next:more?events.at(-1).sequence:null},200);
      }
      throw new Fault(405,'method_or_route_denied');
    }catch(e){return response({error:e instanceof Fault?e.code:'service_unavailable'},e instanceof Fault?e.status:503);}
    function response(body,status){return new Response(JSON.stringify(body),{status,headers});}
  };
}
let singleton;
export async function handler(req){try{singleton??=createService(configuration());return await singleton(req);}catch{return new Response(JSON.stringify({error:'configuration_required'}),{status:503,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});}}
