---
title: Terms of Service
description: The terms for using Pyo Cloud, the hosted Pyo control plane run by the Pyo team.
updated: "{{EFFECTIVE_DATE}}"
status: "DRAFT for legal review. Not final and not legal advice. A qualified lawyer must review and adapt this before it is published or relied on."
---

<!--
DRAFT FOR LEGAL REVIEW. NOT FINAL. NOT LEGAL ADVICE.
This text is a starting point only. A qualified lawyer must review and adapt
it to the operator's entity, jurisdiction and payment setup before it is
published, linked or relied on.
Values chosen (only the effective date is left):
  Effective date: still a placeholder in "updated". Set it on publishing.
    Until then the page shows "Draft, not yet in effect".
  Notice period: 30 days for price changes, changes to these terms and
    stopping Pyo Cloud (sections 7, 11 and 16).
  Grace period for failed payments: 7 days, as in the billing code
    (section 9).
  Data kept after a subscription ends: 30 days, then deleted. Backups
    expire within 30 more days (section 11).
  Refund sent within: 14 days of approval (section 8).
  Yearly plans: no refund of the rest of the year after cancelling. The
    plan runs to the end of the paid year (section 8).
  Credit left when a subscription ends: used against the final invoice.
    Anything left after that is not paid out, unless the law requires it
    (section 8).
  EU right of withdrawal: section 8 says a 14-day right of withdrawal may
    apply to consumers in the EU. Check how it works when the service
    starts at once on subscribing: the consumer's express request to
    start early, what share of the payment we may keep, and the notice
    and model withdrawal form the law requires. For card payments Polar is
    the seller, so check how its own withdrawal and refund rules fit.
No legal entity or governing law exists yet. The text names "Pyo
(pyo.dev)" as the party and gives no address. Section 17 names no
governing law and no courts. An entity, its address and the governing
law (with the courts for disputes) must be added before publishing.
The general contact is support@pyo.dev. It also takes abuse reports and
security reports for now. A separate security address (and a separate
abuse address) could be added later.
Open points for the lawyer: liability cap, indemnity, consumer law where
customers are individuals, dispute resolution and venue.
What moved here: the Acceptable Use Policy was its own page
(/legal/acceptable-use). It is now section 4 of these terms, with the same
rules, the abuse reporting steps and what we do about reports. That page
is removed. Its open points still stand: notice and takedown duties under
the EU Digital Services Act or local law, and a copyright (DMCA style)
process if one is needed.
Fair use (section 4, "Fair use"): Pyo Cloud has no request or traffic
limits. The fair-use point lets us contact a team and, if needed, limit
or suspend use that harms Pyo Cloud or other customers. It covers load on
Pyo's own systems only (API calls, agent traffic, build load), never the
customer's own servers or their traffic. It now sits with the two old
acceptable use rules on overload and unrelated work. Check it is clear
enough to rely on, how it fits the suspension rules in section 11, and
whether we must give notice before we limit anything.
Refunds now have their own section 8. It covers no refunds for partial
periods or unused servers (unless the law requires one), credits for
removed servers, yearly plans, refunds if Pyo Cloud shuts down, how
refunds are paid (Polar for cards, the operator for Midtrans) and how to
ask. Check it against consumer law, the EU right of withdrawal for
digital services in particular, and Polar's own refund rules as merchant
of record. Unused credit is not paid out when a subscription ends,
unless the law requires it. Check that rule holds up for consumers.
Payments (section 7): cards go through Polar for everyone, as merchant of
record. Customers in Indonesia can also pay with QRIS, bank transfer or
e-wallets through Midtrans, in rupiah, a month or a year at a time. For
Midtrans payments the operator is the seller, not Polar. So the operator
issues the invoice and owes any Indonesian VAT (PPN) and other tax on
those sales. Check the tax registration, invoice rules and consumer law
this brings, and whether sections 7 and 8 say it correctly.
Leaving (section 11): Pyo has no team export. Section 11 and DPA
section 12 say a team can move to self-hosted Pyo by following the manual
steps in /docs/cloud/moving-to-self-hosted, and promise no export
feature. That docs page must exist before publishing. Check this is
enough for data portability.
Availability (section 10): there is no service level agreement and no
uptime commitment, with no end date. Check this still holds up and fits
the disclaimers in section 13.
-->

These terms are an agreement between you and Pyo (pyo.dev, "we", "us"). They cover Pyo Cloud at cloud.pyo.dev and everything that comes with it ("Pyo Cloud").

If you use Pyo Cloud for a company or another organization, you accept these terms for it, and you confirm that you may do so. "You" then means that organization.

## 1. What Pyo Cloud is

Pyo is open-source software under the Apache License 2.0. Anyone may run it on their own servers for free. These terms do not cover that software or self-hosted installs. The Apache License covers those.

Pyo Cloud is a hosted version of Pyo's control plane. We run the dashboard, the API and the database that holds your team's configuration. You install Pyo's agent on servers that you own or rent. Your services, images, backups, logs and data stay on those servers. The agent connects out to Pyo Cloud and carries out the commands that you or your team give in Pyo Cloud.

## 2. Your account

- You need an account to use Pyo Cloud. Give us true and current details, and keep them up to date.
- You must be at least 18 years old, or the age of majority where you live.
- Keep your password, passkeys, API keys and connect commands safe. You are responsible for what happens under your account and your teams, unless it is our fault.
- Tell us at support@pyo.dev as soon as you think someone has used your account without your permission.
- A team is a group of accounts that share servers, projects and services. Team owners decide who joins a team and what each member may do. A team's owners are responsible for the team's members.

## 3. Using Pyo Cloud

- You may use Pyo Cloud to deploy and run your services on your own servers.
- You must follow the rules in [section 4](#4-acceptable-use).
- Do not resell or rent out access to Pyo Cloud itself without our written permission. You may run services for your own customers on your servers.

## 4. Acceptable use

This section applies to everyone who uses Pyo Cloud, and to everything they send to it or run through it.

### Where this applies

With Pyo Cloud, your services run on your own servers. Your hosting provider's rules apply to what runs there, and you are responsible for following them.

This section covers what reaches Pyo and what Pyo helps you do. That includes your account, your teams, the dashboard, the API, the commands Pyo Cloud sends to your servers, and the data your servers send back, such as build logs, metrics and analytics totals. It also covers services you deploy through Pyo Cloud, because we deploy and manage them for you.

### What you may not do

**Attack or abuse Pyo Cloud**

- Try to access another team's data, servers or account.
- Probe, scan or test the security of Pyo Cloud without our written permission. If you find a security problem, please report it to support@pyo.dev.
- Get around rate limits, billing, server counts or security checks.
- Send data to Pyo Cloud that contains malware or is meant to exploit it.

**Use Pyo Cloud to harm others**

- Deploy or control malware, botnets, phishing pages or command and control servers.
- Attack other systems, for example with denial of service attacks, scans or brute force sign-in attempts.
- Send spam or unsolicited bulk messages.
- Host or distribute content that is illegal, including child sexual abuse material, content that infringes others' rights, and content that incites violence.
- Collect or use other people's personal data unlawfully.
- Impersonate others or mislead people about who you are.
- Break sanctions or export control laws.

**Misuse accounts**

- Share accounts between people. Invite them to your team instead.
- Create accounts to get around a suspension.
- Sign up with false details.

### Fair use

Pyo Cloud has no request or traffic limits. Your servers and the traffic to your services are yours. If your use harms Pyo Cloud or other customers, we may contact you and, if needed, limit or suspend that use. Examples are abusive volumes of API calls, agent traffic or build load against Pyo's own systems.

Also, do not:

- Overload Pyo Cloud, for example with excessive API calls, fake servers or data built to slow it down.
- Use Pyo Cloud's resources for work that is not deploying and running your services, such as crypto mining or storing unrelated files in build logs or configuration.

### Reporting abuse

To report abuse involving Pyo Cloud, email support@pyo.dev. Please include:

- the address, domain or service involved
- what happened, and when
- any evidence, such as logs or screenshots
- how to reach you

Visitors who have a problem with a service that runs on Pyo should usually contact its owner, or the hosting provider of the server it runs on. We help where Pyo Cloud is involved.

### What we do about it

- We look at every report and confirm that we got it.
- We may ask the team involved to explain or fix the problem, and give them reasonable time to do so.
- When there is a serious risk to Pyo Cloud, other customers or the public, we may act at once. We may pause deploys, stop sending commands to a cluster, remove a domain from a team, or suspend an account.
- We do not log in to your servers. We act through Pyo Cloud. Removing content from your servers is up to you and your hosting provider.
- We may report illegal content or activity to the authorities, and we cooperate with valid legal requests.
- We tell the team what we did and why, unless the law or a risk to others prevents that. You can reply to dispute it.

## 5. Your servers and your content

- **Your servers are yours.** You choose and pay the provider. You are responsible for the servers, their operating system, their network and firewall, their backups and their costs. This includes bandwidth and storage your providers bill you for.
- **Your content is yours.** Your code, images, configuration, secrets and data stay yours. You give us only the rights we need to run Pyo Cloud for you. That means storing, copying, processing and sending your content as the service requires.
- **You are responsible for your content and your services.** This includes what your services do, what they store and how they treat the people who use them. You must have the rights and permissions you need for them.
- **Backups.** Pyo Cloud helps you set up backups to storage you choose. Pyo Cloud does not keep copies of your services' data. You are responsible for checking that your backups work.
- **Commands to your servers.** The agent runs on your servers with broad rights, because it deploys and manages your services. It accepts only commands that Pyo Cloud has signed for your cluster. You can stop it, or remove it from your servers, at any time.

## 6. Personal data

Our [Privacy Policy](/legal/privacy) explains what we collect about you and why. When Pyo Cloud processes personal data for you, such as data about the visitors to your services, our [Data Processing Agreement](/legal/dpa) applies. It is part of these terms. Its [Annex 3](/legal/dpa#annex-3-subprocessors) lists the companies that help us run Pyo Cloud.

## 7. Price and payment

- **Price.** Pyo Cloud costs $5 per server per month, or 20% less when you pay for a year. A server is each machine you connect, counted once, whatever its roles. Clusters, teams, members, projects and services cost nothing extra. Prices do not include taxes unless we say so.
- **No trial.** There is no free trial. Self-hosted Pyo is the free option.
- **When you pay.** You add a payment method before you connect your first server. You pay in advance for each month or year. A server added during a billing period is charged for the rest of that period. A server removed during a period is credited on your next invoice.
- **Who you pay.** Card payments go through Polar, which acts as the merchant of record. Polar is the seller for those payments. It charges you, sends invoices and handles sales tax and VAT. Polar's own terms also apply to those payments.
- **Paying in Indonesia.** Customers in Indonesia can also pay with QRIS, bank transfer or e-wallets through Midtrans, in Indonesian rupiah. For those payments, we are the seller. We send the invoice and handle the tax due on the sale. Midtrans only processes the payment.
- **Price changes.** We may change prices. We will tell you at least 30 days before a change applies to you. A new price applies from your next billing period after that notice.
- **Refunds.** [Section 8](#8-refunds) explains when we refund a payment.

## 8. Refunds

- **No refunds for unused time.** We do not refund part of a month or a year, or servers you paid for but did not use. This does not limit any right to a refund or withdrawal the law gives you.
- **Removing a server.** If you remove a server during a billing period, we credit the unused part of that period on your next invoice. If you add a server, we charge it pro rata for the rest of the period.
- **Yearly plans.** If you cancel a yearly plan, we do not refund the rest of the year. Your plan runs to the end of the year you paid for.
- **Credit when your subscription ends.** Credit from removed servers is used against your final invoice. Credit left after that is not paid out, unless the law requires it.
- **Consumers in the EU.** If you are a consumer in the EU, you may have a right to withdraw from your subscription within 14 days. If you asked us to start the service during that time, you may have to pay for the part you used.
- **If Pyo Cloud shuts down.** If we stop offering Pyo Cloud, we refund what you paid for time you can no longer use.
- **How refunds are paid.** Card payments are refunded through Polar, back to the card you paid with. Midtrans payments in Indonesia are refunded by us, to the method you paid with or by bank transfer.
- **How to ask.** Email support@pyo.dev with your team name and the payment. Once we approve a refund, we send it within 14 days. Your bank or card issuer may take a few more days to show it.

## 9. Failed payments

- If a payment fails, we tell you and try again.
- Your services keep running on your servers.
- If the payment still has not gone through after 7 days, deploys pause. While paused, you cannot deploy or connect new servers. Your services keep running, and you can still sign in, see your team and pay.
- Deploys resume as soon as the payment goes through.
- If a payment stays unpaid for a long time, we may end your subscription as in [section 11](#11-cancelling-and-ending).

## 10. Availability

- There is no service level agreement. We do not promise any level of uptime.
- We work to keep Pyo Cloud available and to fix problems quickly. We may need to stop it for maintenance or in an emergency, and we try to warn you first.
- Your services run on your servers. When Pyo Cloud is down, your services keep running, but you may not be able to deploy or change them until it is back.
- We may change, add or remove features. If we remove a feature you rely on in a way that matters, we will tell you first when we can.

## 11. Cancelling and ending

- **You can cancel at any time.** Cancel in Settings › Billing, or remove all your servers. Cancelling stops future charges. You keep access until the end of the period you paid for.
- **We can end or suspend your account** if you break these terms, including the acceptable use rules in [section 4](#4-acceptable-use), if you do not pay, or if the law requires it. If we can, we tell you first and give you a fair chance to fix the problem. We can act at once when there is a serious risk to Pyo Cloud, other customers or the public.
- **We can stop offering Pyo Cloud.** If we do, we tell you at least 30 days ahead and refund what you paid for time you could not use, as in [section 8](#8-refunds).
- **Leaving with your data.** You can move your team to self-hosted Pyo at any time. Follow the manual steps in [Moving to self-hosted Pyo](/docs/cloud/moving-to-self-hosted). Your services and data are already on your servers.
- **What happens to your data.** After your subscription ends, we keep your team's data for 30 days so that you can come back or move to self-hosted Pyo. Then we delete it. Copies in our backups are deleted when those backups expire, within 30 more days. Our [Privacy Policy](/legal/privacy) lists how long we keep each kind of data.
- **The agent.** When your subscription ends, the agent on your servers stops receiving commands. Your services keep running until you change or remove them. Removing the agent is up to you.

## 12. Open-source software

Pyo, including the agent, is open-source software under the Apache License 2.0. Your use of that software is covered by its license. These terms cover only the service we run.

## 13. Disclaimers

We provide Pyo Cloud "as is" and "as available". As far as the law allows, we give no promises that are not written in these terms. This includes promises that Pyo Cloud will be free of errors, will always be available, or will suit a particular purpose.

## 14. Limits on our liability

As far as the law allows:

- We are not liable for indirect or consequential losses. This includes lost profits, lost revenue, lost data and lost business, even if we knew they could happen.
- Our total liability for all claims about Pyo Cloud is limited to what you paid us for Pyo Cloud in the 12 months before the event that caused the claim.
- These limits do not apply where the law does not allow them. This can include death or personal injury caused by negligence, fraud, or anything else that cannot be limited by law.

## 15. Your responsibility to us

If someone makes a claim against us because of your content, your services or your breach of these terms, you will cover our reasonable costs of that claim. This does not apply where the claim is caused by us.

## 16. Changes to these terms

We may change these terms. We tell you about important changes by email or in the dashboard at least 30 days before they apply. If you keep using Pyo Cloud after that, the new terms apply. If you do not agree, you can cancel before they apply.

## 17. Disputes

- If you have a problem with Pyo Cloud, write to support@pyo.dev first. We will try to solve it with you.
- These terms do not take away any rights you have under the law where you live.

## 18. Everything else

- These terms, the Privacy Policy and the Data Processing Agreement are the whole agreement about Pyo Cloud.
- If a part of these terms cannot be enforced, the rest still applies.
- If we do not enforce a part of these terms right away, we can still enforce it later.
- You may not transfer these terms to someone else without our permission. We may transfer them to a company that takes over Pyo Cloud, and we will tell you if we do.
- Neither of us is responsible for delays caused by events outside reasonable control.

## 19. Contact

Pyo, pyo.dev. Email support@pyo.dev.
