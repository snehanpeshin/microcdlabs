/* Shared enquiry facts, field definitions and serialization. Unknown never means confirmed. */
(() => {
 const clean=(v,max=4000)=>String(v??'').trim().slice(0,max);
 const clampQuantity=v=>Math.min(9999,Math.max(1,Math.floor(Number(v)||1)));
 const quantity=v=>/^(to be determined|not sure|tbd)$/i.test(clean(v))?'To be determined':/^\d+$/.test(clean(v))&&Number(v)>0&&Number(v)<=9999?String(Number(v)):'';
 function classify(p){
  const type=p.offeringType||(p.category==='services'?'Engineering service':p.category==='starter-kits'?'Curated kit':/custom.*fabrication|prototyping-services/.test(p.id)?'Custom fabrication enquiry':'Component sourcing enquiry');
  return {offeringType:type,commercialRole:p.commercialRole||(type==='Engineering service'?'Engineering provider':'Unconfirmed'),specificationCompleteness:p.specificationCompleteness||'Specification review required',supplyConfirmation:p.supplyConfirmation||'Source, availability, and lead time to be confirmed',pricing:p.pricing||{status:'Pricing after specification review',basis:null},configuration:p.configuration||'Configuration to be defined'};
 }
 const field=(key,label,options)=>({key,label,options});
 function schema(p){
  if(p.offeringType==='Engineering service'||p.category==='services')return [field('deliverables','Deliverables sought'),field('inputs','Existing inputs / design files'),field('criteria','Review criteria / handoff needs')];
  if(p.category==='starter-kits')return [field('components','Included components to confirm'),field('budget','Budget, if useful'),field('interfaces','Existing equipment / compatibility requirements')];
  if(p.category==='microfluidics')return [field('design','Design starting point',['Not sure—please advise','Existing design','Custom layout','Design support needed']),field('fluid','Sample / fluid description'),field('geometry','Channel width / depth and overall dimensions, if known'),field('assembly','Assembly required',['Not sure—please advise','Bonded assembly','Unbonded PDMS / separate parts']),field('substrate','Substrate / bonding requirements'),field('ports','Ports / tubing requirements'),field('operating','Flow rate / pressure, if known'),field('treatment','Coatings / treatment / sterility needs, if any')];
  if(p.subclass==='Tubing')return [field('material','Material requested'),field('dimensions','Inner / outer diameter'),field('length','Length'),field('fluid','Fluid / solvent description'),field('operating','Pressure / temperature / pump compatibility')];
  if(p.subclass==='Connectors and manifolds'||p.category==='fluid-handling')return [field('interfaces','Port / thread / tube interface sizes'),field('material','Wetted material requirements'),field('operating','Fluid / pressure / compatibility requirements')];
  if(p.category==='flow-control')return [field('range','Required flow / pressure / measurement range'),field('interfaces','Hardware / software interfaces'),field('fluid','Fluid and wetted-path requirements')];
  return [field('specifications','Material / dimensions / performance requirements'),field('interfaces','Interfaces / compatible equipment'),field('inclusions','Requested components / assembly scope')];
 }
 function requirements(p,value={}){const out={};for(const f of schema(p))out[f.key]=clean(value[f.key],500);for(const key of ['application','destination','date','documentation','configuration'])out[key]=clean(value[key],1000);return out;}
 function serialize(entries){return entries.map(e=>({id:e.product.id,optionIndex:e.optionIndex||0,quantity:quantity(e.quantity)||'To be determined',notes:clean(e.notes),requirements:requirements(e.product,e.requirements)}));}
 function lines(entries){return entries.map(e=>{const p=e.product,s=classify(p),r=requirements(p,e.requirements);return [
  'Requested offering: '+p.name,'Internal enquiry reference: '+p.sku,'Enquiry type: '+s.offeringType,'Commercial role: '+s.commercialRole,
  'Requested configuration: '+(r.configuration||'Configuration to be defined'),'Quantity: '+(quantity(e.quantity)||'To be determined'),
  'Application / design description: '+(r.application||'To be confirmed'),...schema(p).map(f=>f.label+': '+(r[f.key]||'To be confirmed')),
  'Destination country / postcode: '+(r.destination||'To be confirmed'),'Desired receipt / completion date: '+(r.date||'To be confirmed'),'Documentation / institutional purchasing needs: '+(r.documentation||'To be confirmed'),
  ...(e.notes?['Additional notes: '+clean(e.notes)]:[]),s.pricing.status,'Supply source: To be confirmed in the proposal','Availability and lead time: Confirmed after specification and supplier review'
 ].join('\n');}).join('\n\n');}
 function subject(entries){if(entries.length===1){const p=entries[0].product;return (p.id==='pdms-microfluidic-chips'?'PDMS chip sourcing enquiry':p.name+' enquiry')+' — '+p.sku;}return 'Research components & custom sourcing enquiry';}
 function request(entries,contact={}){return ['MicroCD Labs enquiry — requirements for review','',lines(entries),'','Name: '+clean(contact.name,120),'Organization: '+clean(contact.organisation,180),'Work email: '+clean(contact.email,254),'Additional enquiry notes: '+(clean(contact.notes)||'None provided'),'','This is an enquiry, not an order or confirmed quotation. Pricing, source, availability, lead time and fabrication responsibility remain to be confirmed in a written proposal. Any paid feasibility, sourcing or engineering scope requires separate agreement.'].join('\n');}
 globalThis.MicroCDQuote=Object.freeze({version:2,approvedPrices:Object.freeze({}),classify,schema,requirements,quantity,clampQuantity,cleanNotes:clean,serialize,lines,subject,request,fields:p=>schema(p).map(f=>f.label)});
})();
