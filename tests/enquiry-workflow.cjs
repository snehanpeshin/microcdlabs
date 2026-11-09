// Focused regressions: no real email, upload, device or payment actions.
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||"playwright");
const BASE=process.env.TEST_BASE_URL||"http://127.0.0.1:8772",OUT=process.env.TEST_ARTIFACT_DIR||path.resolve(__dirname,"../test-artifacts");
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});const b=await chromium.launch({channel:"chrome",headless:true}),c=await b.newContext({reducedMotion:"reduce",serviceWorkers:"block"}),p=await c.newPage(),errors=[],report={layouts:[],checks:[]};
 await c.route("**/*",r=>r.request().url().startsWith(BASE)?r.continue():r.abort());p.on("pageerror",e=>errors.push(e.message));
 for(const width of [360,390,768,1024,1440])for(const route of ["/","/services.html","/products.html","/catalog/pdms-microfluidic-chips.html","/consultation.html?project=sourcing"]){
  await p.setViewportSize({width,height:900});await p.goto(BASE+route,{waitUntil:"load"});await p.evaluate(()=>Promise.all([...document.images].filter(i=>i.loading!=="lazy").map(i=>i.decode().catch(()=>{}))));
  const layout=await p.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).length}));assert.equal(layout.width,width);assert.equal(layout.overflow,false,route);assert.equal(layout.broken,0,route);report.layouts.push({route,...layout});
  if([390,1440].includes(width)&&route.includes("consultation"))await p.screenshot({path:path.join(OUT,"contact-after-"+width+".png"),fullPage:false});
 }
 const longText="Requested geometry ".repeat(53).slice(0,1000);
 await p.goto(BASE+"/catalog/pdms-microfluidic-chips.html#requirements");await p.locator(".enquiry-technical summary").click();
 await p.locator('[data-enquiry-field="application"]').fill("Configuration A — fictional mixing study");await p.locator('[data-enquiry-field="geometry"]').fill(longText);await p.locator("[data-enquiry-quantity]").fill("4");await p.locator("[data-add-enquiry]").click();
 await p.locator('[data-enquiry-field="application"]').fill("Configuration B — alternate layout");await p.locator('[data-enquiry-field="geometry"]').fill("Alternate geometry");await p.locator("[data-enquiry-quantity]").fill("8");await p.locator("[data-add-enquiry]").click();
 await p.goto(BASE+"/products.html#quote");assert.equal(await p.locator(".enquiry-item").count(),2);
 let saved=await p.evaluate(()=>JSON.parse(sessionStorage.getItem("microcd-quote-v1")));assert.equal(saved.version,3);assert.notEqual(saved.items[0].key,saved.items[1].key);
 await p.reload();assert.equal(await p.locator(".enquiry-item").count(),2);assert.ok((await p.locator("#quotePreview").inputValue()).includes(longText));
 await p.locator('[data-remove]').first().click();await p.reload();assert.equal(await p.locator(".enquiry-item").count(),1);assert.ok((await p.locator("#quotePreview").inputValue()).includes("Configuration B"));
 report.checks.push("Separate same-offering configurations, full 1000-character requirements, reopen and independent removal preserved");
 await p.evaluate(()=>{const d=JSON.parse(sessionStorage.getItem("microcd-quote-v1"));d.version=2;delete d.items[0].key;sessionStorage.setItem("microcd-quote-v1",JSON.stringify(d));});await p.reload();assert.equal(await p.locator(".enquiry-item").count(),1);
 saved=await p.evaluate(()=>JSON.parse(sessionStorage.getItem("microcd-quote-v1")));assert.equal(saved.version,3);assert.ok(saved.items[0].key);report.checks.push("Prior version-2 enquiry list migrates without losing requirements");
 const blocked=await b.newContext({serviceWorkers:"block"});await blocked.route("**/*",r=>r.request().url().startsWith(BASE)?r.continue():r.abort());
 await blocked.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException("Blocked","SecurityError")};});const bp=await blocked.newPage();
 await bp.goto(BASE+"/catalog/pdms-microfluidic-chips.html");await bp.locator('[data-enquiry-field="application"]').fill("Unsaved fictional enquiry");await bp.locator("[data-add-enquiry]").click();
 assert.equal(await bp.locator("#detailEnquiryFallback").isVisible(),true);assert.ok((await bp.locator("#detailQuoteStatus").innerText()).includes("could not save"));assert.ok((await bp.locator("#detailEnquiryDraft").inputValue()).includes("Unsaved fictional enquiry"));
 await bp.goto(BASE+"/products.html");assert.equal(await bp.locator("#enquiryStorageStatus").isVisible(),true);await blocked.close();report.checks.push("Blocked storage exposes a copyable draft and clear page-only persistence warning");
 await p.goto(BASE+"/consultation.html?project=clair-veterinary");await p.locator("#projectName").fill("Fictional Reviewer");await p.locator("#projectEmail").fill("review@example.org");await p.locator("#projectDescription").fill("Discuss collection workflow");
 await p.evaluate(()=>Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:async()=>{throw Error("blocked")}}}));
 await p.locator("#copyProjectInquiry").click();assert.ok((await p.locator("#projectInquiryStatus").innerText()).includes("Copying was blocked"));assert.equal(await p.locator("#inquiryPreview").isVisible(),true);
 assert.equal(await p.evaluate(()=>document.activeElement.id),"inquiryPreview");assert.ok((await p.locator("#inquiryPreview").inputValue()).includes("Discuss collection workflow"));report.checks.push("Clipboard failure opens and selects the complete contact draft for manual copying");
 await p.setViewportSize({width:390,height:844});await p.goto(BASE+"/consultation.html?project=sourcing");await p.locator(".nav-toggle").click();await p.keyboard.press("Escape");assert.equal(await p.locator(".nav-toggle").getAttribute("aria-expanded"),"false");assert.equal(await p.locator(".nav-toggle").evaluate(e=>e===document.activeElement),true);report.checks.push("Mobile navigation Escape returns keyboard focus");
 assert.deepEqual(errors,[]);report.errors=errors;fs.writeFileSync(path.join(OUT,"focused-improvements.json"),JSON.stringify(report,null,2));console.log(JSON.stringify({layouts:report.layouts.length,checks:report.checks,errors},null,2));await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
