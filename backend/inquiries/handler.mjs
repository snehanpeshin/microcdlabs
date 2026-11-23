const LIMITS = {projectType: 160, name: 120, email: 254, description: 4000, organization: 180, developmentStage: 180, context: 2000, nextStep: 180};
const QUOTE_SUBJECT = /^Component sourcing quote request — (MCD-[A-F0-9]{16})$/;
const REQUIRED = ['projectType', 'name', 'email', 'description'];
const CONSULTATION_SOURCES = new Set(['home', 'services', 'components', 'clair', 'tools', 'labops', 'other', 'direct', 'external']);

export function createHandler({sendEmail, storeQuote, recordAcceptance = () => {}, env = process.env}) {
  return async event => {
    const headers = Object.fromEntries(Object.entries(event.headers || {}).map(([k,v]) => [k.toLowerCase(),v]));
    const origin = headers.origin;
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);
    const reply = (statusCode, data) => ({statusCode, headers: {
      'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Vary': 'Origin',
      ...(allowed.includes(origin) ? {'Access-Control-Allow-Origin': origin} : {})
    }, body: JSON.stringify(data)});
    if (!allowed.includes(origin)) return reply(403, {accepted:false});
    if (event.requestContext?.http?.method !== 'POST') return reply(405, {accepted:false});
    if (!env.SENDER_EMAIL || !env.RECIPIENT_EMAIL) return reply(503, {accepted:false});
    if (!(headers['content-type'] || '').toLowerCase().startsWith('application/json')) return reply(415, {accepted:false});
    if (!event.body || event.body.length > 24000) return reply(413, {accepted:false});
    let data;
    try { data = JSON.parse(event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body); }
    catch { return reply(400, {accepted:false}); }
    if (!data || Array.isArray(data) || typeof data !== 'object') return reply(400, {accepted:false});
    // Honeypot requests must not return a successful lead or trigger analytics.
    if (data.website) return reply(400, {accepted:false});
    const clean = {};
    for (const [key, limit] of Object.entries(LIMITS)) {
      if (data[key] !== undefined && typeof data[key] !== 'string') return reply(400, {accepted:false});
      clean[key] = (data[key] || '').trim();
      if (clean[key].length > limit || (REQUIRED.includes(key) && !clean[key])) return reply(400, {accepted:false});
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email) || /[\r\n]/.test(clean.projectType)) return reply(400, {accepted:false});
    const quoteReference = QUOTE_SUBJECT.exec(clean.projectType)?.[1];
    // An isolated sandbox queue only retains requests from its configured test recipient.
    if (storeQuote && quoteReference && clean.email.toLowerCase() === env.QUOTE_SANDBOX_RECIPIENT?.toLowerCase()) {
      try {
        const created = await storeQuote(quoteReference, clean);
        if (!created) return reply(409, {accepted:false});
        try { recordAcceptance(null); } catch { /* queue delivery remains accepted */ }
        return reply(200, {accepted:true, receipt:quoteReference});
      } catch {
        return reply(503, {accepted:false});
      }
    }
    try {
      const result = await sendEmail({
        Source: env.SENDER_EMAIL, Destination: {ToAddresses:[env.RECIPIENT_EMAIL]},
        ReplyToAddresses:[clean.email],
        Message: {
          Subject:{Charset:'UTF-8', Data:'MicroCD Labs inquiry: ' + clean.projectType},
          Body:{Text:{Charset:'UTF-8', Data:Object.entries(clean).map(([k,v]) => k + ':\n' + v).join('\n\n')}}
        }
      });
      if (!result?.MessageId) throw new Error('No mail acceptance receipt');
      // Analytics failure must not change an already accepted delivery.
      try {
        recordAcceptance(CONSULTATION_SOURCES.has(data.consultationSource) ? data.consultationSource : null);
      } catch { /* delivery already accepted */ }
      return reply(200, {accepted:true, receipt:result.MessageId});
    } catch {
      // Do not log request bodies, email addresses, or provider error details.
      return reply(503, {accepted:false});
    }
  };
}
let ses;
let dynamo;
async function persistQuote(reference, request) {
  const {DynamoDBClient, PutItemCommand} = await import('@aws-sdk/client-dynamodb');
  dynamo ||= new DynamoDBClient({});
  const values = {
    reference, status:'pending', name:request.name, email:request.email, organization:request.organization,
    description:request.description, context:request.context
  };
  const item = Object.fromEntries(Object.entries(values).map(([key,value]) => [key,{S:value}]));
  item.createdAt = {N:String(Date.now())};
  try {
    await dynamo.send(new PutItemCommand({
      TableName:process.env.QUOTE_TABLE, Item:item, ConditionExpression:'attribute_not_exists(#ref)',
      ExpressionAttributeNames:{'#ref':'reference'}
    }));
    return true;
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') return false;
    throw error;
  }
}

function recordAcceptance(source) {
  const namespace = 'MicroCDLabs/Website';
  const metrics = [{Namespace: namespace, Dimensions: [[]], Metrics: [{Name: 'AcceptedEnquiries', Unit: 'Count'}]}];
  const values = {AcceptedEnquiries: 1};
  if (source) {
    metrics.push({Namespace: namespace, Dimensions: [['Source']], Metrics: [{Name: 'ConsultationAccepted', Unit: 'Count'}]});
    values.ConsultationAccepted = 1;
    values.Source = source;
  }
  process.stdout.write(JSON.stringify({
    _aws: {Timestamp: Date.now(), CloudWatchMetrics: metrics},
    ...values
  }) + "\n");
}

export const handler = createHandler({
  recordAcceptance,
  storeQuote: process.env.QUOTE_TABLE ? persistQuote : undefined,
  sendEmail: async input => {
    const {SESClient, SendEmailCommand} = await import('@aws-sdk/client-ses');
    ses ||= new SESClient({});
    return ses.send(new SendEmailCommand(input));
  }
});
