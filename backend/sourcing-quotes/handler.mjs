import { DynamoDBClient, GetItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { createWorkflow } from "./workflow.mjs";
import { createStripe } from "./stripe.mjs";

const db = new DynamoDBClient({});
const secrets = new SecretsManagerClient({});
const ses = new SESClient({});
const table = process.env.QUOTE_TABLE;
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
  async get(reference) {
    return decode((await db.send(new GetItemCommand({
      TableName: table, Key: key(reference), ConsistentRead: true,
    }))).Item);
  },
  async list(cursor) {
    const page = await db.send(new ScanCommand({
      TableName: table, Limit: 25, ExclusiveStartKey: cursor ? key(cursor) : undefined,
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

async function notifyPaid(reference) {
  await ses.send(new SendEmailCommand({
    Source: process.env.PAID_SENDER,
    Destination: { ToAddresses: [process.env.SANDBOX_RECIPIENT] },
    Message: {
      Subject: { Data: "[Sandbox] MicroCD Labs quote " + reference + " paid" },
      Body: { Text: { Data: "Stripe confirmed the sandbox payment. Open the staff quote queue to review " + reference + "." } },
    },
  }));
}

let cachedWorkflow;
let cacheExpiresAt = 0;
async function loadWorkflow() {
  if (!cachedWorkflow || Date.now() >= cacheExpiresAt) {
    cacheExpiresAt = Date.now() + 60_000;
    cachedWorkflow = secrets.send(new GetSecretValueCommand({ SecretId: process.env.STRIPE_SECRET_ARN }))
      .then(result => {
        const settings = JSON.parse(result.SecretString);
        return createWorkflow({
          store, stripe: createStripe(settings.apiKey), webhookSecret: settings.webhookSecret,
          recipient: process.env.SANDBOX_RECIPIENT, notifyPaid,
          report: message => console.error(message),
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
    const workflow = await loadWorkflow();
    return event.routeKey === "POST /sourcing-quotes/stripe-webhook"
      ? workflow.webhook(event) : workflow.admin(event);
  } catch {
    console.error("sourcing_quote_configuration_unavailable");
    return {
      statusCode: 503, headers: { "content-type": "application/json", "cache-control": "no-store" },
      body: JSON.stringify({ error: "Sandbox quote automation is unavailable." }),
    };
  }
}
