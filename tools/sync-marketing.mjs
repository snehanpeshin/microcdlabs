
import fs from "node:fs";import path from "node:path";import {fileURLToPath} from "node:url";import {renderSiteNavigation} from "./site-navigation.mjs";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
export function footer(prefix=""){const link=(href,label)=>'<a href="'+prefix+href+'">'+label+'</a>';return '<footer class="site-footer review-footer"><div><img class="footer-logo" src="'+prefix+'assets/microcd-labs-wordmark.svg?v=boxed" width="154" height="34" loading="lazy" alt="MicroCD Labs"><p>Engineering for microfluidics, assays, and diagnostic development.</p><a href="mailto:info@microcdlabs.com">info@microcdlabs.com</a><p><a href="https://www.linkedin.com/company/microcd-labs/" target="_blank" rel="noreferrer">LinkedIn</a></p></div><nav aria-label="Footer navigation">'+[["clair/","CLAIR"],["services.html","Engineering Services"],["tools.html","Research Tools"],["products.html","Research components &amp; sourcing"],["about.html","About"],["consultation.html","Contact"],["privacy.html","Website Privacy"],["terms.html","Terms & Payments"],["accessibility.html","Accessibility"],["credits.html","Image Credits"]].map(x=>link(...x)).join("")+'</nav><p class="review-footer-note">CLAIR is in development, not for sale or clinical use. Research components are enquiry categories; source and supply require review. Images may be representative. <a href="'+prefix+'refunds.html">Refunds & Returns</a></p></footer>';}
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{if(e.name.startsWith(".")||e.name==="node_modules")return [];const file=path.join(dir,e.name);return e.isDirectory()?walk(file):e.name.endsWith(".html")?[file]:[]})}
let count=0;for(const file of walk(root)){
 let h=fs.readFileSync(file,"utf8");if(!h.includes('class="site-header"'))continue;
 const relative=path.relative(root,file).split(path.sep).join("/"),prefix="../".repeat(relative.split("/").length-1);
 let action="consultation.html",label="Contact";
 if(relative==="clair/human.html"){action="consultation.html?project=clair-human#inquiry-title";label="Discuss human research";}
 else if(relative==="clair/veterinary.html"){action="consultation.html?project=clair-veterinary#inquiry-title";label="Discuss veterinary research";}
 else if(relative==="services.html"){action="consultation.html?project=microfluidic-development#inquiry-title";label="Request engineering support";}
 else if(relative==="products.html"||relative.startsWith("catalog/")){action="products.html#quote";label="Your enquiry list";}
 const header='<header class="site-header"><a class="brand" href="'+prefix+'index.html#top" aria-label="MicroCD Labs home"><img class="brand-logo" src="'+prefix+'assets/microcd-labs-wordmark.svg?v=boxed" width="154" height="34" alt="MicroCD Labs"></a>'+renderSiteNavigation(prefix)+'<div class="header-actions"><a class="header-cta" href="'+prefix+action+'">'+label+'</a></div></header>';
 const finalHeader=relative==="motor-controller/index.html"?header.replace('<div class="header-actions">','<div class="header-actions"><button id="theme-toggle" class="app-quiet-button" type="button">Light theme</button>'):header;
 h=h.replace(/<header class="site-header">[\s\S]*?<\/header>/,finalHeader).replace(/<footer class="site-footer[^"]*">[\s\S]*?<\/footer>/,footer(prefix));
 h=h.replace(/<script[^>]+id="ze-snippet"[\s\S]*?<\/script>/g,"");
 if(!h.includes("assets/marketing.css"))h=h.replace("</head>",'<link rel="stylesheet" href="'+prefix+'assets/marketing.css?v=20261106"></head>');
 h=h.replace(/site\.js\?v=[^"]+/g,"site.js?v=20261106-enquiry3").replace(/chat-widget\.js\?v=[^"]+/g,"chat-widget.js?v=20261106").replace(/\sdata-coupon-dialog(?:="[^"]*")?/g,"");
 h=h.split("\n").map(line=>line.trimEnd()).join("\n");fs.writeFileSync(file,h);count++;
}
console.log("Synchronized marketing headers, navigation and footers on "+count+" pages.");
