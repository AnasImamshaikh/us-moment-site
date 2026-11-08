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
2. **Client wall / logo band** (`#clients`)
3. **Viral / work-speaks** — "Our work speaks louder."
4. **What we do** (`#services`), moved below Viral (Nov 2026); aligned to the page gutter
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

- ✅ **Work page v3 (client feedback, Nov 2026).** Hero = compact "Pinned work" coverflow of the 5
  featured cases (styled after the Kaif site reference: centre card + stacked side cards, arrows, dots,
  pause, swipe; front card plays its preview). Headline "Work that stops the scroll." is a placeholder;
  the client will send the line. Reel wall replaced by **one IG-style card per brand**: the Top 18
  (`WORK_TOP` in work-data.js) lead, then the other cases; no numbers on cards; bigger logo/name.
  Seven Top 18 brands without content (Netflix, Uber, Prime, MUBI, So+, Bhuvan Bam, Wamiqa) show as
  non-clickable "Case study coming soon" cards (`WORK_SOON`). "How a moment gets made" and "Two ways
  to run it" removed (move to Services later). **Case page** = header, then details left / work right
  (sticky), smaller type, max 3 reels per brand. **Update:** the separate headline-number box is
  removed — every number lives in Results (a headline number missing from Results is folded in; near-
  duplicates like 7.9K/7,903 are treated as the same). On desktop the reels column is lifted into the
  dark header beside the headline (`--cs-lift`, sized from the header height in case.js). The reels are
  an **overlapping stack** (Kaif-site style): middle reel 1.5× and in front on load; hovering (tap on
  phones) another reel smoothly grows it to 1.5× and plays it; leaving the stack returns to the middle.
  Fixed-ratio stage so scaling never spills; no arrows/scroller. The middle reel **autoplays on load**;
  the hovered reel autoplays; no play buttons. Max 3
  reels per brand (`CASE_REELS`, first = card cover). **All reel posters regenerated** from the
  originals (best sharp, well-lit frame; landscape sources fitted on a blurred 9:16 backdrop).

- ✅ **Work page v4 (Nov 2026).** Pinned work is now a **full-screen cinematic hero** like
  socheers.in/work: the active featured case's 8s widescreen clip fills the screen
  (`assets/work/hero/<slug>.mp4` + `.jpg`, 1280×720 crops cut from the 720×1280 originals in
  `_media/`), dark gradient, story + "View case" bottom-left, "More pinned work" thumbnail strip with
  arrows and autoplay progress bottom-right (stacks on phones). The coverflow is gone. **Whole Work page
  is dark** (`#07092b`): brand grid, chips and buttons restyled for dark. Pinned order = `WORK_FEATURED`
  in work-data.js (now Croffle Guys, Bar Bank, Siciliana, Walters, Edit; Bar Bank replaced CEAT). New
  pinned case → add its slug there and cut a clip into assets/work/hero/ with the same slug.

- ✅ **Home page v3 (Nov 2026).** Hero font change **reverted** (Fraunces italic is back).
  Featured campaigns = **brand cards** like the Work page grid (`#fcGrid`, `.fc-*`, renderer at the end
  of home.js): same 10 campaigns from the `campaigns` array, 5×2 on desktop, swipe row on phones,
  colour logo avatar, 2-line blurb, "View case" for brands with a case page. Heading on one line.
  **No " — " anywhere on the site** (client request): titles use " | ", text uses commas.
  **What we do** = 4 cards (Strategy / Creative / Production / Growth) on SoCheers' "How the work
  comes together" pattern: centred title, divided list of 4 services per card; **each service line
  has its own HD Unsplash photo** (free licence, hotlinked from images.unsplash.com — Unsplash's
  recommended usage) that crossfades in when the line is hovered/tapped; the hovered card is active
  (lime border, full-colour photo), others greyed (`#wwdFlow`, `.wwd-*`). **Logo wall**: real colours, bigger logos (tall logos get extra
  height), playful tilt on hover; only logos that contain the brand name are used — Gurume and the
  ISL crest and brands with no findable logo (Bar Bank, Vinyl Pop, Paper Boat Zero,
  POP UPI, Edit, Sarkar, Qreativs, Olly Fest, Yara, Not Rocket Science, Scalpe Pro, Paulie Gee's)
  are **removed from the rows** (client request; still defined in BRANDS for when files arrive) —
  26 logos in 3 rows of 9/9/8. Hover tilt is 2.5°. Testimonials heading → "The receipts."

- ✅ **Services page v2 (Nov 2026).** Intro, then **"WHAT WE do."** switchboard (list + preview panel)
  with the doc's order/copy/tags ([01] Social Media … [08] Branding): hover a row → arrow slides in,
  panel crossfades to that service's HD Unsplash photo, small tilt, spinning lime "8 services, 1 team"
  sticker, "Start a project" link. Phones: tap-to-open accordion with photo. Then **"How a moment gets
  made"** (4 stages) + **"Two ways to run it"** (moved here from the Work page). Data/logic in
  js/services.js, styles in css/services.css. Old svc-grid removed.

- 🧪 **Palette preview (CLIENT DEMO ONLY, home page).** Floating "Palette" pill bottom-left
  (`js/palette-preview.js` + `css/palette-preview.css`, linked only from index.html) switches between
  Original, Midnight (black / electric blue / cantaloupe), Bubblegum (deep blue / white / bubblegum
  pink) and Onyx (black / electric indigo / tropical mint) by overriding the `:root` tokens via
  `html[data-palette]`; the liquid background photos are re-tinted with background-blend-mode. Choice is
  remembered per browser. **Remove both files + the 2 tags once the client picks a palette** (then bake
  the chosen values into `:root`).

- ✅ **Let's talk / footer cleanup (Nov 2026).** Contact eyebrow asterisk removed, sub copy ends in
  "stop for!", headline is one line ("READY TO GO VIRAL?", no `<br>`): `.contact-h2` clamp is sized so
  it fits the column at every width down to 430px and wraps to two balanced lines below that (no
  nowrap, so a font fallback can never overflow). Section padding tightened. **Footer** (all pages):
  newsletter/subscribe strip removed, YouTube social **commented out** (no channel link yet, markup
  kept to uncomment), LinkedIn now https://www.linkedin.com/company/us-moment/about/.

- ✅ **About page "The people" cleanup (Nov 2026).** "The people responsible." line (struck out by
  client, heading area closed up) removed from `.about-top`, leaving just the eyebrow. Intro copy
  swapped for the client's grammar-pass version (Andheri West → Mumbai in the first line, "hyperlocal
  community" → "hyperlocal page that somehow has", "2000" → "2,000", third paragraph's last two
  sentences replaced). **All 23 crew photos + both founder photos refreshed** from the client's new
  batch (`assets/team/`, same filenames, overwritten): originals were already-square 3000px+ PNGs,
  resized/cropped to the site's 480×480 JPG convention. Ananya Ahuja and Zaheen — previously
  initials-only placeholders — now have real photos. Fardeen's and Melvin's founder photos were
  base64-inlined in `js/about.js`; switched to file paths (`assets/team/fardeen.jpg` /
  `melvin.jpg`), which also shrank `about.js` from ~133 KB to ~4.5 KB.

- ✅ **About/Home/Services pass (Nov 4 2026, evening).** **About:** crew quips removed; hero row =
  heading + "Our story" (left, 1.45fr) and founders side by side (right); "How we work / Five stages"
  section removed (about.js guards `processList`); section paddings cut. **Home:** "What clients say"
  testimonials commented out in index.html (home.js null-guards `testiTrack`); "The people" = left
  heading "Two freelancers who had their us moment.", founders left, story right, "Meet the rest of
  us"; founders photos are files, not base64 (home.js ~259 KB → ~128 KB). **What we do** cards: no
  numbers/arrows, Inter titles that roll to a lime copy on hover, hover lift + scale + cursor tilt
  (only while hovered, entrance tween uses clearProps), each card links to services.html, "See all
  services" top right, no shadow on phones. **Our work speaks louder:** 12 reels (client's 10 + 2
  kept) cut from `_media/reels` to 6s 480×854 in `assets/work-reels/`, real brand labels, each card
  links to its Instagram reel. DaVKgn6uMlQ / DL494kaJ1NF / DZCJdNiogkB must stay (work-data.js uses
  them). **Services:** "How a moment gets made" = animated pipeline (spark travels a track, active
  stage lights up, autoplay in view; vertical on phones); hero is 2-column; sticker removed;
  switchboard rows use line icons instead of [01] numbers and arrows.

- 🧪 **Hero previews (CLIENT DEMO ONLY, Nov 4 2026).** Four standalone pages to pick a new interactive
  home hero: `preview-hero-shards.html` (1, floating reel cards, CSS 3D + JS), `preview-hero-pile.html`
  (2, three.js physics pile of ✱/hearts/play buttons, three@0.160.0 from jsdelivr),
  `preview-hero-signal.html` (3, 2D canvas tick field that pops reactions), `preview-hero-liquid.html`
  (4, WebGL brush that reveals 3 reels). Reached from a **"Home ▾" dropdown in the navbar** on index/about/
  work/services/case (`.nav-dd` / `.nav-dd-menu` in base.css; phones get a `.menu-sub` list in the menu
  overlay); each preview has a "← Site / 1 2 3 4" pill bar. **Once the client picks one: build it into the
  real hero, then delete the 4 preview files, the dropdown markup on the 5 pages and the .nav-dd/.menu-sub CSS.**

- ✅ **About page v3 redesign (Nov 7 2026), "editorial + kinetic".** Replaces the hero/founders/crew layout
  (previous version is in git history). Sections: **hero** = huge Fraunces headline in 4 offset lines
  that rise in on load and drift sideways on scroll, with a pill of rotating crew faces inside the line, spinning
  "US MOMENT ✦ SOCIAL-FIRST ✦ MUMBAI" badge; **story** = 5 colour cards (Netflix 13M→22M, Prime 2,000+, 75M,
  AWSP 181K, Us Moment) with count-ups, **pinned horizontal scroll on desktop** (GSAP containerAnimation),
  stacked on ≤900px; **founders** = big flip cards (tap to flip, cursor tilt + glare on desktop); **crew** = two
  CSS-marquee rows of faces in opposite directions, hover/tap shows the name huge in lime outline behind, "View as
  grid" toggle (grid is the default under reduced motion); CTA band kept. All copy is existing site copy except
  "How we got here." and the chapter labels. Data stays in `js/about.js` (`team`, `crew`); styles fully
  rewritten in `css/about.css`. **4 easter eggs** (toast counts "Secret n/4", hint line under the CTA):
  double-click Fardeen / 5 quick clicks on Melvin = dad-joke mode (stamp + rotating jokes, Mr Masti / Mr Shaant); click Jyoti =
  coffee steam + crown + sarcastic lines; click Zaheen = thinking dots → HR thought bubble; Konami code
  (↑↑↓↓←→←→BA) or 7 taps on the spinning badge = ✱ confetti "You found us." card. Jokes/lines live in the
  `DAD` and `EGG` objects in about.js. The old process data array was dropped.
  **v3.1 (Nov 9 2026):** headline centred and sized to span the page width (one screen tall at any size);
  rotating crew-face pill removed; "Our story" timeline section removed; founder cards use new full-length
  portraits (`assets/team/fardeen-portrait.jpg` / `melvin-portrait.jpg`, 1200x1500 from the client HEICs;
  the square `fardeen.jpg`/`melvin.jpg` stay for the home page), no "Co-Founder" label, bio without the
  leading "Co-founder."; crew is wall-only (grid toggle removed).

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
