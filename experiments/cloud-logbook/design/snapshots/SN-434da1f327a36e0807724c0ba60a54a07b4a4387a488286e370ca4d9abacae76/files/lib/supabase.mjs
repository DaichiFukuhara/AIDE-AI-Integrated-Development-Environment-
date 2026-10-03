import {Fault} from './schema.mjs';
export function supabase(config, transport=fetch) {
  async function call(path,key,token,body,method='POST') {
    let r;try{r=await transport(config.url+path,{method,headers:{apikey:key,Authorization:'Bearer '+token,'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)}),redirect:'error',signal:AbortSignal.timeout(10000)});}catch{throw new Fault(503,'storage_unavailable');}
    if(!r.ok){
      if(path.startsWith('/auth/')){
        // Only a recognized credential/session rejection may invalidate the cookie.
        if([400,401,403].includes(r.status)){
          let error;try{error=await r.json();}catch{}
          const code=error?.error_code||error?.code||error?.error;
          const message=error?.msg||error?.message||error?.error_description||'';
          const rejected=['invalid_grant','invalid_credentials','invalid_token','bad_jwt','session_not_found','session_expired','refresh_token_not_found','refresh_token_already_used','user_not_found','user_banned'].includes(code)
            || /invalid (?:jwt|refresh token|login credentials)|jwt (?:expired|is expired)|refresh token (?:not found|has already been used)/i.test(message);
          if(rejected)throw new Fault(401,'authentication_failed');
        }
      }else if(r.status===401||r.status===403)throw new Fault(401,'authentication_failed');
      throw new Fault(503,'storage_unavailable');
    }
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
