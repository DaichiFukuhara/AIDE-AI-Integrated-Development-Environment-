// Explicit local boundary stub. Never imported by Vercel functions; not PostgreSQL verification.
import {Fault,canonical} from '../lib/schema.mjs';
export const fixtureOwner='11111111-1111-4111-8111-111111111111';
export const fixtureToken='local-fixture-writer-token-0001';
export function fixtureStore(){
  const rows=[];const sessions=new Map();let seq=0n;
  const users={'reader@example.test':fixtureOwner,'other@example.test':'22222222-2222-4222-8222-222222222222'};
  function user(token){const u=sessions.get(token);if(!u)throw new Fault(401,'authentication_failed');return u;}
  return {rows,
    async login(email,password){if(!users[email]||password!=='local-fixture-only')throw new Fault(401,'authentication_failed');const token=crypto.randomUUID();sessions.set(token,{id:users[email],email});return {access_token:token,refresh_token:token};},
    async user(token){return user(token);},async refresh(token){user(token);return {access_token:token,refresh_token:token};},async logout(token){sessions.delete(token);},
    async record(owner,event){const found=rows.find(r=>r.owner===owner&&r.event.id===event.id);if(found)return {status:canonical(found.event)===canonical(event)?'duplicate':'conflict',sequence:found.sequence};const sequence=String(++seq);rows.push({owner,event,sequence});return {status:'inserted',sequence};},
    async list(token,p){const owner=user(token).id;return rows.filter(r=>r.owner===owner&&(!p.p_project||r.event.project===p.p_project)&&(!p.p_source||r.event.source===p.p_source)&&(!p.p_run||r.event.run===p.p_run)&&(!p.p_before||BigInt(r.sequence)<BigInt(p.p_before))&&(!p.p_query||canonical(r.event).toLowerCase().includes(p.p_query.toLowerCase()))).reverse().slice(0,p.p_limit).map(({event,sequence})=>({event,sequence}));}
  };
}
