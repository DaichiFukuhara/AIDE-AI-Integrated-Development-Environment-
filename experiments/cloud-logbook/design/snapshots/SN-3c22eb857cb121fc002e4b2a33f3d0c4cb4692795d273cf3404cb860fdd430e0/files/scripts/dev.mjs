import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createService,configuration,hashToken} from '../lib/service.mjs';
import {fixtureOwner,fixtureToken,fixtureStore} from '../dev/fixture-store.mjs';
const root=fileURLToPath(new URL('../public/',import.meta.url));
const port=Number(process.env.PORT||4193);const origin=`http://127.0.0.1:${port}`;
const fixture=process.argv.includes('--fixture');
let service;
try{service=fixture?createService({origin,writers:[{hash:hashToken(fixtureToken),owner:fixtureOwner,project:'aide',sources:['codex-local','claude-local','codex-cloud','claude-cloud']}]},fixtureStore()):createService(configuration());}catch{service=async()=>new Response(JSON.stringify({error:'configuration_required'}),{status:503,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});}
const files={'/':'index.html','/index.html':'index.html','/styles.css':'styles.css','/app.js':'app.js'};
http.createServer(async(req,res)=>{
  try{const url=new URL(req.url,origin);if(url.pathname.startsWith('/api/')){
      if(url.pathname==='/api/health'&&fixture){res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify({configured:true,fixture:true}));return;}
      const request=new Request(origin+req.url,{method:req.method,headers:req.headers,...(['GET','HEAD'].includes(req.method)?{}:{body:req,duplex:'half'})});
      const response=await service(request);res.statusCode=response.status;for(const [k,v] of response.headers)if(k!=='set-cookie')res.setHeader(k,v);const cookies=response.headers.getSetCookie();if(cookies.length)res.setHeader('Set-Cookie',cookies);res.end(Buffer.from(await response.arrayBuffer()));return;
    }
    const name=files[url.pathname];if(!name){res.writeHead(404);res.end();return;}
    res.setHeader('Content-Type',name.endsWith('.html')?'text/html; charset=utf-8':name.endsWith('.css')?'text/css':'text/javascript');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.end(await readFile(root+name));
  }catch{res.writeHead(503);res.end('unavailable');}
}).listen(port,'127.0.0.1',()=>{console.log(origin);if(fixture)console.log('LOCAL FIXTURE: in-memory boundary stub; reader@example.test / local-fixture-only. No production connection.');});
