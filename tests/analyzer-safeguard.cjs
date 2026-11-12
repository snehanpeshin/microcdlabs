// Regression checks use synthetic CSV/images only. No uploads or external messages.
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||"playwright");
const BASE=process.env.TEST_BASE_URL||"http://127.0.0.1:8772",OUT=process.env.TEST_ARTIFACT_DIR||path.resolve(__dirname,"../test-artifacts");
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});const b=await chromium.launch({channel:"chrome",headless:true}),c=await b.newContext({reducedMotion:"reduce",serviceWorkers:"block",acceptDownloads:true}),p=await c.newPage(),errors=[];
 await c.route("**/*",r=>r.request().url().startsWith(BASE)?r.continue():r.abort());p.on("pageerror",e=>errors.push(e.message));
 const report={layouts:[],checks:[]};
 for(const width of [360,390,768,1024,1440])for(const route of ["/analyzer/","/diagnostics.html","/news.html","/tools.html"]){
  await p.setViewportSize({width,height:900});await p.goto(BASE+route,{waitUntil:"load"});
  const layout=await p.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth}));assert.equal(layout.width,width);assert.equal(layout.overflow,false,route+" "+width);report.layouts.push({route,...layout});
 }
 await p.goto(BASE+"/analyzer/");assert.ok((await p.locator("#import").innerText()).includes("one sample and one replicate"));
 const demo=async()=>{await p.locator('[data-action="demo"]').first().click();await p.locator('[data-next="map"]:visible').click();await p.locator('[data-next="analyze"]:visible').click();await p.locator('[data-action="run-analysis"]').click();await p.waitForSelector(".metric-card");const m=await p.locator("#metric-cards").innerText();for(const v of ["199 a.u.","11.5 a.u./min","1,272.5 a.u.·min"])assert.ok(m.includes(v),v);};
 await demo();await p.locator('[data-stage="report"]').click();assert.ok((await p.locator("#report-summary").innerText()).includes("Signal-time AUC"));
 const download=p.waitForEvent("download");await p.locator('[data-report="manifest"]').click();const manifest=JSON.parse(fs.readFileSync(await(await download).path(),"utf8"));assert.equal(manifest.applicationVersion,"2.1.0-beta.3");assert.equal(manifest.results.endpoint,199);assert.equal(manifest.results.initialSlope,11.5);assert.equal(manifest.results.auc,1272.5);assert.equal(manifest.demonstration,true);assert.equal(manifest.sampleMetadata.sampleId,"demo-low");assert.equal(manifest.sampleMetadata.replicateId,"rep-1");
 report.checks.push("Demo 199 / 11.5 / 1272.5 and exported manifest retained; app version beta.3");
 await p.locator('[data-stage="import"]').click();
 const invalid="time,signal,sample,replicate\n0,0,A,1\n1,10,A,1\n2,20,A,1\n0,0,A,2\n1,100,A,2\n2,200,A,2";
 await p.locator("#file-input").setInputFiles({name:"mixed-replicates.csv",mimeType:"text/csv",buffer:Buffer.from(invalid)});
 await p.waitForSelector("#import-errors [role=alert]");assert.ok((await p.locator("#import-errors").innerText()).includes("Multiple sample/replicate"));
 assert.equal(await p.locator('#import [data-next="map"]').isDisabled(),true);assert.equal(await p.locator('[data-stage="report"]').isDisabled(),true);assert.equal(await p.locator('[data-report="manifest"]').isDisabled(),true);assert.equal(await p.locator(".metric-card").count(),0);assert.equal(await p.locator("#report-summary").innerText(),"Run analysis to create a current report.");
 await p.setViewportSize({width:390,height:844});await p.screenshot({path:path.join(OUT,"analyzer-mixed-series-rejected.png")});
 report.checks.push("Mixed-replicate CSV rejected; prior metrics, report and exports unavailable");
 await demo();assert.equal(await p.locator("#import-errors").innerText(),"");report.checks.push("Demo recovers after rejected import without stale error");
 await p.goto(BASE+"/analyzer/");
 const png=Buffer.from(await p.evaluate(()=>{const c=document.createElement("canvas");c.width=64;c.height=64;const x=c.getContext("2d");x.fillStyle="rgb(20,40,60)";x.fillRect(0,0,64,64);return c.toDataURL("image/png").split(",")[1]}),"base64");
 await p.locator("#file-input").setInputFiles([{name:"frame0.png",mimeType:"image/png",buffer:png},{name:"frame1.png",mimeType:"image/png",buffer:png}]);
 await p.waitForFunction(()=>document.querySelector('#import [data-next="map"]').disabled===false);await p.locator('[data-next="map"]:visible').click();
 await p.locator('[data-roi-action="add"]').first().click();await p.locator('[data-roi-action="add"]').first().click();await p.locator('[data-next="analyze"]:visible').click();await p.locator('[data-action="run-analysis"]').click();
 await p.waitForSelector("#analysis-error:visible");assert.ok((await p.locator("#analysis-error").innerText()).includes("exactly one visible test ROI"));assert.equal(await p.locator('[data-stage="report"]').isDisabled(),true);
 await p.locator('[data-stage="map"]').click();await p.locator('[data-roi-command="delete"]').last().click();await p.locator('[data-next="analyze"]:visible').click();await p.locator('[data-action="run-analysis"]').click();await p.waitForSelector(".metric-card");assert.equal(await p.locator("#analysis-error").isHidden(),true);
 report.checks.push("Multiple visible test ROIs rejected with inline focused error; one-ROI image analysis recovers");
 await p.goto(BASE+"/diagnostics.html");const card=p.locator("#publication");assert.match(await card.innerText(),/not(?: been)? peer reviewed/i);assert.match(await card.innerText(),/experimental validation/i);assert.ok((await card.locator("figcaption").innerText()).includes("Conceptual"));
 assert.deepEqual(errors,[]);report.errors=errors;fs.writeFileSync(path.join(OUT,"analyzer-safeguard-checks.json"),JSON.stringify(report,null,2));console.log(JSON.stringify({layouts:report.layouts.length,checks:report.checks,errors},null,2));await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
