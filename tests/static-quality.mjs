import { readFileSync } from "node:fs";
const files=["modeler/index.html","analyzer/index.html","assets/scientific-ui.css","modeler/modeler.js","analyzer/analyzer.js","motor-controller/motor-controller.css","motor-controller/motor-controller.js"];
let failed=false;
for(const file of files){const text=readFileSync(new URL(`../${file}`,import.meta.url),"utf8");if(/adsbygoogle|googlesyndication|Kinetic Assay Enhancer/i.test(text)){console.error(`${file}: advertising or old product name remains`);failed=true;}if(/onclick\s*=/i.test(text)){console.error(`${file}: inline click handler found`);failed=true;}}
if(failed)process.exit(1);console.log(`Static quality checks passed for ${files.length} product files.`);
