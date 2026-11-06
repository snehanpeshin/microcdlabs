
import test from "node:test";import assert from "node:assert/strict";import fs from "node:fs";
import {createDemoRows,parseTimeSeriesCSV,applyPipeline,calculateMetrics} from "../analyzer/analyzer.js";
import {createExampleProject,migrateProject,validateProject} from "../modeler/modeler.js";
import {TOOL_DEFINITIONS,SCIENTIFIC_RELEASE} from "../assets/tool-definitions.js";
await import("../assets/quote-state.js");const Q=globalThis.MicroCDQuote;
test("built-in demo and downloadable CSV are the same fixture; default methods reproduce reviewed values",()=>{
 const raw=createDemoRows(),file=parseTimeSeriesCSV(fs.readFileSync(new URL("../analyzer/demo-series.csv",import.meta.url),"utf8"));
 assert.deepEqual(file,raw);const snapshot=structuredClone(raw);
 const m=calculateMetrics(applyPipeline(raw,{backgroundSubtract:true,controlNormalize:false,baselineCorrect:false,smoothing:"none",window:3}),{slopeWindow:3,aucMethod:"trapezoidal",threshold:120});
 assert.equal(m.endpoint,199);assert.equal(m.initialSlope,11.5);assert.equal(m.auc,1272.5);assert.deepEqual(raw,snapshot);
});
test("optional Modeler example round-trips with stable geometry, units and layer references",()=>{
 const p=createExampleProject(),copy=migrateProject(JSON.parse(JSON.stringify(p)));
 assert.equal(p.features.length,3);assert.deepEqual(copy.features,p.features);assert.equal(copy.units,"mm");assert.ok(copy.features.every(f=>copy.layers.some(l=>l.id===f.layerId)));assert.ok(!validateProject(p).some(i=>i.ruleId==="MISSING_INLET"||i.ruleId==="MISSING_OUTLET"));
});
test("shared capability definition and maintained directory agree; legacy capabilities are explicitly separate",()=>{
 const dir=fs.readFileSync(new URL("../tools.html",import.meta.url),"utf8");
 for(const t of Object.values(TOOL_DEFINITIONS))assert.ok(dir.includes(t.name));
 assert.ok(dir.includes(SCIENTIFIC_RELEASE));assert.ok(dir.includes("STEP/DXF remain disabled"));assert.ok(dir.includes("No backend PDF"));
 const model=fs.readFileSync(new URL("../modeler/index.html",import.meta.url),"utf8");for(const key of ["json","svg","png","csv"])assert.ok(model.includes('data-export="'+key+'"'));
 assert.ok(model.includes('data-src="/modeler/core.html"'));assert.ok(!model.includes('src="/modeler/core.html" loading='));
});
test("sitemap includes maintained tool/catalog routes without promoting legacy redirect entries",()=>{
 const sitemap=fs.readFileSync(new URL("../sitemap.xml",import.meta.url),"utf8");
 for(const route of ["tools.html","products.html","catalog/pdms-microfluidic-chips.html","modeler/","analyzer/"])assert.ok(sitemap.includes("https://www.microcdlabs.com/"+route));
 assert.ok(!sitemap.includes("/modeler/app/"));
});

test("motor console retains required app control and fail-closed disconnected commands",()=>{
 const h=fs.readFileSync(new URL("../motor-controller/index.html",import.meta.url),"utf8");
 assert.ok(h.includes('id="theme-toggle"'));
 for(const id of ["send-rpm","send-max","send-limit","emergency-stop"]){const button=h.match(new RegExp('<button[^>]*id="'+id+'"[^>]*>'))?.[0];assert.ok(button?.includes("disabled"),id);}
});

test("legacy directory anchor is unique and maintained static category prices are quote-reviewed",()=>{
 const h=fs.readFileSync(new URL("../tools.html",import.meta.url),"utf8");assert.equal((h.match(/id="enhancer"/g)||[]).length,1);
 for(const dir of ["microfluidic-chips","microfluidic-tubing","microfluidic-fittings-connectors","microfluidic-pumps-flow-control","lateral-flow-assay-materials"]){
 const text=fs.readFileSync(new URL("../"+dir+"/index.html",import.meta.url),"utf8");
 for(const m of text.matchAll(/<dt>Price status<\/dt><dd>([^<]*)/g))assert.equal(m[1],"Pricing after specification review");
 }
});

test("Analyzer can reimport its raw-column export without selecting processed values",()=>{
 const raw=createDemoRows();
 const csv="time,signal_raw,background_raw,control_raw,sample_id,replicate_id,signal_processed\n"+raw.map(r=>[r.time,r.signal,r.background,r.control,r.sampleId,r.replicateId,9999].join(",")).join("\n");
 assert.deepEqual(parseTimeSeriesCSV(csv),raw);
});
