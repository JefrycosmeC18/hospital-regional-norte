import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,statSync} from 'node:fs';
import {join} from 'node:path';
const walk=p=>readdirSync(p).flatMap(x=>{const f=join(p,x);return statSync(f).isDirectory()?walk(f):[f];});
test('15 páginas originales, usuarios adicional y 16 CSS',()=>{assert.equal(readdirSync('src/pages').filter(x=>x.endsWith('.jsx')).length,16);assert.equal(readdirSync('public/css').filter(x=>x.endsWith('.css')).length,16);});
test('Rutas internas declaradas y módulos relativos resolubles',()=>{const app=readFileSync('src/App.jsx','utf8');const routes=new Set([...app.matchAll(/\['(\/[^']*)',\w+Page/g)].map(m=>m[1]));for(const file of walk('src').filter(f=>/\.(jsx|js)$/.test(f))){const code=readFileSync(file,'utf8');for(const m of code.matchAll(/\bto="(\/[^"?#]*)/g))assert.ok(routes.has(m[1]),`${file}: ${m[1]}`);for(const m of code.matchAll(/from ['"](\.[^'"]+)['"]/g)){const root=join(file,'..',m[1]);assert.ok(['','.js','.jsx','.css'].some(ext=>{try{return statSync(root+ext).isFile();}catch{return false;}}),`${file}: ${m[1]}`);}}});
test('Sin cadenas PostgreSQL, SDK de Neon ni HTML inyectado en src',()=>{for(const f of walk('src').filter(x=>/\.(jsx|js)$/.test(x))){const code=readFileSync(f,'utf8');assert.doesNotMatch(code,/postgres(?:ql)?:\/\/|@neondatabase\/serverless|dangerouslySetInnerHTML|\.innerHTML\s*=/i,f);}});
