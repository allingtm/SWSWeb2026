# Pricing Page — Conversion Review

**Page:** `/pricing`
**Reviewed:** August 2026
**Goal reviewed against:** the page's single conversion — a qualified visitor clicks **Book a diagnostic** and completes a booking. (Per the implementation spec, total enquiry volume is *expected* to fall; only diagnostic bookings count.)

**Verdict in one line:** the page itself is a strong seller — correct price anchoring, honest qualification, good objection handling — but the conversion currently dies one click *after* the CTA, and two launch-blocking defects (a dead-end booking route and a failing button contrast) plus six unresolved placeholders must be fixed before any traffic is paid for.

---

## Critical — directly suppresses the CTA, fix before sending traffic

### 1. The CTA dead-ends at a visibly unfinished page

All four CTA instances (ladder, examples, closing, mobile sticky) route to `/book-diagnostic`, which opens with an amber badge reading **"Placeholder — online booking coming soon"** and offers only a phone number.

This is the single biggest conversion leak on the build:

- The visitor performs the exact action the whole page is engineered to produce — and is immediately told it doesn't work yet. A high-intent click is converted into a phone task, which most visitors will defer and forget.
- The "placeholder" framing was correct *during the build* (the spec's rule existed to stop the CTA silently falling back to `/contact`), but shown to a real prospect it reads as "this business isn't finished", which undercuts the confidence the published prices just established.

**Recommendation, in order of preference:**
1. Ship the phase-2 booking flow (DB table + payment + notification to marc@) **before** the page gates any ad spend. Nothing else on this list matters as much.
2. If the page must go live first: rewrite `/book-diagnostic` so phone booking reads as *the* booking method, not an apology — remove the placeholder badge, lead with "Book by phone in two minutes", state what happens after the call (invoice for £950, date confirmed, half-day on site). Same route, same phase-2 plan, no wasted clicks in the meantime.

### 2. The primary button fails the spec's own contrast requirement

The spec requires **4.5:1** contrast on the primary button. The site token is `--primary: #3b82f6` with white text — **3.68:1**, in both light and dark themes, at the button's 14px text size. This fails WCAG AA and, more practically for conversion, is a measurably weaker button for the stated 40–60 age persona.

- Darkening the token to `#2563eb` gives **5.17:1** and stays in the same blue family (the Calendly modal already uses `#2563eb` as its light-mode primary).
- Note this is a **site-wide token** — changing it restyles every primary button. That is probably an improvement everywhere, but it's an owner decision, not a pricing-page patch.

### 3. Six visible `[BRACKETED]` placeholders contradict the page's core promise

The page's persuasive engine is *precision* — "we publish numbers others won't." Six amber TODO markers say the opposite. They are spec-compliant (deliberately visible, never silently filled) but they are launch blockers, and every one needs copy only the owner can supply:

| Location | Placeholder |
|---|---|
| What moves the price → AI features | `[CONFIRM WHAT IS INCLUDED AS STANDARD VS PRICED SEPARATELY]` |
| Not included → hosting | `£[X]–£[Y] a month` |
| Not included → last item | `[CONFIRM ANY OTHERS]` |
| Payment terms → last item | `[CONFIRM]` |
| Below the worked examples | `[ONCE THE TARGET SECTOR IS CHOSEN, REWRITE ALL THREE EXAMPLES…]` |
| Final FAQ answer | `[Link to the cost article once published.]` |

---

## High — weakens the pull toward the CTA, worth a decision

### 4. The "we" voice was a pronoun swap, not the rewrite the spec asked for

The owner chose "we" (a legitimate call), but the spec's warning stands: it said if "we" is retained the §4 copy should be **rewritten for the plural**, and predicted exactly which lines would weaken. The build did a minimally invasive substitution, so those lines now carry less force:

- **"What we don't do"** — flatter than "What I don't do"; the heading's bluntness was doing persuasive work.
- **"The smallest project we take on is £8,000"** — loses the solo-operator authority that makes a floor credible.
- **"…neither of us would enjoy it"** — with a plural "we", "us" is now ambiguous (us-the-firm vs. you-and-me).
- **"We'd rather tell you this plainly"** — survives, but the personal candour of the original was the point.

There's also a cross-page tension: the pricing offer (no handoffs, one accountable builder, "answers within a day") is implicitly a solo pitch, while `/about` describes a team. **Recommendation:** either do one deliberate plural-voice editing pass on these four spots, or revisit the "I" decision before launch — don't ship the mechanical swap.

### 5. The inline CTA buttons sell nothing at the moment of click

The mobile sticky bar correctly pairs the button with "Diagnostic £950 ex VAT". The three inline buttons are bare. The ladder CTA in particular sits below the full four-card grid, visually equidistant from all four cards — while everything that de-risks the click (£950, half a day, *the spec is yours whether or not we work together*) is up inside the Diagnostic card.

**Recommendation:** add one short supporting line beneath the ladder button (e.g. *"£950 ex VAT · half a day on site · the spec is yours to keep"*). The spec requires identical button **labels**, which this preserves. The closing block already has this context; the examples button could take the same line or stay bare.

### 6. The funnel goes dark one step after `cta_click`

Events exist for `pricing_page_view`, `cta_click` (with position), `faq_open`, and `scroll_depth` — but:

- `/book-diagnostic` fires **nothing**: no page view event, no event on the "Call" button. Until phase 2 ships, the only conversion signal available (a call-button tap) is invisible, so CTA click→outcome measurement is impossible right now.
- Custom events via `@vercel/analytics` `track()` require a **paid Vercel plan** — on Hobby they are silently dropped. Verify the plan before trusting any of this instrumentation.
- The spec's requirement of a verified end-to-end test booking is blocked until phase 2 exists. This is the second reason (after finding 1) not to buy traffic yet.

---

## Medium — note, monitor, or accept

### 7. Pricing is invisible in the desktop chrome
The site's navigation pattern hides all links behind the hamburger at every viewport, so no visitor ever *sees* a "Pricing" link without opening the menu. Direct/ad traffic is unaffected; organic blog readers are unlikely to discover the page. Site-wide pattern, out of scope for this build — but if organic discovery matters, a visible "Pricing" link in the header would be the single cheapest fix.

### 8. The footer offers escape hatches under a single-CTA page
The unchanged house footer (per spec) puts a Contact link, an email address, and the blog-oriented tagline directly beneath the closing CTA. A cost-anxious visitor scrolling past the button finds a lower-commitment exit two inches below it. The spec accepted this trade-off deliberately; the tagline is already flagged by the spec as worth changing site-wide. Accept for now, revisit if analytics show closing-CTA scrolls without clicks.

### 9. JSON-LD final answer diverges slightly from visible copy
The visible last FAQ answer includes the amber `[Link to the cost article…]` placeholder; the `FAQPage` schema deliberately omits it. Strictly, the spec wants schema text matching visible copy — this resolves itself when the real article link replaces the placeholder. No action now; just don't forget the schema when updating the answer.

### 10. Diagnostic card reads as entry point, not as product
"Start here" + tinted border correctly frames the diagnostic as step 1 of 4. What it slightly under-sells is that the diagnostic is also the *only thing being purchased today*. Finding 5's microcopy fix covers most of this. A stronger variant — a small "Book a diagnostic" affordance inside the card itself — would stay within the one-destination rule but departs from the spec's three-instances layout, so treat as a post-launch A/B candidate, not a change now.

---

## What's working — don't touch these

- **Price anchoring is implemented exactly right.** £12,000–£15,000 is the dominant figure; the £8,000 floor is visually subordinate; no "from £8,000" framing anywhere. The worked examples (£11,500 / £9,000 / £14,000) land inside or just under the band, which makes the band believable rather than aspirational.
- **The qualification copy does its job.** The standfirst ("you've just saved us both a phone call") filters low-budget visitors *politely and early* — cheaper than filtering them on the phone.
- **The FAQ is a well-sequenced objection ladder** — risk (fixed price), overrun, change control, ownership, continuity, offshore, why-paid — each answer implicitly re-justifying the diagnostic. All answers are in the initial HTML with valid `FAQPage` schema, serving the get-cited goal.
- **One destination, four positions** — no competing links in the body, phone deliberately demoted to a text link in the closing block only.
- **Fast by construction.** Text-only hero, no images, no new dependencies; LCP is a text node. Good for the 4G/mid-range-mobile target and for ad Quality Score.
- **The mobile sticky bar** pairs price with button, animates via transform (no layout shift), hides at the footer, and is dismissible.

---

## Pre-launch checklist (in order)

1. [ ] Resolve the six `[BRACKETED]` placeholders (owner copy required)
2. [ ] Voice decision: plural-voice editing pass on the four weakened lines, or switch to "I"
3. [ ] Fix primary button contrast (`#3b82f6` → `#2563eb` or equivalent ≥4.5:1) — site-wide token, owner sign-off
4. [ ] Build phase-2 booking flow (booking + payment + DB + notification), or interim-reword `/book-diagnostic` as a first-class phone-booking page
5. [ ] Add events on `/book-diagnostic` (page view + call-button click); confirm Vercel plan supports custom events
6. [ ] Run Google Rich Results Test on the live `FAQPage` schema — zero errors required
7. [ ] Perform one real end-to-end test booking and confirm it's trackable from `cta_click` through completion
8. [ ] Only then point paid traffic at the page

---

## Implementation status — updated after the fix plan (August 2026)

The owner's response plan ("Response to Review & Fix Plan") was implemented. State of play:

**Done (dev):**
- `/book-diagnostic` rewritten as a first-class phone-booking page: no placeholder badge, "How to book" rationale, four "What happens next" steps, and a callback-request form (name / company / phone / best time) as the second completion path. Submissions insert into `sws2026_diagnostic_callbacks` (RLS enabled, service-role writes) and email marc@solvewithsoftware.com via Resend.
- Events added: `diagnostic_page_view`, `diagnostic_call_click`, `diagnostic_callback_request` — the funnel is measurable from `cta_click` through to a call tap or callback request.
- Contrast fixed both themes: light `--primary` → `#2563eb` (5.17:1 with white); dark keeps `#3b82f6` with a near-black label (5.4:1) because `#2563eb` on the dark background would have broken `text-primary` links (3.8:1) — a nuance the plan's site-wide swap missed.
- Voice pass applied ("we" retained): "Work we turn down", "We don't quote below £8,000.", "…it wouldn't be work you'd enjoy paying for.", "That's the honest answer, and it's worth asking of anyone you're considering."
- AI-features driver filled with the plan's copy; sector note and cost-article bracket removed (JSON-LD now matches visible copy exactly).
- Ladder CTA microcopy added (*£950 ex VAT · half a day on site · the spec is yours to keep*); ICP line added to "Work we turn down"; visible Pricing link added to the header (sm+).

---

## Strategy change — qualification is no longer priority one (August 2026)

**The owner has confirmed expected enquiry volume is low, and that filtering enquiries by hand is acceptable.** This supersedes the spec's §1 priority order, which put *qualify* above *convert* and treated falling enquiry volume as a success metric.

That premise only holds when bad enquiries are crowding out good ones. At low volume the arithmetic inverts: every deterred enquiry is a real cost, and a two-minute phone call qualifies far better than any web page can — particularly now that a callback form feeds it. **The page's job is now conversion first.**

Consequences already applied:
- The £8,000 floor is removed entirely (owner's call — small projects can grow into larger ones). "Work we turn down" now leads with a *fit* test ("Custom software when a product already does the job") rather than a price test.
- The standfirst's disqualifying line ("you've just saved us both a phone call") is replaced with "Real numbers, not an opening position — so you can decide in two minutes whether this is worth a conversation." That answers the qualified reader's real doubt instead of screening the unqualified one, and it stopped the page's only supplier-convenience-first sentence from sitting in its most-read paragraph.
- Budget qualification now rests entirely on published numbers — the £12,000–£15,000 anchor and the £15,000–£30,000 market-context line — rather than on any sentence telling people to leave.

**What this re-ranks:** the largest remaining risk is no longer under-filtering, it is the booking flow. `/book-diagnostic` still completes only by phone (business hours) or callback request. At low volume that is the single highest-leverage thing left to fix, which promotes **C1 (booking + payment flow)** from post-launch to the top of the queue.

**What to watch instead of enquiry volume:** diagnostic bookings per 100 pricing-page views. If that is healthy, ignore raw enquiry counts entirely — sorting a few unqualified callers by hand is cheap and the owner has said as much.

---

## Ladder restructure — three buckets, not four (August 2026)

The four-item ladder (Diagnostic / Phase one / Phase two / Care plan) contradicted its own intro, which promised N six-week phases while the cards enumerated exactly two. Some projects may run to ten phases. Now:

1. **Diagnostic** — £950, the paid entry point, visually distinguished as "Start here".
2. **Build phases** — £12,000–£15,000 for phase one; later phases priced when reached, once the previous has shown what's needed. Repeating unit, decision gate at each boundary.
3. **Care plan** — now **18% of build cost per year**, replacing the previous £300–£800/month.

Side effects: three cards get ~320px each instead of ~220px, which fixed prices wrapping mid-range; the section intro no longer mandates a rigid six weeks ("about six weeks", later phases "follow the same pattern"); and the invented £10,000–£30,000 later-phase range is gone, since quoting unscoped phases contradicted the page's own "a number given before the process is understood is a guess."

Also in this pass: a real Aceternity component (`glowing-effect`) on the Diagnostic card, repointed from `motion` to the installed `framer-motion` and given a brand-token gradient in place of its default rainbow — zero new dependencies; the six-weeks/AI FAQ explaining where the speed and price come from; and the market-context line under the ladder.

**Care-plan pricing note:** 18% sits inside the conventional 15–20% band. On a £12,000–£15,000 phase one it works out at roughly **£180–£225/month** — below the old £300–£800 range — but it compounds correctly as phases accumulate (£30,000 of build ≈ £450/month). Check the floor still covers hosting and support for a single-phase client who never returns.

---

## Content and design pass (August 2026, later)

- **"Work we turn down"** — the "Custom software when a product already does the job" item was removed. It was written by Claude when the £8,000 floor came out, and stated a policy the owner does not hold: off-the-shelf is frequently *not* fit for purpose versus bespoke, so the item was conceding ground on the page selling the alternative. Two genuine items remain (tenders; quotes without a diagnostic) plus the 20–150 staff line, which survives because it is scoped *by business size* rather than general.
- **"What moves the price"** — trimmed from six items to four. "Mobile" and "AI features" both literally said "is included", so they were scope boundaries, not cost drivers; both moved into "What's included", split across the two columns. Remaining drivers: roles, integrations, data migration, decision speed.
- **Hero** — split into a 12-column layout (H1 left at 5 cols, standfirst right at 7) after centred prose read as a text wall; ragged edges on both sides left the eye no fixed left margin. Container widened to match the ladder so the H1 aligns with the first card. Subtle masked dot texture added from Aceternity's `background-dots-masked` (zero dependencies), dialled well below source alpha. **Note this deviates from spec §4.1's "no background graphic".**
- **Diagnostic card** — duration line now names *who attends* ("Half a day on site with you and whoever runs the process"), matching `/book-diagnostic`. Duration kept deliberately: "half a day" is reassuringly small for a £950 commitment, where a vague "site visit" invites pessimistic assumptions.
- **Shared design language** — dashed rules, extracted from Aceternity's `cta-with-dashed-grid-lines` and retinted to `--border`, now run through the closing CTA frame, the price-drivers table, both included/not-included panels and payment terms. The block itself was *not* installed: its content is a testimonial panel and a second button, both forbidden by spec §11, and it would have pulled in two icon libraries and replaced the tracked `PricingCta`.

**Copy decisions taken deliberately (do not "fix" these):**
- "£10,000" in the price-drivers intro stays a number rather than "substantially" — vagueness is precisely what the standfirst accuses competitors of. *But* £10,000 of variance sits oddly beside a £3,000 phase-one band; reconcile which is right.
- "Half a day" stays specific for the same reason.

---

## Still open (owner)

- **Placeholders:** hosting `£[X]–£[Y]`; `[CONFIRM ANY OTHERS]`; payment-terms `[CONFIRM]`; phone hours `[Mon–Fri, 9am–5:30pm]` on `/book-diagnostic`.
- **C1 — booking + payment flow.** Now the top priority, not post-launch (see strategy change above).
- Confirm the Vercel plan supports custom `track()` events.
- Rich Results Test on the deployed page; one real end-to-end test booking.
- Decide whether the standfirst keeps "The real reason is…" (mind-reads competitors) or softens to "The other reason is that a number nobody can check can be whatever they think you'll pay."
- Confirm the £15,000–£30,000 market figure is one you'll defend in a meeting, and note the worked examples (£9,000, £11,500) now sit below your own stated phase-one range.
- Sanity-check the FAQ claim that "a large part" of build work is AI-assisted.
- Post-launch: footer tagline (C2), examples rewrite once the wedge is chosen (C4).

> **Note:** `pricing-page-implementation-prompt.md` is now materially out of date — its §1 priority order, §4.2 four-item ladder, §4.6 £8,000 floor and §4.1 standfirst have all been superseded. Treat this document as current.
