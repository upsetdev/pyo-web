---
title: Subprocessors
description: The companies that help us run Pyo Cloud and may process personal data for it.
updated: "{{EFFECTIVE_DATE}}"
status: "DRAFT for legal review. Not final and not legal advice. A qualified lawyer must review and adapt this before it is published or relied on."
---

<!--
DRAFT FOR LEGAL REVIEW. NOT FINAL. NOT LEGAL ADVICE.
This text is a starting point only. A qualified lawyer must review and adapt
it before it is published, linked or relied on.
Fill in every {{PLACEHOLDER}} before publishing:
  {{HOSTING_PROVIDER}} {{DATA_REGION}} {{KMS_REGION}} {{EMAIL_PROVIDER}}
  {{EMAIL_REGION}} {{POLAR_LOCATION}} {{NOTICE_DAYS}} {{CONTACT_EMAIL}}
  {{EFFECTIVE_DATE}}
Check before publishing: each provider's DPA is signed or accepted, the
locations match the accounts actually used, Midtrans is live at launch
(remove its row if not), and add any monitoring or error tracking service
Pyo Cloud ends up using.
-->

These are the companies that help us run Pyo Cloud and may process personal data for it. Each one has signed terms with us that protect that data. Our [Data Processing Agreement](/legal/dpa) explains how we choose and change them.

| Subprocessor | What it does for Pyo Cloud | Data it handles | Location |
|---|---|---|---|
| {{HOSTING_PROVIDER}} | Hosts Pyo Cloud's servers and database | All data Pyo Cloud stores | {{DATA_REGION}} |
| Amazon Web Services (AWS KMS) | Keeps the keys that sign commands to your servers | Hashes of commands. No customer content or personal data | {{KMS_REGION}} |
| Cloudflare | Sits in front of Pyo Cloud: TLS, protection from attacks, routing | All traffic to Pyo Cloud while it passes through, including IP addresses | Global network |
| Polar | Merchant of record: checkout, subscriptions, invoices, sales tax | Name, email, billing address, payment details, subscription | {{POLAR_LOCATION}} |
| Midtrans | Payments for customers in Indonesia | Name, email, payment details, orders | Indonesia |
| {{EMAIL_PROVIDER}} | Sends Pyo Cloud's emails, such as team invites and notices | Name, email address, email contents | {{EMAIL_REGION}} |

Polar acts as the merchant of record. For the payments it handles, it is also a controller under its own privacy policy.

## Not subprocessors

Some services take part in using Pyo but are not our subprocessors. You choose them, and your own agreement with them applies.

- **Your server and storage providers.** Your services, their data, raw request logs and backups stay with them.
- **Git providers** such as GitHub and GitLab, when you connect a repository.
- **Tailscale,** when your servers join your own tailnet. Pyo Cloud never joins it.
- **DNS providers** you connect, such as Cloudflare DNS, to manage your own domains.
- **nip.io,** which turns the free addresses of your services into your server's IP address.

## Changes

We tell you at least {{NOTICE_DAYS}} days before we add or replace a subprocessor. To get these notices by email, write to {{CONTACT_EMAIL}}.
