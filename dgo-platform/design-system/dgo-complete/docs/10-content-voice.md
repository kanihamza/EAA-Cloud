# 10 · Content & Voice

> DGO writes like a federal agency speaking with operational precision. Formal,
> third-person where the institution speaks; second-person where the system
> addresses the user; never breezy, never apologetic, never cute. This document
> is the register, the vocabulary, and the per-surface copy contracts.

Cross-references: §03-typography (sentence vs title case rendering), §08-accessibility
(`aria-label` voice), §09-i18n-rtl (translation expansion).

> **Inheritance.** DGO inherits NITDA's institutional register. The NITDA Brand
> Guidelines (2020) are the upstream authority for first-reference naming, ALL-CAPS
> usage, and the agency-credit line. This document specialises that register for
> *operational* surfaces (case work, dashboards, system messages) — places where
> the brand manual didn't reach.

---

## 1 · The voice — five attributes

| Attribute | Means | Doesn't mean |
|---|---|---|
| **Authoritative** | The system speaks with the weight of the agency. Statements are declarative, not hedged. | Bossy, scolding, or jargon-heavy. |
| **Operational** | Action-oriented. Tells the user what changed, what's next, what's required. | Performative or theatrical ("Great job!"). |
| **Plain** | Short sentences. Working vocabulary. Names that match what a Nigerian civil servant would actually say. | Dumbed-down or condescending. |
| **Calm** | No exclamation points outside hero copy. Errors describe; they don't alarm. | Cold or indifferent. The system still cares; it just doesn't shout. |
| **Specific** | Concrete nouns and verbs. "Submit dossier 23-1188" not "Submit your request". | Verbose. Specificity removes adjectives, it doesn't add them. |

When in doubt, ask: *Would a senior officer in the agency say this in a briefing?*
If not, rewrite.

---

## 2 · Person & address

| Speaker | Form | Example |
|---|---|---|
| The institution speaks **about itself** | Third person — "The Agency", "NITDA", or "DGO". Not "we". | "The Agency has received your submission." |
| The institution speaks **to the user** in service-oriented contexts | Second person — "you", "your". | "You can withdraw this request until 5pm today." |
| The institution speaks **for the user** as a system action | Implicit subject + active verb. | "Submitted. Reference 24-0193 issued." |
| The institution speaks **of the user** to operators | Third person + role. | "The petitioner requested an extension on 12 March." |

First-person plural ("we") is acceptable in:
- Employee-facing internal tooling ("Our service-level target for today is …").
- Citizen-facing onboarding tutorials where warmth is appropriate.

It is **not** acceptable in:
- System messages (errors, confirmations, audit log entries).
- Letters, memos, certificates, official documents.
- Public-facing service descriptions.

---

## 3 · Casing

| Surface | Case | Example |
|---|---|---|
| **Page title** (`<h1>`) | Title Case | "Submit a Domain Registration" |
| **Section heading** (`<h2>`, `<h3>`) | Title Case | "Required Documents" |
| **Card title** | Title Case | "Pending Approvals" |
| **Modal / drawer title** | Title Case | "Confirm Withdrawal" |
| **Tab label** | Title Case | "All", "Pending Review", "Closed" |
| **Sidebar item** | Title Case | "Domain Registration" |
| **Button label** | Title Case for explicit actions; Sentence case for verbose ones | "Save Draft", "Send for review" |
| **Form label** | Sentence case | "Date of birth" |
| **Helper text** | Sentence case | "Use the format DD/MM/YYYY." |
| **Error text** | Sentence case | "This field is required." |
| **Body copy** | Sentence case | Standard paragraphs. |
| **Toast / alert body** | Sentence case | "Your changes have been saved." |
| **Badge / chip / tag** | Title Case (single word) **or** ALL CAPS (specific reserved labels) | "Pending", "Approved", "URGENT" |
| **Overline / eyebrow label** | ALL CAPS, with widest tracking | "DOMAIN STATUS" |
| **Federal Ministry credit line** | ALL CAPS, exact wording | "FEDERAL MINISTRY OF COMMUNICATIONS AND DIGITAL ECONOMY" |

### Reserved ALL CAPS usage

ALL CAPS is reserved for **three** cases:
1. The Federal Ministry credit line (exact wording above).
2. Short overline labels (`.dgo-overline`) — page-section eyebrows, data-grid
   group headers.
3. Acronyms in body copy ("NITDA", "OEM", "SERVICOM").

It is **not** for emphasis. Use `<strong>` (which binds to `--dgo-wt-600`) or a
status badge. ALL CAPS body sentences read as shouting; ALL CAPS headings read as
1990s government website.

### Title Case rules (the short version)

Capitalise: first and last word; all nouns, verbs, adjectives, adverbs, pronouns;
sub-conjunctions (After, Because, If). Lowercase: articles (a, an, the);
co-ordinating conjunctions (and, but, or, nor, for, yet, so); short prepositions
(at, by, for, in, of, on, to, up, via). "Withdraw a Pending Submission" not
"Withdraw A Pending Submission".

---

## 4 · The agency name

| Reference | Form |
|---|---|
| First reference on a public document, citizen-facing surface, or external letter | "National Information Technology Development Agency (NITDA)" |
| All subsequent references | "NITDA" |
| Internal operator surfaces (dashboard, case work) | "NITDA" throughout — operators don't need the expansion |
| When DGO speaks about itself | "DGO" (the operational platform) — never expand. The expansion is `[NITDA legal: confirm public name]` and is not currently public. |
| Credit line | "FEDERAL MINISTRY OF COMMUNICATIONS AND DIGITAL ECONOMY" — ALL CAPS, exact wording, never abbreviated. |
| The "An Initiative of NITDA" lockup | Required on all DGO public surfaces. Position: top-left or bottom-left, per the NITDA brand manual's logo placement rule. |

### What "we" means

When NITDA's brand voice does use first person (rarely, in employee-facing
materials), "we" means **the Agency**. It never means "DGO" as a brand of its
own — DGO is operational infrastructure, not an agency, and has no first-person
voice of its own.

---

## 5 · Per-surface contracts

Each shipped component family has a tight content envelope. Listed alphabetically
by family below. *"Voice"* gives a sample; *"Anti-pattern"* gives a real failure
case from review.

### Alert / Banner

- **Pattern:** `<Status>. <One-sentence consequence or instruction>.`
- **Voice:** "Submission received. The Compliance Office will contact you within
  3 working days."
- **Length:** 1–2 sentences. If you need three, it's a modal.
- **Anti-pattern:** ❌ "Oops! Something went wrong. Please try again later or
  contact us if the problem persists." → ✅ "The service is temporarily unavailable.
  Try again in 5 minutes."

### Badge / Tag (status)

- **Vocabulary** — the operational status set, used consistently across all case-
  work surfaces:
  - `Draft` · `Pending` · `Routed` · `Replied` · `Escalated` · `Archived`
  - The `dgo-color-status-*` token group maps to exactly these strings. Don't
    introduce a new status label without adding both the token and the §08
    accessibility entry.
- **Voice:** single-word label. No verbs ("Awaiting"); no punctuation.
- **Anti-pattern:** ❌ "Awaiting Compliance Review (in progress)" → ✅ "Pending".

### Button

- **Pattern:** Imperative verb + specific noun where ambiguity exists.
- **Voice:** "Submit Dossier", "Save Draft", "Withdraw Request", "Return to List".
- **Length:** 1–3 words. If the action needs explanation, the explanation goes in
  the **helper text below the form**, not on the button.
- **Confirm dialog buttons:** state the action, not "Yes" / "No". Pair: `Cancel`
  + `Withdraw Submission`, never `No` + `Yes`.
- **Anti-pattern:** ❌ "Click here to submit your dossier" → ✅ "Submit Dossier".

### Empty / Error state

- **Pattern:** `<What's missing or wrong>. <What to do next>.`
- **Voice (empty):** "No submissions yet. Submit a dossier from the Compliance
  desk to populate this view."
- **Voice (error):** "We could not load this dossier. The reference may be
  withdrawn, or your session has expired."
- **Use first-person plural sparingly here** — error states are one of the few
  surfaces where "we could not" is more honest than "the system could not".
- **Anti-pattern:** ❌ "Nothing to see here!" → ✅ "No submissions yet." A bare
  exclamation point on an empty state reads as glib.

### Form label & helper

- **Label:** Sentence case, no trailing colon (the gap and visual rhythm carry the
  separation). "Date of birth", not "Date of Birth:".
- **Helper:** One sentence, ending with period. Format example, not a rule. "Use
  DD/MM/YYYY." > "Date must be entered in day-month-year format."
- **Required-field marker:** the visual `*` is decorative; the screen reader
  reads `aria-required="true"`.
- **Anti-pattern:** ❌ "Please enter your date of birth (Note: this field is
  required)" → ✅ Label: "Date of birth". Helper: "DD/MM/YYYY."

### Modal

- **Title:** Title Case. Names the decision, not the question. "Confirm
  Withdrawal", not "Are You Sure?".
- **Body:** 1–2 sentences. Names the consequence with specificity. "This will
  remove dossier 24-0193 from the active queue. It can be restored from the
  Archive for 30 days."
- **Buttons:** action verbs. Primary = the destructive/consequential action,
  styled `--danger` if irreversible. Secondary = `Cancel`.
- **Anti-pattern:** ❌ "Are you sure you want to do this?" → ✅ "Withdraw dossier
  24-0193?" + body + `Cancel` / `Withdraw Submission`.

### Toast

- **Pattern:** `<Action confirmed>. [<Optional secondary clause>.]`
- **Voice:** "Saved.", "Dossier 24-0193 submitted. Reference issued.", "Could
  not send. The recipient address is invalid."
- **Length:** Single sentence preferred; up to two if a reference number is part
  of the operational record.
- **Action button inside toast:** rare. Used only for "Undo" within the 8-second
  window. Toasts are status, not menus.
- **Anti-pattern:** ❌ "🎉 Yay! Your submission was successful! 🎉" — pictograms
  and exclamation points have no place here. ✅ "Submitted. Reference 24-0193."

### Tooltip

- **Pattern:** Short, non-interactive supplement to a label or icon.
- **Voice:** "Filter by status", "Last updated 2 minutes ago", "Press Ctrl + K
  to open the command palette".
- **Length:** Under 80 characters. No links. No buttons.
- **Anti-pattern:** ❌ Multi-paragraph tooltip with a "Learn more" link → ✅ Inline
  helper text + a real link.

### Topbar — agency credit

The "An Initiative of NITDA" lockup. Mandatory on public-facing surfaces; optional
on internal operator surfaces (where it's redundant — the user already knows where
they work). Position: top-left, per NITDA brand manual. Exact wording: **"An
Initiative of NITDA"** with the NITDA wordmark adjacent.

---

## 6 · The error-message recipe

Errors are where institutional voice fails most often. The shipped recipe:

> **`<Plain statement of what happened>.` `<What it means for the user>.` `<What
> to do, if anything>.`**

- **Plain statement.** No engineering vocabulary. "Could not save" not "500
  Internal Server Error". No emoji. No exclamation.
- **What it means.** The consequence the user actually cares about. Did their
  work survive? Is the deadline still in effect?
- **What to do.** A specific next step. "Try again in 5 minutes" beats "Please
  try again later". If there is nothing the user can do, say so plainly — and
  point to who can.

| Worked example | Anti-pattern | Recipe-correct |
|---|---|---|
| Save fails on a partly-typed form | ❌ "Error 500. Save failed. Please try again." | ✅ "Could not save your draft. The draft is preserved in your browser. Reconnect to the network and the system will retry automatically." |
| Submit fails because dossier reference clash | ❌ "Conflict. Resource already exists." | ✅ "Dossier 24-0193 already exists. To overwrite it, withdraw the existing dossier first." |
| Permission denied | ❌ "You do not have permission to perform this action." | ✅ "Only the Compliance Office can approve this dossier. Send it to Compliance from the action menu." |

### What errors don't do

- **Don't apologise.** "Sorry" implies the system did something wrong; sometimes
  the user did. Either way "sorry" is filler.
- **Don't joke.** Errors interrupt work. The reader has cognitive load. Anything
  that isn't relevant is hostile.
- **Don't escalate to "contact support"** as the first or only option. Name the
  specific operator (Compliance Office, IT Project Clearance desk) where
  possible.

---

## 7 · The empty-state recipe

> **`<Plain statement of what's empty>. <What populates it>.`**

| Surface | Voice |
|---|---|
| Empty list of dossiers, first-time user | "No submissions yet. Start a new dossier from the Compliance desk." |
| Empty list of dossiers, post-filter | "No submissions match the filters. Clear filters to see all dossiers." |
| Empty search result | "No results for 'XYZ'. Check spelling or try a broader term." |
| Empty notification feed | "You are caught up." |

The third example demonstrates the **only** acceptable terse empty state — when
the system genuinely has nothing to add. "You are caught up" beats "No new
notifications" because it names the state from the user's perspective.

---

## 8 · Vocabulary — house style

A short glossary of operational words. Use these consistently.

| Use | Don't use | Why |
|---|---|---|
| **Dossier** | Case, request, ticket, file | Federal vocabulary; matches NITDA's casework register. |
| **Submission** | Request, application (unless the surface is *legally* an application) | Generic; works across services. |
| **Petitioner** / **applicant** | User, customer | "Customer" is private-sector. |
| **Operator** | Admin, agent, staff | Generic and accurate. |
| **Withdraw** | Cancel, delete, remove | "Withdraw" preserves the dossier in archive; "delete" implies destruction. Match the actual data outcome. |
| **Submit** | Send, transmit | The federal verb. |
| **Approve** / **decline** | Accept / reject | "Decline" softens "reject" without losing precision. Government decisions are not personal. |
| **Pending** | Awaiting, in queue, processing | Single-word status label. |
| **Reference** | Confirmation number, ticket ID | The institutional name for the unique identifier issued on submission. |

### Names that map to legal forms

Where a surface implements a legally named instrument, use the legal name:

- **`.Gov.Ng` Domain Registration** (not "domain signup")
- **IT Project Clearance** (not "IT project approval")
- **OEM Certification & Licensing** (not "vendor certification")
- **Registration of Contractors & Service Providers** (not "vendor onboarding")
- **Data Protection Compliance** (per the Nigeria Data Protection Act)
- **SERVICOM** (proper noun, never abbreviated further)

The legal name is non-negotiable on outbound (citizen-facing) surfaces. Internal
ops surfaces may use a shorter operational name if there's space pressure — but
the underlying record always carries the legal name.

---

## 9 · Numbers, dates, and references

- **Reference numbers.** `YY-NNNN`. "Dossier 24-0193". Padded to four digits.
- **Dates in prose.** "12 March 2024" (long form). In dense tables, `12/03/2024`
  is acceptable.
- **Times.** 24-hour on operator surfaces ("17:30"); 12-hour acceptable on
  citizen surfaces ("5:30pm"). Be consistent within a screen.
- **Percentages and counts.** Always render via `Intl.NumberFormat`. See §09.
- **Currency.** ₦ with `Intl.NumberFormat(..., { style: 'currency', currency:
  'NGN' })`. Never concatenate the symbol manually.
- **Phone numbers.** `+234 XXX XXX XXXX`. Spaces, not dashes.

---

## 10 · Microcopy patterns

### Confirmation pattern

Trigger button → modal → success toast. The three places that mention the same
action use **three different forms** of it:

| Place | Form | Example |
|---|---|---|
| Trigger button | Imperative verb | "Withdraw Submission" |
| Modal title | Title Case noun phrase / question | "Confirm Withdrawal" |
| Success toast | Past tense fact + reference | "Withdrawn. Dossier 24-0193 archived." |

### Field error pattern

Form input → inline error below input → focus moves to the first error on submit.

| Place | Form | Example |
|---|---|---|
| Field label | Sentence case | "Date of birth" |
| Helper (before error) | One-sentence format hint | "DD/MM/YYYY." |
| Error (replaces helper) | One-sentence problem statement | "Enter a date in DD/MM/YYYY format." |

The error replaces the helper; the helper does not stay below the error.

### Loading pattern

Action initiated → button enters loading state → on success, button returns and a
toast confirms; on failure, button returns and an inline alert appears.

| Place | Form | Example |
|---|---|---|
| Button (loading) | Verb in `-ing` form | "Submitting…" (with `aria-busy="true"`) |
| Toast (success) | Past tense fact | "Submitted." |
| Alert (failure) | Plain statement + next step | "Could not submit. Check the network and retry." |

---

## 11 · Anti-patterns

- ❌ **Emoji.** Not in the NITDA brand. Not in DGO. Not even in success toasts.
- ❌ **Exclamation points** outside marketing-tier hero copy. The institutional
  register doesn't shout.
- ❌ **"Oops".** A consumer-software tic. Federal systems don't trip and giggle
  about it.
- ❌ **"Please".** Almost always unnecessary. "Enter your password" is not rude;
  "Please enter your password" reads as performative politeness.
- ❌ **"We"** in system messages. The system is not a person. Use the action.
  "Saved" > "We saved your changes".
- ❌ **Vague calls-to-action.** "Click here", "Learn more" with no destination
  context, "Continue" as the only button label on a long form.
- ❌ **Marketing copy on operational surfaces.** "Boost your productivity with our
  AI-powered…" — not the system's voice and not the audience's reason for being
  here.
- ❌ **Cute placeholder copy.** "What's on your mind?" in a comment box →
  ✅ "Add a note for the Compliance Office."
- ❌ **Stranded acronyms.** Acronym on first reference without expansion in any
  citizen-facing surface. (Operator surfaces are exempt — operators know.)
- ❌ **Asking before doing what's reversible.** A "Are you sure you want to clear
  the search?" confirm is friction. Clear it; offer Undo in a toast.

---

## 12 · Tone calibration — examples by surface

The same news, written for three audiences:

> **Event:** Dossier 24-0193 has been routed to the Compliance Office for review.

| Audience | Voice |
|---|---|
| Petitioner (citizen) | "Your submission has been received. The Compliance Office will review dossier 24-0193 and respond within 5 working days." |
| Operator (internal dashboard) | "24-0193 routed to Compliance Office. Owner: A. Adekunle. SLA expires 19 March." |
| Audit log (system) | "2024-03-12T09:14:02Z · 24-0193 · routed · to=compliance.office · by=submission-intake · sla=2024-03-19" |

Each is *the same fact*, with **only** the information that audience needs. The
audit log is not less polite than the petitioner message — it has a different
reader, with a different need.

---

## 13 · Review checklist

Before any UI copy ships:

- [ ] First reference of the agency uses the full expanded name on public
      surfaces.
- [ ] No emoji.
- [ ] No exclamation points outside hero.
- [ ] No "Please".
- [ ] No "Sorry / Oops".
- [ ] No "we" in system messages.
- [ ] Title Case used per §3 table.
- [ ] Button labels are imperative + specific.
- [ ] Modal title states the decision, not the question.
- [ ] Error messages follow the recipe: what happened, what it means, what to do.
- [ ] Reference numbers shown in `YY-NNNN` form.
- [ ] Dates rendered via `Intl.DateTimeFormat`, not concatenated.
- [ ] Status labels are from the shipped vocabulary (Draft, Pending, Routed,
      Replied, Escalated, Archived) — no inventions.
- [ ] Operational vocabulary used (dossier, submission, withdraw, petitioner).
- [ ] Acronyms expanded on first citizen-facing reference.
- [ ] All copy translated to Yorùbá, Hausa, Igbo where the surface supports those
      languages, **including `aria-label` strings**.

---

## 14 · Open questions (for v2.2+)

- A **lint rule** that catches the most common voice failures (emoji, "Please",
  "Sorry", exclamation point outside hero) at PR time. Currently the checklist
  is human; promote when authoring tooling supports plug-ins.
- A **status-label glossary as data** — currently the six shipped labels live as
  tokens in `tokens.semantic.css`; the prose definitions are in this file.
  Promoting to a JSON exported alongside `tokens.semantic.css` would let CMS-side
  and email-template-side consumers verify against the canonical list.
- **Pidgin English (`pcm`)** authoring policy — `[NITDA editorial: confirm]`.
  Spoken widely; without a federal written convention, no entry in the table at
  §1 of §09. Reconsider for v2.2 if a surface team requests it.
- **Tone in citizen feedback** (user-generated content displayed back to other
  citizens) — the system today renders user content verbatim; do we redact?
  Moderate? Out of scope until a public-comment surface ships.
