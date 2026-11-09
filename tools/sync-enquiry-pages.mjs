import fs from "node:fs";import path from "node:path";import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const shared=fs.readFileSync(path.join(root,"assets/enquiry-contact.html"),"utf8");
for(const name of ["products.html","kits.html"]){const file=path.join(root,name);let h=fs.readFileSync(file,"utf8");const start=h.indexOf('<section id="quote"'),end=name==="products.html"?h.indexOf('<details class="catalog-reference',start):h.indexOf("</main>",start);if(start<0||end<0)throw new Error("Missing enquiry region: "+name);h=h.slice(0,start)+shared+"\n"+h.slice(end);fs.writeFileSync(file,h);}
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.name.startsWith(".")||["node_modules","test-artifacts"].includes(e.name)?[]:e.isDirectory()?walk(path.join(dir,e.name)):e.name.endsWith(".html")?[path.join(dir,e.name)]:[]);}
for(const file of walk(root)){let h=fs.readFileSync(file,"utf8");if(h.includes("assets/quote-state.js"))h=h.replace(/(?:assets\/quote-state|script)\.js\?v=[^"]+/g,m=>m.split("?")[0]+"?v=20261108-flow1");h=h.replace(/assets\/marketing\.css\?v=[^"]+/g,"assets/marketing.css?v=20261108-flow1");fs.writeFileSync(file,h);}
console.log("Synchronized shared enquiry contact flow and asset revisions.");
