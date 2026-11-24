# MicroCD Labs Stripe sandbox quote workflow

The sandbox queue is an extension of the existing invite-only Cognito staff dashboard. It accepts a synthetic sourcing request through the existing enquiry API when the request email matches the configured sandbox recipient. Other enquiries follow the existing email route. The team records the buyer's approval and enters one final USD amount and description. The sandbox issues an invoice under KARIGARI HOME LLC, doing business as MicroCD Labs, and uses SES to email the private MicroCD Labs payment link only to the configured sandbox recipient.

## Configure the sandbox

1. Identify the HTTP API and Cognito JWT authorizer already used by the website staff dashboard. Use that API's ID and authorizer ID as the quote stack parameters. API Gateway protects both staff routes. The Stripe event endpoint verifies the Stripe signature independently.
2. Choose a staff test mailbox that Stripe sandbox can send to and that is verified in SES. Use synthetic buyer details when testing. Set the SES sender to an existing verified identity.
3. Create a dedicated AWS Secrets Manager secret in the deployment region with JSON fields `apiKey` and `webhookSecret`. Use a key scoped to the MicroCD Labs Stripe sandbox. The Stripe identity must be able to read its own account and create customers, invoices, and invoice items. Provide only the secret ARN in deployment parameters.
4. Build and deploy this SAM stack with `AdminApiId`, `AdminAuthorizerId`, `StripeSecretArn`, `SandboxRecipient`, and `PaidSender`. Register the output `WebhookUrl` in the **MicroCD Labs sandbox** in Stripe and subscribe to `invoice.payment_succeeded`. Put its signing secret in the same Secrets Manager record.
5. Update the enquiry stack with this stack's `QuoteTableName`, `QuoteTableArn`, and the same `SandboxRecipient`. These parameters are optional. With them empty, the intake keeps its existing email behavior.
6. Serve the updated staff dashboard on the existing Cognito callback origin. Verify with a synthetic quote at the sandbox recipient using the agreed dollar total. Record approval and send, pay with a Stripe test card, and verify the queue reads **Paid** and the test inbox receives the invoice link and paid alert. Repeat the same approval request and replay the signed event to verify duplicates are harmless.

## Recovery and boundaries

- The quote reference is the key used to deduplicate intake and create each Stripe object. The first approved amount and description are locked. Reuse those values when retrying. After 20 hours, reconcile in Stripe before attempting recovery so Stripe's idempotency window cannot cause a second invoice.
- Invoice email delivery is claimed before SES sends. If a send cannot be confirmed, check the test inbox. Automatic retries stop at that point to avoid sending a duplicate.
- The queue is authoritative for payment status. Stripe payment events must match the stored invoice ID, the exact approved USD amount, and the signed sandbox environment. The paid email is attempted once on the first successful transition. If delivery fails, check Stripe and the staff queue. The function logs a fixed failure marker without the quote or buyer details.
- This implementation accepts only the configured Stripe sandbox and test recipient. Customer emails and live payments continue through the existing approved-quote workflow until a live automation rollout is designed and verified.
