import {randomBytes,createHash} from 'node:crypto';
import {mkdir,writeFile} from 'node:fs/promises';
const folder=new URL('../.local/',import.meta.url);await mkdir(folder,{recursive:true,mode:0o700});
const token=randomBytes(32).toString('base64url');const hash=createHash('sha256').update(token).digest('hex');
const file=new URL('writer-'+Date.now()+'.json',folder);
await writeFile(file,JSON.stringify({token,hash},null,2),{mode:0o600,flag:'wx'});
console.log('Writer token and hash saved locally to '+file.pathname+'. Set sender secret without pasting it into chat.');
