import test from "node:test";
import assert from "node:assert/strict";
import { autoConnectFeature, COMPONENTS, createProject, engineeringEstimates, featureBounds, makeFeature, migrateProject, nearestConnection, PROJECT_SCHEMA, validateProject } from "../modeler/modeler.js";

test("all domain components serialize through v2 schema", () => {
  const project=createProject("Fixture");
  project.features=Object.keys(COMPONENTS).map((type,index)=>makeFeature(type,{x:10+index*8,y:30},project.layers[0].id));
  const restored=migrateProject(JSON.parse(JSON.stringify(project)));
  assert.equal(restored.schema,PROJECT_SCHEMA);assert.equal(restored.features.length,Object.keys(COMPONENTS).length);assert.deepEqual(restored.features.map(f=>f.type),Object.keys(COMPONENTS));
});

test("v1 project migration preserves features", () => {
  const migrated=migrateProject({version:1,name:"Legacy",components:[{type:"inlet",x:4,y:5,dimensions:{diameter:2}}]});
  assert.equal(migrated.version,2);assert.equal(migrated.features[0].position.x,4);assert.equal(migrated.features[0].parameters.diameter,2);
});

test("DRC reports missing ports and invalid dimensions", () => {
  const project=createProject();const feature=makeFeature("straight-channel",{x:20,y:20},project.layers[0].id);feature.parameters.width=0;project.features=[feature];
  const ids=validateProject(project).map(issue=>issue.ruleId);assert.ok(ids.includes("FLOW_MISSING_INLET"));assert.ok(ids.includes("FLOW_MISSING_OUTLET"));assert.ok(ids.includes("DIM_INVALID"));
});

test("rectangular channel estimates match hand calculation", () => {
  const feature={type:"straight-channel",parameters:{width:1,depth:.5,length:10}};const results=engineeringEstimates(feature,{flowRateUlMin:60,densityKgM3:1000,viscosityPaS:.001});
  const byKey=Object.fromEntries(results.map(result=>[result.key,result.value]));assert.ok(Math.abs(byKey.hydraulicDiameter-.6666667)<1e-6);assert.ok(Math.abs(byKey.volume-5)<1e-9);assert.ok(Math.abs(byKey.residence-5)<1e-9);assert.ok(byKey.reynolds>1&&byKey.reynolds<2);
});

test("near component anchors are distinguished from connected anchors and can auto-correct", () => {
  const project=createProject();const layer=project.layers[0].id;
  const channel=makeFeature("straight-channel",{x:30,y:30},layer);const inlet=makeFeature("inlet",{x:47,y:30},layer);
  project.features=[channel,inlet];
  const before=nearestConnection(channel,project.features);assert.equal(before.state,"near");assert.ok(Math.abs(before.distance-2)<1e-9);
  const correction=autoConnectFeature(channel,project.features);assert.ok(correction);assert.equal(nearestConnection(channel,project.features).state,"connected");assert.equal(channel.position.x,32);
});

test("pressure-driven inlet mode derives flow, velocity, shear, and pressure", () => {
  const feature={type:"straight-channel",parameters:{width:1,depth:.5,length:10}};
  const results=engineeringEstimates(feature,{inputMode:"pressure",inletPressureKPa:2,outletPressureKPa:0,densityKgM3:1000,viscosityPaS:.001,diffusivityUm2S:100,surfaceTensionMnM:72});
  const byKey=Object.fromEntries(results.map(result=>[result.key,result.value]));
  assert.ok(byKey.flowRate>0);assert.ok(byKey.velocity>0);assert.ok(byKey.shearRate>0);assert.ok(byKey.wallShear>0);assert.ok(byKey.reynolds>0);assert.ok(byKey.peclet>0);assert.ok(byKey.capillary>0);assert.ok(Math.abs(byKey.pressure-2)<1e-9);
});

test("bounds preserve specified channel width and follow rotation without changing geometry",()=>{
 const p=createProject(),f=makeFeature("straight-channel",{x:50,y:50},p.layers[0].id);
 const before=structuredClone(f);assert.equal(featureBounds(f).height,1);assert.equal(featureBounds(f).width,30);assert.deepEqual(f,before);
 f.rotation=90;const b=featureBounds(f);assert.ok(Math.abs(b.width-1)<1e-10);assert.ok(Math.abs(b.height-30)<1e-10);
 f.rotation=45;assert.ok(Math.abs(featureBounds(f).width-31/Math.sqrt(2))<1e-10);
});
test("rotated channels and curved/junction extents trigger boundary advisories",()=>{
 const p=createProject(),f=makeFeature("straight-channel",{x:50,y:10},p.layers[0].id);f.rotation=90;p.features=[f];
 assert.ok(validateProject(p).some(i=>i.ruleId==="EDGE_CLEARANCE"));
 const curve=makeFeature("curved-channel",{x:50,y:3},p.layers[0].id);p.features=[curve];
 assert.ok(featureBounds(curve).y<0);assert.ok(validateProject(p).some(i=>i.ruleId==="EDGE_CLEARANCE"));
 const junction=makeFeature("t-junction",{x:50,y:3},p.layers[0].id);p.features=[junction];
 assert.ok(featureBounds(junction).y<0);
});
test("pairwise geometry checks respect layers and flag missing layer references",()=>{
 const p=createProject(),a=makeFeature("rectangular-chamber",{x:50,y:50},p.layers[0].id),b=makeFeature("rectangular-chamber",{x:50,y:50},"upper");
 p.layers.push({id:"upper",name:"Upper",visible:true,locked:false});p.features=[a,b];
 assert.ok(!validateProject(p).some(i=>i.ruleId==="FEATURE_OVERLAP"));
 b.layerId=a.layerId;assert.ok(validateProject(p).some(i=>i.ruleId==="FEATURE_OVERLAP"));
 b.layerId="missing";assert.ok(validateProject(p).some(i=>i.ruleId==="LAYER_MISSING"));
});
