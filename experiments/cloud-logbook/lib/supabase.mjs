import {Fault} from './schema.mjs';
export function supabase(config, transport=fetch) {
  async function call(path,key,token,body,method='POST') {
    let r;try{r=await transport(config.url+path,{method,headers:{apikey:key,Authorization:'Bearer '+token,'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)}),redirect:'error',signal:AbortSignal.timeout(10000)});}catch{throw new Fault(503,'storage_unavailable');}
    if(!r.ok){if(r.status===401||r.status===403||path.startsWith('/auth/'))throw new Fault(401,'authentication_failed');throw new Fault(503,'storage_unavailable');}
    if(r.status===204)return null;try{return await r.json();}catch{throw new Fault(503,'storage_unavailable');}
  }
  return {
    login:(email,password)=>call('/auth/v1/token?grant_type=password',config.anon,config.anon,{email,password}),
    refresh:refresh_token=>call('/auth/v1/token?grant_type=refresh_token',config.anon,config.anon,{refresh_token}),
    user:token=>call('/auth/v1/user',config.anon,token,undefined,'GET'),
    logout:token=>call('/auth/v1/logout?scope=local',config.anon,token,{}),
    record:(owner,event)=>call('/rest/v1/rpc/logbook_record',config.service,config.service,{p_owner:owner,p_event:event}),
    list:(token,params)=>call('/rest/v1/rpc/logbook_list',config.anon,token,params)
  };
}
