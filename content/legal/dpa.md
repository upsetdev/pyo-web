---
title: Data Processing Agreement
description: How Pyo Cloud processes personal data for its customers, under the GDPR and similar laws.
updated: "{{EFFECTIVE_DATE}}"
status: "DRAFT for legal review. Not final and not legal advice. A qualified lawyer must review and adapt this before it is published or relied on."
---

<!--
DRAFT FOR LEGAL REVIEW. NOT FINAL. NOT LEGAL ADVICE.
This text is a starting point only. A qualified lawyer must review and adapt
it before it is published, linked, signed or relied on.
Values chosen (only the effective date is left):
  Effective date: still a placeholder in "updated". Set it on publishing.
    Until then the page shows "Draft, not yet in effect".
  Data region: the European Union. Pyo Cloud stores and processes data
    in the EU (section 8, Annex 1, Annex 3).
  KMS region: an AWS region in the EU (Annex 3).
  Data kept after a subscription ends: 30 days, then deleted. Backups
    expire within 30 days (section 12).
  Breach notice: within 48 hours of becoming aware, so the customer can
    meet the GDPR's 72-hour deadline (section 10).
  Subprocessor change notice: 30 days (section 7, Annex 3).
  Hosting provider and email provider: not named on purpose. Annex 3
    describes them by category ("Hosting provider", "Email delivery
    provider"). Check this is enough for GDPR art. 28(2) and (4), which
    expect the controller to know who the subprocessors are. If not,
    name them here or offer the names on request.
  Polar's location: not stated. Annex 3 points to Polar's own privacy
    policy.
Transfers (section 8): some subprocessors may process data outside the
EU, under standard contractual clauses or another lawful safeguard:
Cloudflare's global network, Polar, Midtrans for payments in Indonesia,
and AWS for KMS calls (the keys live in an EU region, but AWS is a US
company and the calls carry only hashes of commands). The email provider
may also send from outside the EU. Check the safeguard for each.
No legal entity or governing law exists yet. The text names "Pyo
(pyo.dev)" as the party and gives no address. An entity, its address and
the governing law must be added here before publishing.
Open points for the lawyer: attach or incorporate the EU standard
contractual clauses (module 2, and module 3 where the customer is itself a
processor) and the UK addendum, audit terms, liability under the DPA, and
whether customers need a signable copy. DPA questions and deletion
requests go to support@pyo.dev, the general contact. Check whether a
separate privacy contact or a data protection officer is needed.
The security measures in Annex 2 describe the design as built. Check each
one is live in production before publishing (2FA for staff, KMS signer,
row-level security on every table, build log cleanup).
What moved here: the subprocessors list was its own page
(/legal/subprocessors). It is now Annex 3 of this DPA, with the same
table, the "Not subprocessors" list and the notes on Polar and Midtrans.
That page is removed. Section 7 links to Annex 3 and says how customers
are told about changes: an email to each team's owners at least
30 days ahead, and a new date on Annex 3. The Privacy Policy
points to Annex 3 for its list of the companies we share data with, so
Annex 3 also names them for account data, which Pyo controls.
Check before publishing (from the old subprocessors page): each
provider's DPA is signed or accepted, the locations match the accounts
actually used, and add any monitoring or error tracking service Pyo Cloud
ends up using. Midtrans is live at launch for Indonesia. The operator is
the seller for Midtrans payments, unlike Polar's merchant of record setup.
Check whether Midtrans belongs in Annex 3 as a processor, or is an
independent controller like Polar.
-->

This Data Processing Agreement ("DPA") is part of the Pyo Cloud [Terms of Service](/legal/terms) between you, the customer, and Pyo (pyo.dev, "we", "us"). It applies when Pyo processes personal data for you while providing Pyo Cloud. If this DPA and the Terms differ on personal data, this DPA wins.

## 1. Words we use

- **Personal data, processing, controller, processor, data subject and supervisory authority** mean what they mean in the GDPR.
- **Data protection law** means the EU GDPR, the UK GDPR, the Swiss Federal Act on Data Protection and any other privacy law that applies to the processing.
- **Customer personal data** means personal data that Pyo processes for you through Pyo Cloud.
- **Subprocessor** means a company that Pyo uses to process customer personal data.
- **Personal data breach** means a breach of security that leads to customer personal data being destroyed, lost, changed, disclosed or accessed without permission.

## 2. Roles

You are the controller of customer personal data, or a processor acting for your own customers. Pyo is your processor, or your subprocessor.

For the personal data of the people who hold Pyo Cloud accounts, Pyo is a controller. The [Privacy Policy](/legal/privacy) covers that, not this DPA.

## 3. What Pyo processes

Pyo Cloud is a control plane. Your services and their data run on your own servers, and most of their personal data never reaches Pyo. Pyo processes customer personal data only where it reaches Pyo Cloud. Annex 1 describes it. In short:

- **Analytics totals** about the visitors to your services. Countries, paths, referrers and an estimate of unique visitors, counted per minute. Visitors' IP addresses are not sent. Raw request logs stay on your servers.
- **Build logs**, which may contain whatever your build prints.
- **Configuration and secrets** you save, which may contain personal data if you put it there.
- **Anything else the agent sends,** such as server metrics, deployment status, and the live logs, request details and terminal sessions you open from the dashboard. Live logs, request details and terminal sessions pass through Pyo Cloud to your browser and are not stored.

## 4. Your instructions

- Pyo processes customer personal data only to provide Pyo Cloud, as the Terms, this DPA and your use of the dashboard, API and CLI describe. These are your instructions.
- If the law makes Pyo process customer personal data for another reason, Pyo tells you first, unless the law forbids that.
- Pyo tells you if it thinks an instruction breaks data protection law.
- You are responsible for having a legal basis for the personal data your services handle, and for telling the people concerned what you need to tell them.

## 5. Confidentiality

Pyo makes sure that everyone who can access customer personal data is bound to keep it confidential, and accesses it only as needed to provide, support or secure Pyo Cloud.

## 6. Security

Pyo keeps the technical and organisational measures in Annex 2 in place. Pyo may improve them over time, but will not lower the overall level of protection.

## 7. Subprocessors

- You give Pyo general permission to use subprocessors. The current ones are listed in [Annex 3](#annex-3-subprocessors).
- Pyo gives each subprocessor written terms that protect customer personal data at least as well as this DPA. Pyo stays responsible for its subprocessors' work.
- Pyo tells you at least 30 days before it adds or replaces a subprocessor. Pyo emails your team's owners, and updates Annex 3 with the date of the change. To get these emails at another address too, write to support@pyo.dev.
- You can object, on reasonable data protection grounds, within that time. If we cannot resolve it together, you can end your subscription before the change applies, and Pyo refunds what you paid for time you could not use.

## 8. Transfers outside your region

Pyo stores and processes customer personal data in the European Union. Some subprocessors may process it outside the EU. These include Cloudflare's global network, Polar, Midtrans for payments in Indonesia, and AWS for the keys that sign commands. When customer personal data goes to a country without an adequacy decision, Pyo uses the European Commission's standard contractual clauses, the UK addendum, or another lawful safeguard. Those clauses are part of this DPA where they are needed.

## 9. Helping you

- **Requests from data subjects.** If someone asks Pyo to exercise their rights over customer personal data, Pyo sends them to you and does not answer for you. Pyo helps you answer such requests where you cannot do it yourself in the dashboard.
- **Impact assessments and authorities.** Pyo gives you reasonable help with data protection impact assessments and with questions from supervisory authorities, based on the information Pyo has.

## 10. Personal data breaches

- Pyo tells you without undue delay, and within 48 hours, after it becomes aware of a personal data breach that affects your customer personal data.
- Pyo tells the email addresses of your team's owners. The notice says what happened, what data and how many people are likely affected, what Pyo is doing about it, and who to contact. If Pyo does not know everything yet, it sends what it knows and follows up.
- Pyo takes reasonable steps to contain the breach and limit its harm.
- Telling you about a breach does not mean Pyo accepts fault.

## 11. Audits

- Pyo makes the information you need to show that this DPA is followed available to you when you ask for it.
- If that is not enough, or a supervisory authority requires it, you may audit Pyo once a year, with 30 days' notice, at your cost, during business hours, through an independent auditor bound to confidentiality. An audit must not put other customers' data at risk.

## 12. When the subscription ends

- When your subscription ends, Pyo keeps customer personal data for 30 days so that you can come back or move to self-hosted Pyo. Then Pyo deletes it.
- You can move your team to self-hosted Pyo at any time before then. Follow the manual steps in [Moving to self-hosted Pyo](/docs/cloud/moving-to-self-hosted). You can also ask for earlier deletion by emailing support@pyo.dev.
- Copies in Pyo's backups are deleted when those backups expire, within 30 days. Each team's secrets are encrypted with the team's own key, which is deleted with the team, so they cannot be read from a backup.
- Pyo may keep data only where the law requires it, and keeps it confidential.
- Data on your own servers is in your control. Pyo does not delete it.

## 13. Term

This DPA applies as long as Pyo processes customer personal data for you, including after the Terms end.

## 14. Contact

Questions about this DPA go to support@pyo.dev.

## Annex 1. Details of the processing

| | |
|---|---|
| **Subject matter** | Providing Pyo Cloud, the hosted control plane for Pyo |
| **Duration** | The term of your subscription, plus the deletion period in section 12 |
| **Nature and purpose** | Storing, organising, showing and sending data so you can deploy, run and watch your services on your servers |
| **Data subjects** | Visitors and users of your services, your team members and staff, and anyone whose data you put in configuration, secrets or builds |
| **Types of personal data** | Visitor analytics totals (country, paths, referrers, unique visitor estimates), build log contents, data in configuration and secrets, and data in live logs, request details and terminal sessions while they pass through |
| **Special categories** | None intended. Do not put special category data in configuration, secrets or build output |
| **Frequency** | Continuous while your servers are connected |
| **Retention** | Build logs 90 days, analytics totals 13 months, server metrics 30 days, audit log 1 year, configuration and secrets while the team exists |
| **Location** | The European Union, and the subprocessors' locations in Annex 3 |

## Annex 2. Security measures

**Your servers and the agent**

- Your servers connect out to Pyo Cloud. Pyo Cloud does not need any open port on them.
- Every command the agent receives is signed for your cluster. The agent refuses commands that are unsigned, changed, replayed, expired or meant for another cluster.
- The keys that sign commands are kept in AWS KMS and cannot be exported. The signing service runs on its own host, sees only hashes of commands and never sees secrets. It limits how often it signs for each cluster and keeps an audit log.
- The agent proves who it is with its own key for each cluster. Keys can be revoked.
- Visitors' IP addresses are reduced to a country and a salted hash on your servers before anything is sent. The salt changes daily.

**Data in Pyo Cloud**

- Each team's data is kept apart by row-level security in the database, in addition to the API's own checks.
- Secrets are encrypted with a key per team (envelope encryption with XSalsa20-Poly1305). Team keys are themselves encrypted with a master key kept apart from the database.
- Passwords are stored only as hashes. API keys and session tokens are stored only as hashes.
- A team must prove it owns a domain with a DNS record before it can use that domain.
- Build logs are deleted after 90 days.

**Network and access**

- All traffic to Pyo Cloud is encrypted with TLS. Cloudflare sits in front of Pyo Cloud and filters attacks.
- Sign-in attempts are rate limited. Passkeys and two-factor authentication are available.
- Only the people who run Pyo Cloud can reach its systems, with two-factor authentication and the least access they need.
- Pyo's database is backed up, and restores are tested.

**Organisation**

- Everyone with access is bound to confidentiality.
- Pyo has a plan to respond to incidents and to notify customers.
- Pyo's source code is open, so anyone can review how Pyo Cloud's control plane and the agent work.

## Annex 3. Subprocessors

These are the companies that help us run Pyo Cloud and may process personal data for it. Each one has signed terms with us that protect that data. Section 7 explains how we choose and change them. We also use them for the personal data in Pyo Cloud accounts, which our [Privacy Policy](/legal/privacy) covers.

| Subprocessor | What it does for Pyo Cloud | Data it handles | Location |
|---|---|---|---|
| Hosting provider | Hosts Pyo Cloud's servers and database | All data Pyo Cloud stores | European Union |
| Amazon Web Services (AWS KMS) | Keeps the keys that sign commands to your servers | Hashes of commands. No customer content or personal data | An AWS region in the EU |
| Cloudflare | Sits in front of Pyo Cloud: TLS, protection from attacks, routing | All traffic to Pyo Cloud while it passes through, including IP addresses | Global network |
| Polar | Merchant of record for card payments: checkout, subscriptions, invoices, sales tax | Name, email, billing address, payment details, subscription | See Polar's privacy policy |
| Midtrans | Payment processor for customers in Indonesia: QRIS, bank transfer and e-wallets | Name, email, payment details, orders | Indonesia |
| Email delivery provider | Sends Pyo Cloud's emails, such as team invites and notices | Name, email address, email contents | The EU or other countries, under the safeguards in section 8 |

Polar acts as the merchant of record. For the payments it handles, it is also a controller under its own privacy policy. For Midtrans payments, we are the seller and Midtrans processes the payment for us.

**Not subprocessors.** Some services take part in using Pyo but are not our subprocessors. You choose them, and your own agreement with them applies.

- **Your server and storage providers.** Your services, their data, raw request logs and backups stay with them.
- **Git providers** such as GitHub and GitLab, when you connect a repository.
- **Tailscale,** when your servers join your own tailnet. Pyo Cloud never joins it.
- **DNS providers** you connect, such as Cloudflare DNS, to manage your own domains.
- **nip.io,** which turns the free addresses of your services into your server's IP address.

**Changes.** We tell you at least 30 days before we add or replace a subprocessor, as section 7 describes. The date at the top of this page shows the last change.
