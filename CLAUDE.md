# CLAUDE.md — Us Moment Website

> This file gives Claude Code the full context for this project. Claude Code reads
> `CLAUDE.md` in the project root automatically at the start of every session, so keep
> it here at the top level. (You can also paste its contents into your first message.)
> When something meaningful changes, update the "What's been done" / "Open items"
> sections below so this stays the single source of truth.

## 1. What this project is
- **Client:** Us Moment — a Mumbai-based, social-first creative agency (branding, content,
  video production, Meta ads, creator collaborations, YouTube growth).
- **Co-founders:** Fardeen & Melvin (fardeen@usmoment.in / melvin@usmoment.in).
- This is the agency's **marketing website**, built as freelance work by **Anas** (the user,
  a QA engineer who also freelances web dev).
- It is a **multi-page static site** — plain HTML/CSS/JS, **no framework, no build step.**

## 2. How to run / preview
- Open the project folder in **VS Code** and use the **Live Server** extension ("Go Live").
  Edit a file, save, and **reload the browser** to see changes.
- **Needs internet:** GSAP is loaded from cdnjs. If it's blocked, the preloader and reveal
  animations may not clear (the page can look blank) — that's an environment issue, not a bug.
- **Test at phone widths (320–440px).** Most visitors are on mobile — this is a hard requirement.

## 3. Tech stack & file structure
Each page loads shared `css/base.css` + `js/base.js`, plus its own CSS/JS:

| Page            | Own JS         | Own CSS          |
|-----------------|----------------|------------------|
| `index.html`    | `js/home.js`   | (uses base.css)  |
| `about.html`    | `js/about.js`  | `css/about.css`  |
| `work.html`     | `js/work.js`   | `css/work.css`   |
| `services.html` | `js/services.js`| `css/services.css`|
| `portfolio.html`| `js/portfolio.js`| `css/portfolio.css`|
| `case.html`     | `js/case.js`   | `css/work.css` + `css/case.css` |

- **Shared data files (edit these, not the HTML):** `js/brands.js` = client logo wall
  (index `#clients` + work page), `js/work-data.js` = every case study (Work page grid,
  hero carousel and `case.html?b=<slug>`). Array order = display order; `featured:true`
  puts a case in the Work hero carousel (keep it to 5).

- **Libraries:** GSAP 3.12.5 + ScrollTrigger (cdnjs). Google Fonts: Fraunces, Inter,
  JetBrains Mono, Poppins, Black Han Sans.
- **Effects:** custom cursor, noise overlay, preloader with % counter, magnetic buttons,
  marquee strips, a horizontal "switchboard" services-tab UI, animated stats/testimonials,
  team grid, contact form.
- **Contact form** (`#contactForm`) posts to **Formspree** using a placeholder id
  `YOUR_FORM_ID` — it will NOT send email until a real Formspree id is swapped in.

## 4. Design system — MATCH THIS, don't invent styles
Tokens live in `css/base.css` `:root`. Always reuse these instead of hard-coding new values.
- **Colors:** `--ink:#131a5e` (deep blue base) · `--ink-soft:#1c256f` · `--paper:#f3f1e8`
  (off-white text) · `--paper-dim:#e6e0cd` · `--flash:#d7ff3d` (**lime accent**) ·
  `--signal:#3245f5` (bright blue) · `--gold:#ff59c4` (**pink accent**).
- **Fonts:** `--f-display:"Fraunces"` (serif — headlines) · `--f-body:"Inter"` (body) ·
  `--f-mono:"JetBrains Mono"` (labels/eyebrows).
- **Fluid type scale:** `--step--1 … --step-5` (all `clamp()`-based). Plus radius, `--gutter`,
  and easing tokens.
- **Rule of thumb:** size type with `clamp()`, lay out with flex/grid that **wraps/stacks**,
  and reference the tokens above so everything stays on-brand and responsive.

## 5. Codebase notes / gotchas
- **All HTML/CSS/JS is minified onto single lines.** Edit with precise, unique-anchor string
  replacements — do **not** reformat/prettify whole files (it creates huge, noisy diffs).
- **`js/main.js` is dead code** — not referenced by any page (index uses `home.js`). ~790 KB.
  Safe candidate to delete.
- **`js/work.js` and `js/portfolio.js` are byte-identical**; `portfolio.html` is not in the
  sitemap — it's effectively a duplicate of `work.html`.
- **Work-reel thumbnails are base64-inlined inside the JS** (they also exist as real files in
  `assets/work-reels/`). That's why `home.js`/`main.js` are so large — externalizing them is a
  real performance win for later.
- **Home-page stats numbers live in `home.js`** as this array (the count-up section above the
  testimonials) — use these REAL numbers, never placeholders:
  ```js
  stats=[
    {v:75,  suf:"M+", l:"People reached (IG & FB)"},
    {v:2e3, suf:"+",  l:"Pieces of content created"},   // 2000+
    {v:21,  suf:"K+", l:"Organic followers, one campaign"},
    {v:1400,suf:"%",  l:"Monthly IG growth, one client"}
  ]
  ```
- **`--step-5` is single-use** — only `.hero h1` references it, so it's safe to add a scoped
  `@media` override for that selector without any collateral risk elsewhere.

## 6. Home page (`index.html`) — section order
1. **Hero** (`#top`) — "We make brands unforgettable."
2. **Services / switchboard** (`#services`) — "WHAT WE do."
3. **Viral / work-speaks** — "Our work speaks louder."
4. **Client wall** (`#clients`)
5. **Campaigns** (`#campaigns`)
6. **Stats** (`#statsGrid`, JS-populated — the 4 numbers above)
7. **Testimonials**
8. **People / about brief** (`#peopleBrief`)
9. **Contact** (`#contact`) — "READY TO GO VIRAL?"

> The old **Content wall** ("Content that performs / Built for the scroll.") section was
> removed at Anas's request — markup, its `#cwTrack` render call, and all `.cw-*` /
> `.contentwall` CSS are gone. The `contentWall` data array and `cwCardHTML` template in
> `home.js` were deliberately left in place (dead but harmless — they sit inside a minified
> comma-chained declaration beside base64 blobs, so surgically removing them risks more than
> the ~1 KB it saves).

## 7. Working agreement (how Anas wants changes made)
- **Go section by section, page by page.** One area at a time; confirm before moving on.
- **Edit the site files IN PLACE — never create new/parallel copies of the site.**
  (Standalone *preview* pages are fine only when explicitly asked to compare options.)
- **Keep everything else exactly as-is** — change only what's requested.
- **Mobile-first; never break small viewports.** Verify 320–440px: content must wrap/stack,
  no horizontal overflow, longest words must fit.
- **Match the existing design system** (tokens in §4); no off-brand styles.
- **Use real content/data**, not placeholders, wherever it already exists.
- For creative/visual decisions, **give suggestions first — Anas decides.**

## 8. What's been done so far
- ✅ **Hero numbers row added** to `index.html`. The four real figures (75M+, 2000+, 21K+,
  1400%) now sit directly below the hero title/sub, styled with the site tokens (lime Fraunces
  numbers, mono uppercase labels). Responsive: **4-across on desktop, 2×2 on mobile.**
  Implemented via a scoped `<style id="heroStatsStyle">` block in `<head>` and a `.hero-stats`
  element inside the hero — namespaced so it can't collide with existing styles. Nothing else
  was changed.
- ✅ **Mobile services accordion** built for `services.html` (numbered rows with a +/expand
  affordance, matching the design system) — desktop switchboard left unchanged.
- ✅ **Mobile headline overflow fixed.** `.hero h1` used a single `--step-5` clamp
  (`4.4rem`→`8.6rem`) that was far too large below ~650–700px, forcing "unforgettable." to
  overflow and get broken mid-word ("unforgettabl / e."). Since `--step-5` is only ever
  consumed by `.hero h1` (confirmed via grep — no other selector references it), added a
  scoped `@media (max-width:800px){.hero h1{font-size:clamp(2.3rem,-0.27rem + 0.8vw,6.2rem)}}`
  override in `css/base.css`, placed directly after the base `.hero h1` rule. The replacement
  clamp was sized against the actual longest unbreakable word ("unforgettable.") measured with
  a metrically-similar serif italic font, with a ~30% combined safety margin (20% for
  Fraunces likely being wider than the proxy font, plus a 10% layout buffer) baked in at every
  width from 320–800px, so the word should never overflow or force a mid-word break again.
  Desktop (>800px) is completely untouched — original `--step-5` rule still applies there.
  **Not yet visually re-verified in a real browser** (no live-server access in this
  environment) — please confirm on a real phone / responsive devtools before considering this
  fully closed, particularly around 320–420px.
- ✅ **Headline descender clipping fixed.** Each `.hero h1 .line` is an `overflow:hidden` mask
  exactly `line-height` tall, so Fraunces' descender on the "g" in *unforgettable.* was sheared
  off at every viewport. The mask is only needed while the intro tween slides the lines up, so
  `introAnim()`'s line tween now sets `overflow:visible` on completion. Both `introAnim()` call
  paths (preloader shown / skipped via sessionStorage) reach it.
- ✅ **Campaigns rebuilt as a carousel + expanded to 10 cards.** The pinned
  `initHorizontalScroll` scrub (desktop-only, `pin:true`) is replaced by `initCampCarousel`: a
  native `overflow-x:auto` + `scroll-snap` track with prev/next arrows (`#campPrev`/`#campNext`),
  a progress rail (`#campBar`), and description + "View case" revealed on hover (`.camp-reveal`,
  hover-capable pointers only). Touch swipe and keyboard now work; the section no longer pins.
  Card count went 2 → 10, all sourced from the client deck with copy taken verbatim-ish from the
  deck's own slide text (Uber, Nykaa, Croffle Guys, Wamiqa Gabbi, Mood Banana, Edit, Terractive,
  Walters, ELRA, Siciliana). **Images are now real files in `assets/campaigns/` rather than
  base64** — this alone took `home.js` from ~396 KB to ~248 KB.
- ✅ **Staggered + clip-path reveals rolled out** beyond the Our Clients pilot. One generic
  `reveal(selector, opts)` helper at the end of `home.js` now drives `.client-card`,
  `.camp-card`, `.testi-card` and `#peopleBrief .team-card`, each with an optional `media`
  selector that wipes open via clip-path. Deliberately skipped: the switchboard (already has a
  container-level `.reveal`), the viral marquee (continuous track), the hero stats (own count-up
  animation), and the contact form.

- ✅ **Our Clients → scrolling logo wall (SoCheers-style), 42 brands.** Three bordered rows that
  scroll in alternating directions with ✦ separators, pause on hover, static under reduced motion.
  Logos are ink (#131a5e) transparent silhouettes in `assets/clients/logos/` (made from the
  client's files); on dark sections CSS flips them to paper. Brands without a usable logo file
  are set in Fraunces italic until one is supplied. Same wall replaces the pill rows on work.html.
- ✅ **Work page rebuilt.** Hero = featured carousel of 5 (autoplay 7s, thumbnails, arrows,
  keyboard), then "Selected work" = Instagram-post-style cards with filter chips; cards without a
  cover image show a branded poster (logo + big number). "Client Work — The full roster" removed.
  Campaign archive images moved out of base64 into `assets/work/archive/` (work.js 644 KB → ~10 KB).
- ✅ **Case study pages** (`case.html?b=<slug>`), Atomik-style up to "Results by platform":
  header, media band, facts row, The challenge / The solution / What happened, results boxes
  (boxes with a link open the reel), reel links, next case. Copy from the client's
  "UM Web Archive Page" doc, lightly copy-edited; Ritika and Rhythm Labs left out.

- ✅ **About page crew updated to the client's team list** (23 people, doc order). New photos from
  the client cropped to 480×480 squares in `assets/team/`; Jyoti, Mansi Pandey and Aditi keep their
  existing photos; Ananya Ahuja and Zaheen show initials until photos arrive. Removed (not on the
  new list): Mansi R, Aniket, Mariya, Joanna, Mahima, Atharva. Existing quips kept; new people have
  none. Crew grid is 2-up on phones instead of 1-up.

- ✅ **Work page v2.** Reel wall of all 78 reels from the archive doc (`js/reels-data.js`):
  3 rows (5 across on desktop, 2 on phones), "More work" (+3 rows), "View all", "Show less",
  filter chips, hover-to-play previews; each card opens its brand's case page. "Every campaign,
  in detail" removed; "How engagements work" replaced by "How a moment gets made" (4 stages).
  Web media in `assets/reels/` (540px poster + 8s muted 360px preview per reel; index in
  `assets/reels/REELS.md`). Full-quality originals in `_media/reels/<brand>/` (git-ignored).

## 9. Open items / decisions pending
- ✅ ~~Duplicate stats~~ — resolved. The standalone stats section is gone; `#statsGrid` now lives
  in the hero only (verified: `class="section stats"` no longer exists in `index.html`).
- ⏳ **Mascot ("founder-led creative element"):** Anas wants a recurring character (e.g. cat or a
  sparkle/asterisk "Spark") with different reactions to fill empty space and add personality.
  Two code-drawn geometric SVG previews were made (`preview-hero-spark.html`,
  `preview-hero-cat.html`) but were **rejected as too basic.** Takeaway: a character needs real
  illustration (SVG / PNG / Lottie) from a designer — Claude should **integrate and animate
  supplied artwork**, not draw the character itself.
- ⏳ **Other hero empty-space fill ideas (not yet built):** a scrolling client-logo strip (13
  logos in `assets/clients/`), an autoplaying muted reel card (`assets/work-reels/`), kinetic
  rotating service words, and a richer cursor-reactive background.
- ⏳ **Formspree id** is still the `YOUR_FORM_ID` placeholder — contact form won't send until
  replaced with a real id.

## 10. Suggested next step
Mobile headline is fixed — next, get it eyeballed on a real device/devtools at 320–420px to
confirm. Then decide on the duplicate stats question, and finish the hero empty-space fill,
before moving to Section 2 (Services / switchboard) and onward.
