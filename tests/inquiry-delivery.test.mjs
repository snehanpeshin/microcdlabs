import test from 'node:test';
import assert from 'node:assert/strict';
import '../assets/inquiry-delivery.js';
import {createHandler} from '../backend/inquiries/handler.mjs';
const {deliver,track,endpointURL} = globalThis.MicroCDInquiryDelivery;
const env = {ALLOWED_ORIGINS:'https://www.microcdlabs.com', SENDER_EMAIL:'info@microcdlabs.com', RECIPIENT_EMAIL:'info@microcdlabs.com'};
const payload = {projectType:'Engineering',name:'Test',email:'test@example.com',description:'Test inquiry'};
const event = data => ({headers:{origin:env.ALLOWED_ORIGINS,'content-type':'application/json'},requestContext:{http:{method:'POST'}},body:JSON.stringify(data)});
test('endpoint must use HTTPS without embedded credentials',()=>{
  for(const url of ['', 'javascript:alert(1)', 'http://example.com', 'https://user:pass@example.com']) assert.equal(endpointURL(url),'');
});
test('successful delivery requires an explicit receipt',async()=>{
  for(const body of [{}, {accepted:false}, {accepted:true}]) await assert.rejects(deliver('https://example.com',payload,async()=>({ok:true,json:async()=>body})));
  assert.equal((await deliver('https://example.com',payload,async()=>({ok:true,json:async()=>({accepted:true,receipt:'id'})}))).receipt,'id');
  await assert.rejects(deliver('https://example.com',payload,async()=>({ok:false,json:async()=>({accepted:true,receipt:'id'})})));
});
test('conversion event contains no contact details and needs a configured label',()=>{
  const calls=[]; track({},'id',(...args)=>calls.push(args)); assert.equal(calls.length,0);
  track({googleAdsSendTo:'AW-123/test'},'id',(...args)=>calls.push(args));
  assert.deepEqual(calls,[['event','conversion',{send_to:'AW-123/test',transaction_id:'id'}]]);
});
test('backend rejects invalid input, honeypot, wrong origin and oversize input without sending',async()=>{
  let sent=0; const handle=createHandler({env,sendEmail:async()=>{sent++;return {MessageId:'id'};}});
  for(const data of [null, [], {...payload,email:'bad'}, {...payload,description:''}, {...payload,website:'spam'}, {...payload,name:'x'.repeat(121)}, {...payload,projectType:'x\r\nInjected'}]) assert.equal((await handle(event(data))).statusCode,400);
  assert.equal((await handle({...event(payload),headers:{origin:'https://attacker.example'}})).statusCode,403);
  assert.equal((await handle({...event(payload),body:'x'.repeat(24001)})).statusCode,413);
  assert.equal(sent,0);
});
test('backend sends only to configured inbox and succeeds only after SES accepts',async()=>{
  let input; const handle=createHandler({env,sendEmail:async value=>{input=value;return {MessageId:'ses-id'};}});
  assert.deepEqual(JSON.parse((await handle(event({...payload,recipient:'attacker@example.com'}))).body),{accepted:true,receipt:'ses-id'});
  assert.deepEqual(input.Destination.ToAddresses,[env.RECIPIENT_EMAIL]);
  assert.deepEqual(input.ReplyToAddresses,[payload.email]);
  for(const sendEmail of [async()=>{throw Error('SES failure');},async()=>({})]) {
    const result=await createHandler({env,sendEmail})(event(payload));
    assert.equal(result.statusCode,503);assert.equal(JSON.parse(result.body).accepted,false);
  }
});
