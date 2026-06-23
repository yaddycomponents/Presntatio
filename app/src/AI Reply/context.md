Here's a summary of the AI Auto-Reply feature, organized so you can lift sections straight into slides.

## What it is
An AI layer on Growfin's AR shared mailboxes that reads inbound customer emails, classifies intent, and automatically sends grounded replies for a fixed set of safe, repetitive request types — while routing anything uncertain back to a human. The design philosophy is **conservative by default**: when in doubt, it abstains rather than guesses.

## How the pipeline works
An inbound email flows through four stages:

1. **Pre-classification noise filter** — drops anything that shouldn't be answered at all: internal-domain senders, machine senders (Bill.com, Tipalti, NetSuite, Ramp), bounce-backs, out-of-office replies, cold sales, and non-English mail. Filtered ≠ bounced — these are logged with a reason, never returned to the customer. A loop guard stops AI replies from cascading with the customer's own auto-responders.
2. **Intent detection** — a multi-label classifier returns one or more "themes" with a confidence score. Below threshold = no intent. Only the customer's top message is read; quoted history is ignored.
3. **Decisioning (per-theme)** — each detected theme is evaluated independently and must pass a *grounding* check (the required asset actually exists) before it can send. One theme failing doesn't block the others.
4. **Composition & send** — sendable themes are bundled into a single Reply-All email, always sent from the configured AR mailbox.

## The six themes (the core capability)
| Theme | Handles | Sends |
|-------|---------|-------|
| **T1 — Remittance** | "We paid INV-001" | Thank-you acknowledgement, no attachment |
| **T2 — Invoice copy** | "Send a copy of INV-001" | The invoice PDF(s) |
| **T3 — Statement of account** | "Send our SOA" | Generated SOA PDF |
| **T4 — Payment instructions** | "Where do we pay?" | Configured payment-instructions doc |
| **T5 — Stored document** | "Send your W-9 / COI / MSA" | The stored document verbatim |
| **T6 — FAQ** | Matches a configured FAQ | The stored answer, byte-for-byte |

It also handles **multi-intent** emails (e.g. "send our SOA *and* we paid INV-123") by composing one reply with sections in a fixed order: greeting → acknowledgements → assets → FAQ → signature.

## Safety & guardrails (a strong slide on its own)
This is where most of the engineering rigor sits, and it's worth emphasizing:

- **Fraud protection (T4)** — bank/account/routing details only ever appear in the *attachment*, never the email body. Any "confirm your bank details" or "here are our new bank details" request always abstains to a human.
- **Grounding** — never sends a reference to a missing/corrupt/expired asset; abstains instead.
- **Fail-open** — if the ML classifier errors or times out, the email simply proceeds to the human queue as if AI never existed. No customer-facing error, no bounce.
- **Idempotency** — replays/retries never double-send; one decision row per conversation.
- **Blast-radius control (GMS Full Sync)** — when historical mailboxes are bulk-synced, old sent mail is marked ineligible and historical inbound is rate-limited, so the system can't flood customers with replies to ancient threads. These are the Critical-severity cases.
- **English-only**, **20MB attachment cap**, **fires only on mapped customer contacts**, and **only when the AR mailbox is in the To field** (not just CC).

## Admin & visibility
- Settings page shows **six theme cards** (T1–T6) with one-click on/off toggles — no confirmation modals, instant activation, all changes audited.
- A **FAQ library** (flat list) for managing T6 answers, available to the classifier immediately on save.
- Editable-but-protected system templates with placeholders ({customer_name}, {invoice_list}, {faq_answer}, etc.).
- Every AI reply is tagged **"AI replied"** inside Growfin (invisible to the customer), clickable for a detail panel showing theme, template, attachments, and send time. AI-created disputes/PTPs link back to the source thread.

## By the numbers (for a closing/scope slide)
- **126 test cases** across 9 epics
- **6 Critical** (fraud + bulk-sync blast radius), **81 Major**, **35 Medium**, **4 Minor**
- **93 Functional**, **18 UX**, **11 Non-Functional** (latency, security, accessibility, tenant isolation), **4 Integration**
- Performance targets: decision < documented target, **send < 30s**, end-to-end **< 60s**

A clean three-act narrative for the deck: **(1) the problem** — AR teams drown in repetitive "send me my invoice/statement" emails; **(2) the solution** — six grounded auto-reply themes; **(3) why it's safe to ship** — conservative abstention, fraud guardrails, fail-open, and blast-radius control.

Want me to turn this into an actual PowerPoint deck?

Growfin's AI today helps AR specialists by suggesting replies, summarizing email threads, and proposing actions (PTPs, disputes) for their review. Every action still requires a human click. This PRD scopes the next step: letting AI send a defined set of routine replies directly to customers, without human intervention, while keeping everything else — judgment, negotiation, exceptions — firmly with the AR team.
The feature is opt-in per admin. AI handles six tightly-scoped reply themes that are pure retrieval-and-merge work today: remittance acknowledgments, invoice copy requests, statement of account requests, payment instructions, stored document requests, and FAQ responses. Anything outside these themes bounces back to the human. Anything inside the themes that fails a guardrail also bounces — for example, a customer asking for both a statement and a credit memo bounces in full because credit memos aren't supported.
Expected impact, measured against two production customer samples (Flock Freight, Motive):
~14–17% of real customer inbound auto-replied without human touch
~250–300 emails / month auto-replied per mid-size AR team
~10–12 hours / month / specialist freed from clerical email
Reply latency drops from 2–9 hours (human-batched) to under a minute
