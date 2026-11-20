---
title: Privacy Policy
description: What Pyo Cloud collects about the people who use it, why, how long we keep it, and your rights.
updated: "{{EFFECTIVE_DATE}}"
status: "DRAFT for legal review. Not final and not legal advice. A qualified lawyer must review and adapt this before it is published or relied on."
---

<!--
DRAFT FOR LEGAL REVIEW. NOT FINAL. NOT LEGAL ADVICE.
This text is a starting point only. A qualified lawyer must review and adapt
it before it is published, linked or relied on.
Values chosen (only the effective date is left):
  Effective date: still a placeholder in "updated". Set it on publishing.
    Until then the page shows "Draft, not yet in effect".
  Data region: the European Union. Pyo Cloud stores and processes data
    in the EU.
  Data kept after a subscription ends or an account is deleted: 30 days.
  Backups: 30 days.
Transfers: some subprocessors may process data outside the EU, under
standard contractual clauses or another lawful safeguard: Cloudflare's
global network, Polar, Midtrans for payments in Indonesia, and AWS for
KMS calls (the keys live in an EU region, but AWS is a US company and
the calls carry only hashes of commands). Check the safeguard for each
and that "Where it is stored" says it correctly.
The contact for privacy requests is support@pyo.dev, the general
contact. Check whether a data protection officer or a separate privacy
contact is needed. If so, add it here.
Payments: Polar is merchant of record for card payments. For Midtrans
payments in Indonesia the operator is the seller, so it keeps invoice and
tax records itself. Check whether Midtrans is a processor or an
independent controller for the data it collects.
No legal entity or governing law exists yet. The text names "Pyo
(pyo.dev)" as the party and gives no address. An entity, its address and
the governing law must be added here before publishing.
Open points for the lawyer: lawful bases, whether an EU or UK
representative is needed (GDPR art. 27), the transfer mechanism for each
subprocessor outside the EU, the supervisory authority to name,
and whether the pyo.dev website's cookieless analytics need a mention here.
What moved: the subprocessors list is no longer its own page. It is now
Annex 3 of the Data Processing Agreement (/legal/dpa#annex-3-subprocessors).
"Who we share it with" links there instead of keeping its own copy. Check
that pointing a controller notice at an annex of the DPA is enough, or
whether this policy should name the recipients itself.
-->

This policy explains what Pyo (pyo.dev, "we", "us") collects about the people who use Pyo Cloud, and why. It covers cloud.pyo.dev, the Pyo Cloud API and the emails we send about Pyo Cloud.

For the personal data in your account, we are the controller. For personal data that your services handle, such as data about the visitors to your websites, you are the controller and we process it for you. Our [Data Processing Agreement](/legal/dpa) covers that.

Self-hosted Pyo is not covered by this policy. If you run Pyo yourself, its data stays with you.

## What we collect

### When you create an account and use it

- **Account details:** your name, email address, time zone and the teams you belong to.
- **Sign-in details:** a hash of your password, your passkeys' public keys, and your sessions. For each session we keep a hash of its token and your browser's user agent. We do not keep your password itself.
- **API keys and connected apps:** a hash of each API key, and the apps you allow to act for you, such as MCP clients.
- **What you do in Pyo Cloud:** your team's activity and audit log. This records who did what and when, such as a deploy, a change to a setting or a new member.

### About your teams and servers

- **Configuration:** projects, services, domains, environment variables and other settings you save.
- **Secrets:** values you mark as secret, and the credentials you connect, such as a Git provider or a storage bucket. We encrypt them before we save them.
- **From the agent on your servers:** server names, addresses, operating system, size and health, server metrics, deployment history and status, and build logs.
- **Analytics totals:** counts per minute for your services, such as requests, status codes, response times, countries, paths, referrers and an estimate of unique visitors. These are totals only. Raw request logs and visitors' IP addresses stay on your servers.

### Payments

Polar handles card payments as the merchant of record. In Indonesia, Midtrans also handles QRIS, bank transfer and e-wallet payments. For those, we are the seller, so we keep the invoices that tax law requires. Polar and Midtrans collect your card or payment details. We do not see or keep full card numbers. We receive your subscription status, the number of servers paid for, your billing country and payment events.

### When you write to us

Your messages and anything you send with them, so that we can answer.

### Technical data

Cloudflare sits in front of Pyo Cloud and sees your IP address and request details to deliver and protect the service. To limit sign-in attempts, we keep a hash of the address or email for up to a day. We use your country, from Cloudflare or our IP database, to show the right payment options.

## Why we use it

| Purpose | Data | Legal basis under the GDPR |
|---|---|---|
| Run Pyo Cloud and your account | Account, sign-in, configuration, data from the agent | Contract |
| Keep Pyo Cloud and your account secure | Sign-in data, audit log, technical data | Legitimate interests, and contract |
| Bill you | Payment and subscription data | Contract, and legal obligation |
| Send emails you need, such as team invites, payment problems and security notices | Email address, account details | Contract |
| Tell you about important changes to Pyo Cloud or these policies | Email address | Contract, and legitimate interests |
| Answer your questions | Your messages | Contract, and legitimate interests |
| Meet legal duties, such as tax records | Payment data, account details | Legal obligation |

We do not sell your personal data. We do not use it for advertising. We do not send marketing email unless you ask for it.

## Cookies

Pyo Cloud uses one cookie, `pyo_session`. It keeps you signed in. It is needed for the service to work, so we do not ask for consent. It ends 30 days after you sign in, or sooner if you stay away for a week or sign out.

The dashboard also saves a few settings in your browser's local storage, such as your theme and what you last had open. They stay in your browser and are not sent to us.

We do not use advertising or tracking cookies.

## How long we keep it

| Data | How long |
|---|---|
| Account and team data, configuration and secrets | While your account or team exists, then 30 days after the subscription ends or the account is deleted |
| Build logs | 90 days |
| Deployment history | While the service exists |
| Analytics totals | 13 months |
| Raw request logs | Not kept by Pyo Cloud. They stay on your servers, 7 days by default, and you can change that |
| Server metrics | 30 days |
| Audit log | 1 year |
| Sessions | Up to 30 days |
| Sign-in rate limit records | Up to 1 day |
| Payment records | As long as tax and accounting law requires |
| Backups of our database | 30 days |

When a team is deleted, its encryption keys are deleted too, so its secrets can no longer be read, even in a backup.

## Who we share it with

We share personal data only with the companies that help us run Pyo Cloud, and only what they need for that. They are our subprocessors. [Annex 3 of our Data Processing Agreement](/legal/dpa#annex-3-subprocessors) names each one, what it does and where.

We may also share personal data when the law requires it, to protect our rights or the safety of others, or as part of a sale or merger of the business behind Pyo Cloud. In that last case we tell you first.

## Where it is stored

We store and process Pyo Cloud's data in the European Union, on Hetzner servers in Germany and Finland. Some subprocessors may process personal data outside the EU. These include Cloudflare's global network, Polar, Midtrans for payments in Indonesia, AWS for the keys that sign commands, and Resend for our emails. When personal data leaves the European Economic Area, the United Kingdom or Switzerland, we use safeguards that the law accepts, such as the European Commission's standard contractual clauses.

## How we protect it

- Commands to your servers are signed with keys kept in AWS KMS, which cannot be exported.
- Each team's data is kept apart in our database by row-level security, on top of the API's own checks.
- Secrets are encrypted with a key per team before we save them.
- Connections to Pyo Cloud are encrypted.
- Only the people who run Pyo Cloud can reach its systems, and they use two-factor authentication.

## Your rights

Depending on where you live, you have the right to:

- see the personal data we have about you, and get a copy
- correct it
- have it deleted
- limit how we use it, or object to how we use it
- take it with you in a common format
- withdraw consent, where we rely on consent
- complain to your data protection authority

You can change most of your details in the dashboard, and delete your account there. For anything else, email support@pyo.dev. We answer within one month. We may need to confirm who you are first.

If you are a visitor to a service that runs on Pyo, please contact the owner of that service. They control that data. We will help them answer you.

## Children

Pyo Cloud is not meant for anyone under 18, and we do not knowingly collect their data.

## Changes to this policy

We may change this policy. We tell you about important changes by email or in the dashboard before they apply. The date at the top shows the last change.

## Contact

Pyo, pyo.dev. Email support@pyo.dev.
