import {createHash} from "node:crypto";

import test from "node:test";import assert from "node:assert/strict";import fs from "node:fs";import vm from "node:vm";
await import("../assets/quote-state.js");const Q=globalThis.MicroCDQuote;
const document={querySelector:()=>null,querySelectorAll:()=>[],body:{dataset:{}},addEventListener(){}};
const sandbox={document,window:{location:{search:"",href:""},matchMedia:()=>({matches:false,addEventListener(){}}),addEventListener(){},setTimeout,clearTimeout},sessionStorage:{getItem:()=>null,setItem(){}},URLSearchParams,FormData:class {},console};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync(new URL("../assets/quote-state.js",import.meta.url),"utf8"),sandbox);vm.runInContext(fs.readFileSync(new URL("../script.js",import.meta.url),"utf8")+"\nglobalThis.model={products,getProductOptions,getEnquiryDetailHTML};",sandbox);
test("PDMS is a sourced enquiry with independent unknown facts, never a purchasable placeholder",()=>{
 const p=sandbox.model.products.find(p=>p.id==="pdms-microfluidic-chips"),h=sandbox.model.getEnquiryDetailHTML(p);assert.equal(p.sku,"MCD-MF-001");
 for(const text of ["Custom Sourcing &amp; Fabrication Enquiry","Specification review required","Pricing after specification review","Source, availability, and lead time to be confirmed","Enquiry reference","Representative illustration","Requirements to discuss"])assert.ok(h.includes(text),text);
 for(const bad of ["Quote confirmed","Available option","Configured option","Catalog source","manufacturer part number",'"@type":"Product"'])assert.ok(!h.includes(bad),bad);
 assert.equal(sandbox.model.getProductOptions(p).length,1);assert.ok(!h.includes("MicroCD Labs"),"Listing copy must remain vendor-neutral");assert.equal(p.commercialRole,"Unconfirmed");assert.equal(p.pricing.basis,null);
 assert.ok(!h.includes("<option >Glass"));assert.ok(h.includes('href="glass-microfluidic-chips.html"'));
});
test("shared request serialization carries requirements, quantity and unresolved facts safely",()=>{
 const p=sandbox.model.products[0],r={application:"Fictional dye mixing <&> study",design:"Existing design",geometry:"50 µm × 100 µm",fluid:"Water and dye",destination:"USA 10001",documentation:"Institutional PO",date:"2027-02-01"};
 const e={product:p,optionIndex:0,quantity:"12",requirements:r};const contact={name:"Alex Example",organisation:"Fictional Research Group",email:"alex@example.org"};
 const out=Q.request([e],contact);for(const v of [p.sku,p.name,...Object.values(r),"12","To be confirmed","Alex Example","alex@example.org"])assert.ok(out.includes(v),v);
 assert.ok(!/quote confirmed|in stock|invoice request/i.test(out));assert.equal(Q.subject([e]),"PDMS chip sourcing enquiry — MCD-MF-001");
 const saved=Q.serialize([e])[0];assert.equal(saved.requirements.geometry,r.geometry);assert.equal(saved.quantity,"12");assert.equal(saved.id,p.id);
 assert.equal(Q.quantity("To be determined"),"To be determined");for(const v of ["0","-1","1.5","10000","nonsense"])assert.equal(Q.quantity(v),"");
});
test("offering facts preserve explicit verified values and distinguish services, kits and platforms",()=>{
 const verified={offeringType:"Specified research component",commercialRole:"Reseller",specificationCompleteness:"Defined specification",supplyConfirmation:"Written confirmation 2026-11-01",pricing:{status:"Documented indicative estimate",basis:{quantity:10,date:"2026-11-01",configuration:"Test fixture only"}}};
 assert.deepEqual(Q.classify(verified),{...verified,configuration:"Configuration to be defined"});
 assert.equal(Q.classify({category:"services"}).commercialRole,"Engineering provider");
 assert.equal(Q.classify({category:"starter-kits"}).offeringType,"Curated kit");
 assert.equal(Q.classify({offeringType:"Platform in development"}).offeringType,"Platform in development");
 assert.ok(!Q.schema({category:"services"}).some(f=>f.key==="geometry"));assert.ok(Q.schema({category:"starter-kits"}).some(f=>f.key==="components"));
});
test("generated pages and all request entry routes use enquiry metadata and no invoice bypass",()=>{
 for(const p of sandbox.model.products){
 const h=fs.readFileSync(new URL("../catalog/"+p.id+".html",import.meta.url),"utf8");assert.ok(h.includes("Enquiry reference"));assert.ok(h.includes("Pricing after specification review"));assert.ok(!/"@type":\s*"(Offer|Product)"/.test(h));assert.ok(h.includes("<noscript>"));
 }
 for(const f of ["products.html","kits.html"]){const h=fs.readFileSync(new URL("../"+f,import.meta.url),"utf8");assert.ok(h.includes('id="quoteOrganisation" name="organisation" required'));assert.ok(h.includes("Open email draft"));assert.ok(!h.includes('id="stripePayLink"'));}
});

test("independent configurations keep stable identities and all permitted technical text",()=>{
 const p=sandbox.model.products[0],longText="Geometry".repeat(125);
 const entries=[{key:Q.newKey(p),product:p,quantity:"4",requirements:{application:"Design A",geometry:longText}},{key:Q.newKey(p),product:p,quantity:"8",requirements:{application:"Design B",geometry:"A different requested channel"}}];
 assert.notEqual(entries[0].key,entries[1].key);
 const saved=JSON.parse(JSON.stringify(Q.serialize(entries)));assert.equal(saved.length,2);assert.equal(saved[0].key,entries[0].key);assert.equal(saved[1].key,entries[1].key);
 assert.equal(saved[0].requirements.geometry,longText);assert.ok(Q.request(entries).includes(longText));assert.ok(sandbox.model.getEnquiryDetailHTML(p).includes('maxlength="'+Q.fieldLimit+'"'));
});

test("checkout submits the complete configured basket and delivery details to the inquiry handler", async () => {
 const {createHandler} = await import("../backend/inquiries/handler.mjs");
 const product = sandbox.model.products[0];
 const entries = [
  {product, quantity: "4", requirements: {application: "Fictional mixing A", geometry: "50 µm"}},
  {product, quantity: "8", requirements: {application: "Fictional mixing B", geometry: "100 µm"}}
 ];
 const contact = {name: "Test Buyer", organisation: "Fictional Lab", email: "buyer@example.org", country: "United States", postal: "10001", purchaseOrder: "PO-42"};
 const reference = "MCD-F0123456789ABCDE";
 const payload = Q.checkoutPayload(entries, contact, reference);
 let mail;
 const origin = "https://www.microcdlabs.com";
 const handler = createHandler({
  env: {ALLOWED_ORIGINS: origin, SENDER_EMAIL: "seller@example.org", RECIPIENT_EMAIL: "seller@example.org"},
  sendEmail: async message => { mail = message; return {MessageId: "test-receipt"}; }
 });
 const result = await handler({
  headers: {origin, "content-type": "application/json"},
  requestContext: {http: {method: "POST"}},
  body: JSON.stringify(payload)
 });
 assert.equal(result.statusCode, 200);
 assert.equal(JSON.parse(result.body).accepted, true);
 assert.equal(mail.ReplyToAddresses[0], contact.email);
 assert.ok(mail.Message.Subject.Data.includes(reference));
 for (const text of ["Quantity: 4", "Quantity: 8", "Fictional mixing A", "Fictional mixing B", "50 µm", "100 µm", "United States", "10001", "PO-42"]) {
  assert.ok(mail.Message.Body.Text.Data.includes(text), text);
 }
 assert.equal(Q.checkoutPayload(entries, {...contact, notes: "x".repeat(2100)}, reference), null);
 assert.ok(Q.request(entries, contact).includes("PO-42"));
});

test("every catalog offering uses its own localized AI illustration", () => {
 const hashes = new Set();
 for (const product of sandbox.model.products) {
  const image = product.image.url;
  assert.equal(image, `assets/catalog-items/${product.id}.webp`);
  const rendered = fs.readFileSync(new URL(`../catalog/${product.id}.html`, import.meta.url), "utf8");
  assert.ok(rendered.includes(`src="../${image}"`), product.id);
  assert.ok(rendered.includes(`https://www.microcdlabs.com/${image}`), product.id);
  assert.ok(rendered.includes("Representative illustration · AI-generated"), product.id);
  const bytes = fs.readFileSync(new URL("../" + image, import.meta.url));
  assert.equal(bytes.toString("ascii", 8, 12), "WEBP", product.id);
  hashes.add(createHash("sha256").update(bytes).digest("hex"));
 }
 assert.equal(hashes.size, sandbox.model.products.length);
});
