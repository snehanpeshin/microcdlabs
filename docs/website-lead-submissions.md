# Website lead submissions — activation checklist

Status: implementation prepared; endpoint and Google Ads website conversion NOT provisioned.
The default configuration intentionally keeps the existing email-draft flow working.
Do not claim live website lead tracking until the checks below pass.

## Delivery architecture

`consultation.html` → HTTPS POST → API Gateway HTTP API → Lambda → Amazon SES →
`info@microcdlabs.com`. The recipient and sender are server-side settings; visitors cannot
choose arbitrary recipients. Validation, request-size limits, an empty honeypot and low
API throttling reduce accidental/automated volume. Origin checks are not authentication
and these controls are not a CAPTCHA: add stronger bot protection if abuse appears.
No contact details are sent to Google, written to local storage or logged by the handler.
Successful acceptance by SES is not proof of inbox delivery.

## Deploy separately from Amplify

1. Use the existing AWS account and a chosen region. Verify the exact sending email
   identity in SES. In the SES sandbox, verify the recipient too (using the same verified
   address for both is sufficient). Monitor bounces and delivery failures in SES.
2. Install AWS SAM CLI and configure AWS access locally; never paste credentials into chat,
   public configuration or the repository. Deploy the stack only after reviewing its AWS
   resources, IAM permissions and usage costs:

   ```sh
   sam build --template-file backend/inquiries/template.yaml
   sam deploy --guided
   ```

   Enter the verified sender and `info@microcdlabs.com` as the recipient. The template
   grants SendEmail for the exact sender identity and limits recipients. Use the stack's
   Endpoint output. This uses the AWS SDK included in the Node.js 22 Lambda runtime.
3. Set `endpoint` in `assets/inquiry-config.js` to the deployed HTTPS URL. Leave
   `googleAdsSendTo` blank initially. No secrets belong in this file.
4. In a staging deployment, submit a clearly labeled test inquiry with your own email.
   Confirm it appears in the receiving inbox and Reply goes to the test sender.
   Verify failure handling with the endpoint unavailable. Do not enable conversion tracking
   for this test. A timeout is ambiguous: an email might have been accepted; do not auto-retry.
5. In Google Ads account 677-709-8315, create a separate **website / submit lead form**
   conversion named `Website engineering inquiry`, count **One**, and do not assign an
   invented sales value. Obtain its actual `AW-…/label` from Google Ads and put it in
   `googleAdsSendTo`. Do not reuse Purchase, Purchase (1), or the Google-hosted form action.
6. Test using Tag Assistant without fabricating an ad click. The conversion should fire
   only after a 200 JSON response containing `accepted: true` and a nonempty receipt.
   It must not fire on form views, copy, email links, validation errors or failed responses.
   The existing Google consent defaults remain denied; this change does not grant consent
   or add a consent interface. Review consent/account requirements before activation.
7. Add the verified website lead action to the engineering campaign's conversion goals,
   alongside its existing Google-hosted lead form. Avoid switching unrelated account goals.
8. Merge and deploy the reviewed frontend change through the existing Amplify workflow.
   Verify the live form, inbox, analytics and mobile layout. The website change does not
   alter the Google Ads campaign's $10/day budget.

## Behavior and rollback

With an empty or invalid endpoint the original draft/copy/email workflow remains active,
with no conversion event. With a valid endpoint the page offers Send inquiry and shows
server acceptance only after SES returns a message ID. Submit and fields are disabled
while sending and after success to avoid repeated leads. Failures retain entered details.
The SES receipt is used as the conversion transaction ID; no user-provided text goes into
that event. Clear `endpoint` and redeploy to restore the email-draft flow.

## Checks

- `node --test tests/inquiry-delivery.test.mjs`
- `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`
- `node tools/validate-site.mjs`
- Real AWS deployment, inbox receipt, Google Ads tagging and browser QA are separate
  activation checks; unit tests use stubbed email/network services and do not send email.
