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

test('consultation interaction sends only the fixed event and referring category', async () => {
  const {consultationSource, recordInteraction} = globalThis.MicroCDInquiryDelivery;
  assert.equal(consultationSource('', env.ALLOWED_ORIGINS), 'direct');
  assert.equal(consultationSource(env.ALLOWED_ORIGINS + '/index.html?discard=this#fragment', env.ALLOWED_ORIGINS), 'home');
  assert.equal(consultationSource(env.ALLOWED_ORIGINS + '/clair/human.html?personal=discard', env.ALLOWED_ORIGINS), 'clair');
  assert.equal(consultationSource('https://elsewhere.example/page?q=discard', env.ALLOWED_ORIGINS), 'external');
  let request;
  await recordInteraction({interactionEndpoint:'https://example.com/events'}, 'start', 'home', async (url, options) => {request = {url, ...options};});
  assert.deepEqual(JSON.parse(request.body), {event:'start', source:'home'});
  assert.equal(request.credentials, 'omit');
  assert.equal(request.referrerPolicy, 'no-referrer');
  assert.equal(request.keepalive, true);
  await recordInteraction({interactionEndpoint:'https://example.com/events'}, 'submit', 'home', () => {throw Error('blocked');});
});

test('only SES-accepted requests reach enquiry analytics and unknown sources are discarded', async () => {
  const recorded = [];
  let mail;
  const handle = createHandler({
    env,
    sendEmail: async input => {mail = input; return {MessageId:'ses-id'};},
    recordAcceptance: source => recorded.push(source)
  });
  await handle(event({...payload, consultationSource:'service@example.org'}));
  await handle(event({...payload, consultationSource:'services'}));
  await handle(event({...payload, consultationSource:'home', website:'spam'}));
  const failingMail = createHandler({env, sendEmail:async () => ({}), recordAcceptance:source => recorded.push(source)});
  assert.equal((await failingMail(event({...payload, consultationSource:'home'}))).statusCode, 503);
  assert.deepEqual(recorded, [null, 'services']);
  assert.doesNotMatch(mail.Message.Body.Text.Data, /consultationSource/);

  const failingAnalytics = createHandler({
    env, sendEmail:async () => ({MessageId:'ses-id'}), recordAcceptance:() => {throw Error('tracking unavailable');}
  });
  assert.equal((await failingAnalytics(event({...payload, consultationSource:'home'}))).statusCode, 200);
});

test('HTTP throttling remains identifiable even when the response has no JSON body', async () => {
  await assert.rejects(
    deliver('https://example.com', payload, async () => ({ok:false, status:429})),
    {status:429}
  );
});
