
import test from "node:test";import assert from "node:assert/strict";import fs from "node:fs";import path from "node:path";
const root=path.resolve(import.meta.dirname,"..");
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.name.startsWith(".")||e.name==="node_modules"||e.name==="test-artifacts"?[]:e.isDirectory()?walk(path.join(dir,e.name)):e.name.endsWith(".html")?[path.join(dir,e.name)]:[])}
test("maintained HTML routes, resources and static fragment targets resolve",()=>{
 const files=walk(root),data=new Map(files.map(file=>[file,fs.readFileSync(file,"utf8")])),failures=[];
 for(const [file,h] of data)for(const m of h.matchAll(/(?:href|src)="([^"]+)"/g)){
  const raw=m[1];if(/^(?:https?:|mailto:|tel:|data:|javascript:|blob:)/.test(raw))continue;
  const [url,hash]=raw.split("#"),part=url.split("?")[0];
  let target=part?path.resolve(part.startsWith("/")?root:path.dirname(file),part.replace(/^\//,"")):file;
  if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,"index.html");
  if(!fs.existsSync(target)){failures.push(path.relative(root,file)+": "+raw);continue;}
  if(hash&&data.has(target)&&!data.get(target).includes('id="'+decodeURIComponent(hash)+'"'))failures.push(path.relative(root,file)+": fragment "+raw);
 }
 assert.deepEqual(failures,[]);
});
