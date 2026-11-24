import { DynamoDBClient, GetItemCommand, ScanCommand, UpdateItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { createWorkflow } from "./workflow.mjs";
import { createStripe, parseStripeCredentials } from "./stripe.mjs";
import { sandboxInvoiceMessage } from "./invoice-email.mjs";

const db = new DynamoDBClient({});
const secrets = new SecretsManagerClient({});
const ses = new SESClient({});
const invoiceSes = new SESClient({ maxAttempts: 1 });
const table = process.env.QUOTE_TABLE;
const live = process.env.LIVE_QUOTES === "true";
const liveEnabled = process.env.LIVE_INVOICE_ENABLED === "true";
const allLiveQuotes = live && process.env.LIVE_ALL_QUOTES === "true";
const livePilot = live ? {
  reference: process.env.LIVE_PILOT_REFERENCE,
  name: process.env.LIVE_PILOT_NAME,
  maxCents: Number(process.env.LIVE_PILOT_MAX_CENTS),
} : undefined;
const key = reference => ({ reference: { S: reference } });

function decode(item) {
  return item && Object.fromEntries(Object.entries(item).map(([name, value]) =>
    [name, value.S ?? Number(value.N)]));
}

async function update(reference, expression, condition, names, values) {
  try {
    const result = await db.send(new UpdateItemCommand({
      TableName: table, Key: key(reference), UpdateExpression: "SET " + expression,
      ConditionExpression: condition, ExpressionAttributeNames: names, ExpressionAttributeValues: values,
      ReturnValues: "ALL_NEW",
    }));
    return decode(result.Attributes);
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") return null;
    throw error;
  }
}

const store = {
  async ensurePilot(quote, now) {
    const Item = Object.fromEntries(Object.entries(quote).map(([field, value]) => [field, { S: value }]));
    Item.createdAt = { N: String(now) };
    try {
      await db.send(new PutItemCommand({
        TableName: table, Item, ConditionExpression: "attribute_not_exists(#ref)",
        ExpressionAttributeNames: { "#ref": "reference" },
      }));
    } catch (error) {
      if (error.name !== "ConditionalCheckFailedException") throw error;
    }
  },
  async get(reference) {
    return decode((await db.send(new GetItemCommand({
      TableName: table, Key: key(reference), ConsistentRead: true,
    }))).Item);
  },
  async list(cursor) {
    const page = await db.send(new ScanCommand({
      TableName: table, ConsistentRead: true, Limit: 25, ExclusiveStartKey: cursor ? key(cursor) : undefined,
    }));
    const quotes = (page.Items ?? []).map(decode).sort((a, b) => b.createdAt - a.createdAt);
    return { quotes, cursor: page.LastEvaluatedKey?.reference?.S ?? null };
  },
  async approve(input, time) {
    return (await update(input.reference,
      "#status = :approved, cents = :cents, invoiceDescription = :description, approvedAt = :at, approvedBy = :staff",
      "#status = :pending", { "#status": "status" }, {
        ":approved": { S: "approved" }, ":pending": { S: "pending" },
        ":cents": { N: String(input.cents) }, ":description": { S: input.invoiceDescription },
        ":at": { N: String(time) }, ":staff": { S: input.approvedBy },
      })) || this.get(input.reference);
  },
  async linkInvoice(reference, invoiceId) {
    const row = await update(reference, "invoiceId = :id",
      "attribute_exists(#status) AND (attribute_not_exists(invoiceId) OR invoiceId = :id)",
      { "#status": "status" }, { ":id": { S: invoiceId } });
    if (!row) throw new Error("Invoice reference conflict.");
  },
  async claimInvoiceEmail(reference, invoiceId, time) {
    return Boolean(await update(reference, "invoiceEmailStartedAt = :time",
      "invoiceId = :id AND #status = :approved AND attribute_not_exists(invoiceEmailStartedAt)",
      { "#status": "status" }, {
        ":id": { S: invoiceId }, ":approved": { S: "approved" }, ":time": { N: String(time) },
      }));
  },
  async markSent(reference) {
    return (await update(reference, "#status = :sent", "#status = :approved", { "#status": "status" }, {
      ":sent": { S: "sent" }, ":approved": { S: "approved" },
    })) || this.get(reference);
  },
  async markPaid(reference, invoiceId, time) {
    return Boolean(await update(reference, "#status = :paid, paidAt = :time",
      "invoiceId = :id AND #status IN (:approved, :sent)", { "#status": "status" }, {
        ":paid": { S: "paid" }, ":approved": { S: "approved" }, ":sent": { S: "sent" },
        ":id": { S: invoiceId }, ":time": { N: String(time) },
      }));
  },
};

async function emailInvoice(record, paymentLink) {
  const delivery = await invoiceSes.send(new SendEmailCommand({
    Source: process.env.PAID_SENDER,
    Destination: { ToAddresses: [process.env.SANDBOX_RECIPIENT] },
    Message: sandboxInvoiceMessage(record.reference, record.cents, paymentLink),
  }));
  if (!delivery.MessageId) throw new Error("Sandbox invoice email was not acknowledged.");
}

async function notifyPaid(reference) {
  await ses.send(new SendEmailCommand({
    Source: process.env.PAID_SENDER,
    Destination: { ToAddresses: [process.env.SANDBOX_RECIPIENT] },
    Message: {
      Subject: { Data: (live ? "[Live]" : "[Sandbox]") + " MicroCD Labs quote " + reference + " paid" },
      Body: { Text: { Data: "Stripe confirmed the " + (live ? "live" : "sandbox") + " payment. Open the staff quote queue to review " + reference + "." } },
    },
  }));
}

const workflowOptions = {
  store,
  recipient: live ? process.env.LIVE_PILOT_RECIPIENT : process.env.SANDBOX_RECIPIENT,
  live, pilot: livePilot, allLiveQuotes, enabled: !live || liveEnabled, emailInvoice, notifyPaid,
  report: message => console.error(message),
};

let cachedWorkflow;
let cacheExpiresAt = 0;
async function loadWorkflow() {
  if (!cachedWorkflow || Date.now() >= cacheExpiresAt) {
    cacheExpiresAt = Date.now() + 60_000;
    cachedWorkflow = secrets.send(new GetSecretValueCommand({ SecretId: process.env.STRIPE_SECRET_ARN }))
      .then(result => {
        const settings = parseStripeCredentials(result.SecretString, live);
        return createWorkflow({
          ...workflowOptions, stripe: createStripe(settings.apiKey, fetch, live), webhookSecret: settings.webhookSecret,
        });
      }).catch(error => {
        cachedWorkflow = undefined;
        throw error;
      });
  }
  return cachedWorkflow;
}

export async function handler(event) {
  try {
    if (live && (event.routeKey === "GET /sourcing-quotes-live" ||
        (!liveEnabled && event.routeKey === "POST /sourcing-quotes-live/invoice"))) {
      return createWorkflow(workflowOptions).admin(event);
    }
    const workflow = await loadWorkflow();
    return event.routeKey === "POST " + (live ? "/sourcing-quotes-live" : "/sourcing-quotes") + "/stripe-webhook"
      ? workflow.webhook(event) : workflow.admin(event);
  } catch {
    console.error("sourcing_quote_configuration_unavailable");
    return {
      statusCode: 503, headers: { "content-type": "application/json", "cache-control": "no-store" },
      body: JSON.stringify({ error: "Quote automation is unavailable." }),
    };
  }
}
