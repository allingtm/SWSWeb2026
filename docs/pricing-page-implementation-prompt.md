# Implementation Prompt — Pricing Page

**Site:** solvewithsoftware.com
**Route:** `/pricing`
**Type:** new page

> **Before you start:** everything in `[SQUARE BRACKETS]` is a value the site owner must confirm. Do not invent replacements — if a bracketed value is still present when you build, leave it visible as a placeholder so it's obvious what needs filling in.

---

## 1. Objective

This page has three jobs, in priority order:

1. **Qualify.** Visitors whose budget is nowhere near these numbers should leave without contacting us. That is a success, not a failure.
2. **Convert.** Qualified visitors should book a paid diagnostic. That is the only conversion on this page.
3. **Get cited.** The page should be extractable by AI assistants and search engines answering "how much does custom software cost".

**The primary reader** is an owner or director of a 20–150 person business, aged 40–60, non-technical, on a laptop, comparing two or three suppliers. They are cost-anxious and time-poor. They will scan, not read.

**Success metric:** diagnostic bookings. Total enquiry volume is expected to *fall*. That is intended.

---

## 2. Non-negotiables

- **One call to action on the entire page:** book a diagnostic. No newsletter signup, no PDF download, no live chat, no "contact us" form, no secondary offers.
- **Every price is exclusive of VAT** and this is stated wherever a price appears in a group.
- **All FAQ answer text must be present in the initial HTML.** Do not lazy-load, fetch client-side, or render answers only on expand. Collapsed is fine; absent from the DOM is not.
- **The page must be fully usable with JavaScript disabled.** The accordion may be enhanced by JS but must default to readable.
- **No pricing calculator, no configurator, no "get a quote" wizard.** The diagnostic is the mechanism for getting a real number.

---

## 3. Technical placement

- Inspect the existing codebase and **match its conventions exactly** — routing, component structure, styling approach, content sourcing (CMS vs local), and file naming. Do not introduce a new styling paradigm or component library for this one page.
- The About page describes the stack as Next.js / React / .NET; verify what the site itself actually uses before assuming.
- Reuse existing header, footer, button, card and typography components. If a suitable component does not exist, build it in the established house style rather than importing a new dependency.
- Add **Pricing** to the primary navigation.
- The page must be statically rendered or server-rendered — not client-only.

---

## 3a. Observed house patterns — match these

Taken from `/about` and `/contact`. Where this section and the generic UX guidance in §5 disagree, **this section wins.**

### Already established on the site, and should be reused

- **Header:** logo linked to homepage, search, main menu toggle. Keep it — the pricing page is a normal site page, not a stripped landing page. (The *diagnostic* page is the stripped one; this is not that page.)
- **Footer:** four columns — Categories / Company / Legal / Contact — plus logo, tagline, social links and copyright. Unchanged.
- **Four-card rows** are an established pattern (`/about` uses them twice: "Our Services" and "Why Choose Us"). **Use the existing card component for the four-item ladder** — it will sit naturally in the house style. Use it again for the three worked examples.
- **Page-ending CTA block** is an established pattern. `/about` closes with the heading "Ready to Start Your Project?" and two buttons: "Contact Us" and "Call 01206-848428". Match the *structure* of that block, with the modification below.
- **Section headings** are short, plain, sentence-level: "Who We Are", "Our Services", "Why Choose Us". The headings in §4 are written in the same register — keep them.

### Two deliberate departures

**1. The closing CTA is a single primary button, not two.**
Match the house CTA block's layout and heading treatment, but the only button is **Book a diagnostic**. Render the phone number as a **text link beneath the button** (`Or call 01206-848428`), not as a second button of equal weight. This preserves the familiar block while keeping one primary action.

**2. The CTA must NOT link to `/contact`.**
`/contact` is currently a generic Name / Email / Company / Message form with a "Send Message" button. Wiring the pricing CTA there defeats the entire purpose of the page. The CTA goes to the **diagnostic booking and payment flow**. If that flow does not exist yet, the button must link to a clearly-marked placeholder route — do not silently fall back to the contact form.

### Voice — decision required before writing

The rest of the site is written in the first person **plural**: "Who We Are", "Our Services", "Why Choose Us", "our expertise". The copy in §4 is written in the first person **singular** — "the smallest project I take on", "What I don't do".

This is intentional and needs an explicit decision from the site owner:

- **Recommended: move to "I".** The offer being sold is one experienced developer with no handoffs and no account managers. "We" from a solo operator reads as a small firm pretending to be a larger one, which undermines the exact thing that makes the offer credible. If "I" is chosen, `/about` and the service pages should follow over time.
- **If "we" is retained**, rewrite the §4 copy consistently — but note that "What we don't do" is a markedly weaker sentence than "What I don't do", and the personal register is doing real persuasive work here.

**Do not mix the two on one page.**

### Separately — flag to the site owner, out of scope for this build

The footer tagline currently reads *"Expert insights on software development, AI, automation, and digital transformation. Practical advice for businesses navigating technology decisions."* That describes a blog, not a software consultancy, and it sits on every page including this one. Worth changing, but not as part of this task.

---

## 4. Page content

Use this copy as written. It has been calibrated; do not paraphrase, "improve" or expand it.

### 4.1 Hero

**H1:** What it costs

**Standfirst:**
> Most development companies won't publish prices. The reason given is that every project is different. The real reason is that the number depends on what they think you'll pay.
>
> Here's what things cost. If your budget is a long way from these figures, you've just saved us both a phone call.

No hero image. No background graphic. Text only, generous whitespace.

### 4.2 The ladder

Section heading: **How the work is structured**

Intro line:
> Everything starts with a paid diagnostic, and every build is delivered in six-week phases. You decide whether to continue at the end of each one.

Four items:

| | Name | Price | Duration | Description |
|---|---|---|---|---|
| 1 | **Diagnostic** | £[950] | Half a day on site, documents within 5 working days | Your process mapped, a written specification, and a fixed price to build it. Yours to keep whether or not we work together. |
| 2 | **Phase one build** | **Most projects £12,000–£15,000** <br><small>The smallest project I take on is £8,000</small> | 4–6 weeks | One process, working, in your hands. Not a prototype — the real thing, in use. |
| 3 | **Phase two** | £10,000–£30,000 | 6–10 weeks | The next process, or more depth on the first. Priced once phase one has told us what's actually needed. |
| 4 | **Care plan** | £300–£800 per month | Ongoing | Support, hosting, small changes and priority access. Sold as part of phase one. |

Below the group: *All prices exclude VAT.*

**Critical formatting requirement:** in item 2, "£12,000–£15,000" is the visually dominant figure and "the smallest project I take on is £8,000" is subordinate — smaller, lighter, secondary. Readers anchor to the most prominent number on a page and it must not be £8,000. Do not restyle this as a "£8,000–£15,000" range.

### 4.3 What moves the price

Section heading: **What moves the price**

Intro: *Two projects that sound identical can differ by £10,000. These are the things that actually drive it.*

- **Number of users and roles.** Two roles is straightforward. Eight roles with different permissions adds £2,000–£4,000.
- **Integrations.** Every system yours has to talk to adds £1,000–£3,000, depending on how well it's documented.
- **Data migration.** Clean data is a day. Fifteen years of a spreadsheet nobody maintained is a week.
- **Mobile.** Works properly on a phone is included. A native app in the app stores is a separate build.
- **AI features.** [CONFIRM WHAT IS INCLUDED AS STANDARD VS PRICED SEPARATELY]
- **How quickly you can make decisions.** The cheapest projects have one decision-maker who answers within a day. This is not a joke — it is routinely worth more than any other factor on this list.

### 4.4 Included / not included

Section heading: **What's included**

Two columns, equal weight. Stack vertically on mobile with the "included" column first.

**Included in every build:**
- Discovery and specification
- Build, testing and deployment
- Data migration from your existing systems
- 30 days of fixes after launch
- Full source code and ownership — the system is yours
- Handover documentation

**Not included:**
- Third-party licences and hosting — typically £[X]–£[Y] a month
- Changes outside the agreed scope
- Ongoing support beyond the first 30 days — that's the care plan
- [CONFIRM ANY OTHERS]

Use a check mark and a neutral mark (not a red cross — "not included" is information, not a warning).

### 4.5 Three worked examples

Section heading: **Three examples**

Intro: *Composite examples based on typical projects. Names and details changed.*

> **A 30-person business replacing a job-tracking spreadsheet.**
> Four user roles, one integration with their accounts package, six years of messy historical data. Office staff could see job status without ringing the site.
> **£11,500 — five weeks.**

> **A wholesaler whose delivery notes were re-keyed into invoices by hand.**
> Two roles, one integration, clean data. Removed roughly nine hours a week of double entry and cut invoicing errors to near zero.
> **£9,000 — four weeks.**

> **A 60-person operation replacing three disconnected spreadsheets and a shared inbox.**
> Six roles, two integrations, significant migration. Delivered as two phases so they had the first part working while the second was built.
> **£14,000 for phase one, £12,000 for phase two.**

> **[ONCE THE TARGET SECTOR IS CHOSEN, REWRITE ALL THREE EXAMPLES TO THAT SECTOR.]**

### 4.6 What I don't do

Section heading: **What I don't do**

> **Projects under £8,000.** Below that, the cost of scoping and running the work outweighs what I could charge for it, and neither of us would enjoy it. If your project is genuinely smaller than that, I'll tell you and point you at someone better suited.
>
> **Competitive tenders against four other suppliers.** I'd rather spend that time on clients I'm already working with.
>
> **Quotes without a diagnostic.** A number given before the process is understood is a guess, and guesses become disputes.

### 4.7 Payment terms

Section heading: **Payment terms**

- Diagnostic payable in advance
- Builds: 40% on signature, 40% at first working version, 20% on handover
- Care plans monthly by direct debit, 30 days' notice to cancel
- All figures exclude VAT
- [CONFIRM]

### 4.8 FAQ

Section heading: **Questions**

Accordion. First item may be expanded by default; the rest collapsed. All answer text in the initial HTML.

**Why fixed price rather than a day rate?**
> Because a day rate makes my overrun your problem. A fixed price means the risk of it taking longer than expected sits with me, which is where it belongs. It also means you can get the decision approved without a range on it.

**What if it takes you longer than you thought?**
> You pay the agreed price. That's what fixed means.

**What if I want changes partway through?**
> Small things get absorbed. Anything that meaningfully changes the scope is quoted separately, or held for phase two — and out-of-scope work is charged at £850 a day so you always know what a change costs before you ask for it.

**Do I own the code?**
> Yes. Full source code and ownership transfer to you on final payment. No licence, no lock-in, no charge for leaving.

**What happens if you're unavailable in two years?**
> You have the source code and the documentation, and the system is built on mainstream technology any competent developer can pick up. I'd rather tell you this plainly than pretend the risk doesn't exist.

**Isn't it cheaper to use an offshore developer?**
> Cheaper per day, yes. Whether it's cheaper per outcome depends on how much specification and management you're able to do yourself. If you have someone technical who can direct the work, offshore can work well. If you don't, the cost usually reappears as rework.

**Why is there a charge for the diagnostic?**
> Because it's real work and it produces something you keep — a specification and a fixed quote you can take to any developer. Free quotes are priced into somebody's rate somewhere.

**How much does custom software cost in general?**
> Most single-process systems for UK SMEs land between £8,000 and £20,000. Departmental systems run £20,000–£60,000. [Link to the cost article once published.]

### 4.9 Closing CTA

Use the house CTA-block structure from `/about` ("Ready to Start Your Project?" + buttons), with the single-button modification from §3a.

**Heading:** Find out what yours would cost

> A half-day on site. You leave with your process mapped, a written specification, and a fixed price. £[950], and the spec is yours whether or not you work with me.

**Button:** Book a diagnostic
**Beneath it, as a text link:** Or call 01206-848428

The button links to the diagnostic booking flow — **never to `/contact`**.

---

## 5. UX / UI specification

### Layout

- Single column. Content max-width **680–760px** for prose sections; the ladder may extend to **960px** on desktop.
- Centred, generous vertical rhythm. This page should feel calm and uncrowded — visual density reads as sales pressure.
- Clear section separation using whitespace and, where needed, a hairline rule. No alternating background colours for every section; at most one or two tinted bands to break up the page.

### The ladder — the most important component

- **Desktop:** four cards in a row, or a single well-spaced table. Prices right-aligned or prominently placed; equal card heights.
- **Mobile (below 768px):** stack as full-width cards. **Do not use a horizontally scrolling table.**
- Visually distinguish the **Diagnostic** card as the entry point — a subtle border, tint, or "Start here" label. It should read as the recommended first step, not the cheapest option.
- Within the phase one card, enforce the typographic hierarchy from §4.2: dominant £12,000–£15,000, subordinate £8,000 floor.

### Calls to action

Three instances of the same primary button, identical label and styling:

1. Directly beneath the ladder
2. After the worked examples
3. In the closing section

Plus, on mobile only, a **sticky bottom bar** appearing after the user scrolls past the ladder — button plus the price. Must be dismissible and must not obscure content or overlap the footer.

All four use the site's existing primary button component. The phone number appears once, as a text link in the closing block only — not as a button, and not repeated at each CTA.

No secondary CTAs anywhere. No competing links in the body copy except the single link to the cost article in the final FAQ answer.

### Typography and colour

- **Extract the type scale, palette, spacing scale, border radii, shadow and button styles directly from the existing stylesheets or design tokens** — do not approximate them by eye from a screenshot, and do not introduce new fonts or brand colours.
- Build the ladder and worked-example cards from the **existing card component** used on `/about`, restyled only as far as the content requires.
- Before submitting, put `/pricing` side by side with `/about` at the same viewport width. Section rhythm, card treatment, heading sizes and button styling should be indistinguishable in character. If the new page looks like it came from a different site, it is not finished.
- Prices use tabular/lining numerals if the typeface supports it.
- Body copy minimum 17–18px on desktop, comfortable line height (1.6+), max ~75 characters per line.
- Ensure the primary button colour meets **4.5:1** contrast against its background.

### Included / not included

Two columns on desktop, stacked on mobile with "included" first. Icons should be decorative only and marked `aria-hidden`, with the meaning carried by the column heading.

### Worked examples

Three cards or bordered blocks. The **price and duration line is visually emphasised** — bold, larger, or set apart — because it's what gets scanned.

### FAQ accordion

- Native `<details>`/`<summary>` is preferred, styled to match the site. If a JS accordion is used, it must degrade to open-by-default without JS.
- Full-width clickable headers, minimum 44px touch target, visible chevron with rotation on open.
- Correct ARIA: `aria-expanded`, `aria-controls`, and a heading element wrapping each question.

### Print stylesheet

B2B buyers print pricing pages to show colleagues. Add a small print stylesheet: hide nav, footer, sticky bar and buttons; expand all FAQ answers; ensure prices and the ladder print legibly in black and white; include the site URL and phone number in a print-only footer.

---

## 6. Accessibility

- Semantic heading hierarchy: one `<h1>`, sections as `<h2>`, sub-items as `<h3>`. No level skipping.
- All interactive elements keyboard reachable with a visible focus indicator.
- If the ladder is a `<table>`, use proper `<th>` with `scope`.
- Colour is never the sole carrier of meaning.
- Target WCAG 2.1 AA.
- Test the whole page at 200% zoom without horizontal scrolling.

---

## 7. SEO and structured data

**Meta title:** `Pricing — Custom Software Development | Solve With Software`
**Meta description:** `What custom software actually costs. Diagnostic £[950], phase one builds typically £12,000–£15,000, delivered in six weeks. Published prices, fixed quotes, no tenders.`

- Canonical URL set to `/pricing`
- Open Graph and Twitter card tags matching site convention
- Add `/pricing` to the sitemap
- Visible "Prices reviewed [MONTH YEAR]" line near the foot of the page — this drives citation freshness and must be easy to update

**Required:** `FAQPage` JSON-LD containing **every** question and answer from §4.8, with answer text matching the visible copy. Do not include questions that aren't on the page.

**Optional, only if it validates cleanly:** `Service` / `Offer` schema for the ladder items. If it produces warnings in Google's Rich Results Test, omit it — a clean FAQPage is worth more than a messy combination.

---

## 8. Analytics and conversion tracking

Fire events on:

- `pricing_page_view`
- `cta_click` — with a parameter identifying which of the four instances (`ladder`, `examples`, `closing`, `sticky`)
- `faq_open` — with the question text
- `scroll_depth` at 25 / 50 / 75 / 100%

The CTA must be trackable end-to-end through to a completed diagnostic booking. **Verify with a real test booking before this page goes live** — this page gates paid advertising and untested tracking makes the spend unmeasurable.

---

## 9. Performance

- No new heavy dependencies. Accordion in CSS or minimal vanilla JS.
- No images unless a component genuinely requires one; no hero image.
- Target LCP under 2.0s on a mid-range mobile device on 4G.
- No layout shift from the sticky bar — reserve its space or animate it in without reflow.

---

## 10. Acceptance criteria

- [ ] `/pricing` renders and is linked from the primary navigation
- [ ] Header and footer identical to `/about` and `/contact`
- [ ] Ladder and worked examples built from the existing card component
- [ ] Side-by-side with `/about` at the same viewport, the two pages look like the same site
- [ ] Voice decision made and applied consistently — no mixing of "I" and "we"
- [ ] **CTA links to the diagnostic booking flow, not to `/contact`**
- [ ] All copy in §4 present and unaltered
- [ ] Phase one card shows £12,000–£15,000 as dominant, £8,000 as subordinate
- [ ] "Excludes VAT" appears wherever prices are grouped
- [ ] Exactly one CTA destination on the page, in four positions (three inline plus mobile sticky)
- [ ] No newsletter signup, download, chat widget or contact form anywhere on the page
- [ ] Ladder stacks as cards on mobile — no horizontal scroll
- [ ] All FAQ answer text present in initial HTML (verify with JS disabled)
- [ ] Page fully readable and navigable with JS disabled
- [ ] `FAQPage` JSON-LD validates in Google's Rich Results Test with zero errors
- [ ] Keyboard navigable end to end with visible focus states
- [ ] Passes automated accessibility checks at WCAG 2.1 AA
- [ ] 200% zoom produces no horizontal scrolling
- [ ] Print stylesheet produces a legible one- or two-page document
- [ ] Analytics events fire and a test booking is recorded end to end
- [ ] Any remaining `[BRACKETED]` placeholders are visibly obvious, not silently filled

---

## 11. Do not

- **Do not wire the CTA to `/contact` or to any generic enquiry form** — this is the single most likely mistake in this build
- Do not add a pricing calculator, slider, configurator or quote wizard
- Do not add testimonials, logos or trust badges to this page — they belong elsewhere and dilute the single CTA
- Do not soften the "What I don't do" section; its bluntness is the point
- Do not convert the price band into "from £8,000"
- Do not add a comparison table against competitors
- Do not add urgency devices — countdowns, "limited availability", "prices rising soon"
- Do not introduce a new component library, CSS framework or font
- Do not invent values for bracketed placeholders
