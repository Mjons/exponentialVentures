# V2 Copy Changes — Implementation Plan

Source brief: [Exponential_venture_capital_V2_brief.md](Exponential_venture_capital_V2_brief.md)
Primary file: [index.html](index.html) (homepage)
Cross-page touch points: [approach/index.html](approach/index.html), [fund/index.html](fund/index.html), [legal/index.html](legal/index.html), [assets/svg/partner-schematic.svg](assets/svg/partner-schematic.svg)

---

## Scope summary

The brief lists 7 sections to update. All 7 land on the homepage. Three of them (Systematized VC ™, the 99 Kids copy, and the "OpenExO scales" framing) also exist on `approach/` and `fund/` and should be kept consistent so the messaging doesn't fork between pages.

Two items are marked **blocked** pending input from Salim (40X citation, full OSOS framework list). Those will be left as TODOs in the markup, not invented.

---

## Decisions (locked in)

1. **Date framing → "Q1 2026"** everywhere on the site. Sweep `index.html` and `fund/index.html` for "Feb 2026" / "February 2026" and replace.
2. **The 99 Kids description → use the brief's new copy** ("built around the belief that every child deserves access to stories that reflect their culture, language, and inner courage"). Drops the superhero IP detail — intentional. Apply on `index.html` and `fund/index.html`.
3. **"Who we back" section structure → Option C:** keep the 4 numbered items, drop the existing "We invest globally, across stages, in companies where four things are true." lead-in. The new OSOS line from the brief becomes the lead-in; the 4 items unpack what "willing to build using the OSOS" means in practice.
4. **GOVERN / ASSURE formatting** → standardize on `GOVERN / ASSURE` (with spaces and slash) site-wide. Treat the brief's "GOVERNASSURE" as a typo.
5. **Section 4 (James paragraph) scope** → apply to both `index.html` Section D and `approach/index.html` Systematized VC section for consistency.

## Still blocked on Salim (mark as TODO in markup, do not invent)

- **"40X" stat** — ship the stat in the copy, add `<!-- TODO: source for 40X claim — pending Salim -->` next to it.
- **Full OSOS framework list** — apply Section 2 copy as written in the brief, add `<!-- TODO: confirm full OSOS component list with Salim -->` at end of section.

---

## Edits

### 1. Homepage hero — add paragraph after the lead

**File:** [index.html:142-170](index.html#L142-L170)
**Change:** Insert a new paragraph block after the existing `<p class="lead">` (line 150-155), before `<div class="hero__ctas">` (line 156). The block opens with a bolded one-line callout ("Not failing is not the same as succeeding.") and includes the Dan Sullivan paraphrase.
**Markup approach:** Wrap in a new `<div class="hero__creed">` (or reuse a generic `<p class="lead lead--sub">`) so it can be styled distinctly without competing with the existing lead. Confirm CSS class naming with the existing style file.
**Risk:** This adds significant vertical space to the hero. Verify the hero still feels balanced on mobile after the addition.

### 2. Section B — "From Exponential Organizations to ExO 3.0"

**File:** [index.html:240-296](index.html#L240-L296) (the two `<p>` blocks at lines 248-266)
**Change:** Replace both paragraphs with the brief's expanded copy. The new version:

- Adds the "40X" stat into paragraph 1
- Adds the framing about "sharing our latest learning and ideas before they become public (the way the Frontier AI Labs use the latest models internally before releasing them more broadly)" to paragraph 2
  **Add:** `<!-- TODO: source for 40X claim — pending Salim -->` next to the stat.
  **Add:** `<!-- TODO: confirm full OSOS component list with Salim -->` at end of section.
  **Leave alone:** the figure/diagram and the cta-row.

### 3. Section C — "What we back" → "Who we back"

**File:** [index.html:299-375](index.html#L299-L375)
**Changes:**

- Eyebrow (line 303): `What we back` → `Who we back`
- H2 (lines 304-306): replace "Founders rebuilding the company around the Intelligence Stack." with `Who we back:` (or keep as H2 and put new copy below — confirm visual treatment)
- Intro paragraph (lines 307-310): replace with: _"Founders and companies with an MTP and a focus on creating and delivering positive impact willing to build using the OSOS (Organizational Singularity Operating System)."_
  **Open question:** the brief replaces the heading with the single line "Who we back:" but leaves the existing four numbered `<ol class="edlist">` items below ambiguous. **Recommendation: keep the 4 numbered items** — they expand on what "willing to build using the OSOS" means in practice. Confirm with reviewer.

### 4. Section D — "Systematized Venture Capital" + add James paragraph

**Files:**

- [index.html:378-418](index.html#L378-L418) — main change
- [approach/index.html:121-153](approach/index.html#L121-L153) — apply ™ + (optionally) the James paragraph
- [index.html:12](index.html#L12), [approach/index.html:9](approach/index.html#L9), [approach/index.html:18](approach/index.html#L18) — meta descriptions reference "Systematized Venture Capital" without ™; leave meta text as-is (™ in `<meta>` content reads oddly in search snippets) unless reviewer says otherwise
- [assets/svg/partner-schematic.svg:2](assets/svg/partner-schematic.svg#L2) — the SVG `<title>` reads "Systematized Venture Capital — partner schematic"; recommend updating to include `™`
- [legal/index.html:151](legal/index.html#L151) — already has `<sup>&trade;</sup>`. No change needed.

**Markup for ™:** use `<sup>&trade;</sup>` to match the convention already used in `legal/index.html`.

**Locations on homepage to add ™:**

- H2 at line 385 → `Systematized Venture Capital<sup>&trade;</sup>.`
- Any inline mention inside the section body (review after edit)
- Skip the page `<meta>` description (line 12) per note above

**Add second paragraph** after the existing 386-397 paragraph, with the "James' 35 years / INSEAD / Tavistock / Systems Psychodynamics" content. End the paragraph with "Systematized Venture Capital<sup>&trade;</sup>" to keep mark usage consistent.

### 5. Section E — "What you get when we invest", Point 04 Access

**File:** [index.html:459-468](index.html#L459-L468)
**Change:** Replace the current short body ("Direct working time with Salim and the senior OpenExO operators.") with the longer brief copy that adds James and the "early and preferred access to the latest and greatest ideas, tools and concepts" framing.
**Note:** The brief includes the line "We can add more/edit in the future" — that is a reviewer note, **not body copy**. Do not put it on the page.

### 6. Section F — First portfolio company

**Files:**

- [index.html:498-527](index.html#L498-L527) — primary
- [fund/index.html:370-392](fund/index.html#L370-L392) — apply the same copy revision so the two pages do not diverge
- [index.html:191-196](index.html#L191-L196) — hero trust strip mentions "Feb 2026 — First investment: The 99 Kids" (no change needed unless date framing changes per Q1 question above)
- [fund/index.html:411-415](fund/index.html#L411-L415) — same trust strip mention on fund page

**Changes on the main block:**

- H2: keep "Our first portfolio company: The 99 Kids." on homepage; update fund page H2 from "First proof point: The 99 Kids." to match (or confirm divergent headings are intentional)
- Body paragraph 1: replace with brief copy — note the company description change (see open question #2)
- Body paragraph 2: replace with brief copy — note "GOVERNASSURE" (no slash) in brief vs current "GOVERN / ASSURE". **Recommendation: keep the current "GOVERN / ASSURE" formatting** for consistency with the rest of the site; treat the brief's "GOVERNASSURE" as a typo unless told otherwise.
- Remove the placeholder line "A future case study at `/portfolio/the-99-kids` will replace this block." — the brief does not include it and it is operational scaffolding.

### 7. Section G — "The fund invests. OpenExO scales..."

**File:** [index.html:530-587](index.html#L530-L587)
**Change:** Replace the body paragraph at lines 539-547 with the brief's refined copy. Key additions:

- "or won't be a fit for our fund(s)"
- "large enterprises" added to the list
- "non-portfolio founders" replaces "the next wave of founders"
  **Leave alone:** the three `paths` cards and the cta-row below.

---

## Cross-page consistency pass (after the above)

After applying the homepage edits, do a single sweep for:

1. **Systematized Venture Capital** mentions — add `™` everywhere it appears as visible body copy, leave page `<meta>` content alone. Files: `index.html`, `approach/index.html`, SVG title in `partner-schematic.svg`.
2. **99 Kids copy** — confirm `index.html`, `fund/index.html`, and any future portfolio page tell the same story.
3. **Date language** — once #1 in open questions is resolved, sweep `index.html`, `fund/index.html` for "Feb 2026" / "February 2026" / "Q1 2026" and standardize.
4. **Search the build for "GOVERN / ASSURE" vs "GOVERNASSURE"** — keep one form.

---

## Implementation order

1. Resolve the 5 open questions with the user (a single batch — most are 1-sentence answers).
2. Homepage: apply Sections 1-7 in file order (top to bottom, single editing pass).
3. Cross-page sweep: `approach/index.html`, `fund/index.html`, SVG title.
4. Run the page locally (open `index.html` in a browser) and eyeball:
   - Hero spacing on desktop + mobile after the new paragraph
   - "Who we back" — heading style still reads right
   - Systematized VC ™ rendering
   - No broken layout in Section F after removing the placeholder line
5. Commit per logical group (one commit per section, or one commit for "homepage copy V2" + one for "cross-page consistency"). Confirm commit style with the user before committing.

---

## Out of scope (per brief)

- Navigation menu pages (Fund, Approach, Book, Team, Community, Contact) — brief explicitly says no edits were marked for these. Cross-page edits above are only the _consistency_ ones forced by homepage changes, not new feedback.
- Visual/design changes — copy only.
- Adding the 40X citation — blocked on Salim.
- Expanding the OSOS framework list — blocked on Salim.
