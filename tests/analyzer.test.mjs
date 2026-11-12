import test from "node:test";
import assert from "node:assert/strict";
import { applyPipeline, calculateMetrics, linearRegression, parseTimeSeriesCSV, qualityFlags, replicateStatistics } from "../analyzer/analyzer.js";

const csv=`time,signal,background,control,sample,replicate\n0,10,2,100,A,1\n1,14,2,100,A,1\n2,18,2,100,A,1\n3,22,2,100,A,1`;

test("CSV parser validates and preserves raw values",()=>{const rows=parseTimeSeriesCSV(csv);assert.equal(rows.length,4);assert.equal(rows[0].signal,10);assert.equal(rows[0].background,2);});
test("background pipeline is deterministic and keeps raw signal",()=>{const rows=parseTimeSeriesCSV(csv);const processed=applyPipeline(rows,{backgroundSubtract:true,controlNormalize:false,baselineCorrect:false,smoothing:"none",window:3});assert.deepEqual(processed.map(r=>r.processed),[8,12,16,20]);assert.deepEqual(processed.map(r=>r.signal),[10,14,18,22]);});
test("golden kinetic fixture matches hand calculations",()=>{const processed=applyPipeline(parseTimeSeriesCSV(csv),{backgroundSubtract:true,controlNormalize:false,baselineCorrect:false,smoothing:"none",window:3});const m=calculateMetrics(processed,{slopeWindow:3,aucMethod:"trapezoidal",threshold:14});assert.equal(m.endpoint,20);assert.ok(Math.abs(m.initialSlope-4)<1e-12);assert.equal(m.maximumSlope,4);assert.equal(m.auc,42);assert.equal(m.timeToThreshold,1.5);});
test("linear regression and replicate statistics",()=>{const fit=linearRegression([[0,1],[1,3],[2,5]]);assert.equal(fit.slope,2);assert.equal(fit.intercept,1);assert.equal(fit.r2,1);const stats=replicateStatistics([10,12,14]);assert.equal(stats.mean,12);assert.equal(stats.sd,2);assert.ok(Math.abs(stats.cv-16.6666667)<1e-6);});
test("missing configured control is a QC error",()=>{const raw=parseTimeSeriesCSV("time,signal\n0,1\n1,2\n2,3");const processed=applyPipeline(raw,{backgroundSubtract:false,controlNormalize:true,baselineCorrect:false,smoothing:"none",window:3});const metrics=calculateMetrics(processed,{slopeWindow:3,aucMethod:"trapezoidal"});assert.ok(qualityFlags(raw,processed,metrics,{controlNormalize:true}).some(flag=>flag.id==="MISSING_CONTROL"&&flag.severity==="error"));});
test("malformed and nonmonotonic inputs fail",()=>{assert.throws(()=>parseTimeSeriesCSV("x,y\n1,2"),/requires time and signal/);assert.throws(()=>parseTimeSeriesCSV("time,signal\n1,2\n1,3"),/must increase/);});

test("mixed sample and replicate series are rejected before preprocessing or metrics",()=>{
 const cases=[
  "time,signal,sample,replicate\n0,0,A,1\n1,10,A,1\n0,0,A,2\n1,100,A,2",
  "time,signal,sample,replicate\n0,0,A,1\n1,10,A,1\n3,0,B,1\n4,100,B,1"
 ];
 for(const text of cases)assert.throws(()=>parseTimeSeriesCSV(text),/Multiple sample\/replicate series/);
 const rows=[{time:0,signal:0,processed:0,sampleId:"A",replicateId:"1"},{time:1,signal:10,processed:10,sampleId:"A",replicateId:"2"}],copy=structuredClone(rows);
 assert.throws(()=>applyPipeline(rows,{baselineCorrect:true,smoothing:"moving-average",window:3}),/Multiple sample\/replicate series/);
 assert.throws(()=>calculateMetrics(rows),/Multiple sample\/replicate series/);assert.deepEqual(rows,copy);
});
test("separate single-series analyses retain the expected numerical results",()=>{
 for(const [replicateId,values,slope,auc] of [["1",[0,10,20],10,20],["2",[0,100,200],100,200]]){
  const rows=values.map((signal,time)=>({time,signal,sampleId:"A",replicateId}));
  const m=calculateMetrics(applyPipeline(rows,{backgroundSubtract:false,controlNormalize:false,baselineCorrect:false,smoothing:"none"}),{slopeWindow:3,aucMethod:"trapezoidal"});
  assert.equal(m.endpoint,values[2]);assert.equal(m.initialSlope,slope);assert.equal(m.maximumSlope,slope);assert.equal(m.auc,auc);
 }
});
test("direct metric callers cannot create a zero-time interval slope",()=>{
 assert.throws(()=>calculateMetrics([{time:0,processed:0},{time:0,processed:10},{time:1,processed:20}]),/duplicate time points/);
});
