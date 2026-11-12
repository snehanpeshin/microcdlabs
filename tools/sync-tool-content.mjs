
import fs from "node:fs";import path from "node:path";import {fileURLToPath} from "node:url";
import {TOOL_DEFINITIONS as T,SCIENTIFIC_RELEASE} from "../assets/tool-definitions.js";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
let html=fs.readFileSync(path.join(root,"tools.html"),"utf8");
const cards=[
["modeler",T.modeler,"assets/tools/modeler-workspace.webp","Illustrative built-in flow path in the local 2D workspace; not fabrication-ready.",
 "Sketch 2D flow paths, inspect geometry and connection guidance, and save a native project.",
 '<p><strong>Browser exports:</strong> '+T.modeler.exports.join(", ")+'.</p><p><strong>Legacy:</strong> '+T.modeler.legacy+'. STEP/DXF remain disabled roadmap items; STL and OBJ are not advertised browser exports.</p><p><strong>iOS:</strong> '+T.modeler.ios+' <a href="https://apps.apple.com/us/app/microfluidic-modeler/id6788555232">See the separate App Store listing</a>.</p>'],
["analyzer",T.analyzer,"assets/tools/analyzer-workspace.webp","Built-in demo analyzed locally with default background subtraction; illustrative data.",
 "Analyze one sample/replicate series from a CSV or an ordered image sequence locally. Review preprocessing, numerical methods, quality flags, and a reproducible export package.",
 '<p><strong>Inputs:</strong> '+T.analyzer.inputs.join("; ")+'.</p><p><strong>Outputs:</strong> '+T.analyzer.exports.join("; ")+'. Browser printing can save a PDF where supported. No backend PDF is generated.</p><p>CSV and image workflows have separate onboarding. Single-series signal metrics only; grouped replicate statistics, concentration calibration and LoB/LoD/LoQ estimation are not implemented. CRP Camera has its own local-record workflow.</p>'],
["motor-controller",T.motor,"assets/tools/motor-profile.webp","Existing motor-profile software prototype; not a validated commercial controller.",
 "Engineering console for compatible ESP32 / SimpleFOC firmware over USB serial. Define timed RPM profiles, inspect telemetry, and download logs.",
 '<p><strong>Exports:</strong> '+T.motor.exports.join(", ")+'.</p><p>'+T.motor.boundary+'</p><p>Confirm hardware, enclosure, firmware protocol, and physical power-disconnect arrangements before connecting.</p>']
];
html=html.replace(/<span id="enhancer"><\/span>/g,"");
const body=cards.map(([id,t,img,caption,description,detail])=>'<article id="'+id+'" class="tool-detail"><figure><img src="'+img+'" width="960" height="'+(id==="motor-controller"?727:640)+'" loading="lazy" alt="'+caption+'"><figcaption>'+caption+'</figcaption></figure><div><div class="tool-status"><span>'+t.status+'</span><span>'+t.version+'</span></div><p class="eyebrow">'+t.browser+'</p><h2>'+t.name+'</h2><p>'+description+'</p>'+detail+'<p class="tool-boundary"><strong>Data:</strong> '+t.data+'. Research and engineering use; no clinical performance claim.</p><a class="button button-primary" href="'+t.route+'">Open '+t.name+'</a></div></article>').join("\n");
html=html.replace(/<section class="tool-detail-section[\s\S]*?<\/section>/,'<span id="enhancer"></span><section class="tool-detail-section section" aria-label="MicroCD Labs software tools">'+body+'</section>');
html=html.replace('href="#enhancer"','href="#analyzer"').replace('href="#modeler">Sketch and export','href="modeler/">Open the 2D Modeler').replace('href="#analyzer">Explore assay kinetics','href="analyzer/">Open Kinetic Assay Analyzer').replace('href="#motor-controller">Control CLAIR motor hardware','href="motor-controller/">Review motor-console requirements').replace('an in-development veterinary saliva workflow','separate human and veterinary oral-health research programs');
fs.writeFileSync(path.join(root,"tools.html"),html);
fs.writeFileSync(path.join(root,"docs/tool-capabilities.json"),JSON.stringify({release:SCIENTIFIC_RELEASE,tools:T},null,2)+"\n");
console.log("Tool directory and capability reference synchronized from assets/tool-definitions.js.");

for(const entry of ["modeler/index.html","analyzer/index.html"]){
 const release=entry.startsWith("analyzer/")?T.analyzer.version:SCIENTIFIC_RELEASE;
 const file=path.join(root,entry);let h=fs.readFileSync(file,"utf8");
 h=h.replace(/(<span class="(?:version|analyzer-version)">)[^<]*/g,"$1v"+release).replace(/v=2\.[01]\.0-beta\.\d+/g,"v="+release);
 fs.writeFileSync(file,h);
}

for(const entry of ["modeler/modeler.js","analyzer/analyzer.js","assets/scientific-ui.js"]){
 const release=entry.startsWith("analyzer/")?T.analyzer.version:SCIENTIFIC_RELEASE;
 const file=path.join(root,entry);let h=fs.readFileSync(file,"utf8");
 h=h.replace(/(scientific-ui\.js|tool-definitions\.js)\?v=[^"]+/g,"$1?v="+release);fs.writeFileSync(file,h);
}
