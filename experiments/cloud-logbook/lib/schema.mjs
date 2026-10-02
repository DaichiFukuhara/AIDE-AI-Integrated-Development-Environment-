export const sources = ['codex-local','claude-local','codex-cloud','claude-cloud'];
export const phases = ['intake','design','plan','implementation','verification','audit','adoption','closure'];
export const kinds = ['action','decision','check','issue'];
export const outcomes = ['recorded','pass','fail','unverified'];
export class Fault extends Error { constructor(status, code) { super(code); this.status=status; this.code=code; } }
const bad=()=>{throw new Fault(400,'invalid_event');};
export function identifier(s) { return typeof s==='string' && /^[A-Za-z0-9][A-Za-z0-9_.-]{0,95}$/.test(s); }
export function evidenceOK(s) {
  if(typeof s!=='string'||!s||s.length>2048||/[\s\x00-\x1f\\]/.test(s)) return false;
  if(s.startsWith('https://')) { try {const u=new URL(s);return !!u.hostname&&!u.username&&!u.password;}catch{return false;} }
  return !s.startsWith('/')&&!s.includes(':')&&s.split('/').every(p=>p&&p!=='.'&&p!=='..');
}
export function validateEvent(x) {
  const keys=['id','time','source','project','run','actor','phase','kind','title','body','reason','evidence','next','outcome'];
  if(!x||Array.isArray(x)||typeof x!=='object'||Object.keys(x).some(k=>!keys.includes(k))||keys.some(k=>!(k in x)))bad();
  for(const k of ['id','project','run'])if(!identifier(x[k]))bad();
  for(const [k,allowed] of [['source',sources],['phase',phases],['kind',kinds],['outcome',outcomes]])if(!allowed.includes(x[k]))bad();
  for(const [k,max] of [['actor',120],['title',240],['body',8000],['reason',4000],['next',2000]])if(typeof x[k]!=='string'||x[k].length>max||x[k].includes('\0')||(['actor','title'].includes(k)&&!x[k].trim()))bad();
  if(!Array.isArray(x.evidence)||x.evidence.length>20||!x.evidence.every(evidenceOK))bad();
  // Require explicit timezone; reject calendar rollover rather than silently fixing invalid input.
  const m=typeof x.time==='string'&&x.time.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/);
  if(!m||!Number.isFinite(Date.parse(x.time)))bad();
  const date=new Date(m[1]+'T'+m[2]+(m[3]||'')+'Z');
  if(!Number.isFinite(+date)||date.toISOString().slice(0,19)!==m[1]+'T'+m[2])bad();
  return {...x,time:new Date(x.time).toISOString(),evidence:[...x.evidence]};
}
export function canonical(x) { if(Array.isArray(x))return '['+x.map(canonical).join(',')+']'; if(x&&typeof x==='object')return '{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+canonical(x[k])).join(',')+'}';return JSON.stringify(x); }
export async function readJSON(req) {
  if(!req.headers.get('content-type')?.startsWith('application/json'))throw new Fault(415,'json_required');
  if(Number(req.headers.get('content-length'))>65536)throw new Fault(413,'too_large');
  const reader=req.body?.getReader();if(!reader)throw new Fault(400,'invalid_json');
  let size=0;const chunks=[];
  try{for(;;){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>65536){await reader.cancel();throw new Fault(413,'too_large');}chunks.push(value);}
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  }catch(e){if(e instanceof Fault)throw e;throw new Fault(400,'invalid_json');}
}
