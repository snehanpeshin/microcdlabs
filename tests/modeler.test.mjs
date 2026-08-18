import test from "node:test";
import assert from "node:assert/strict";
import { COMPONENTS, createProject, engineeringEstimates, makeFeature, migrateProject, PROJECT_SCHEMA, validateProject } from "../modeler/modeler.js";

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
