# Enactus ISET Djerba — Future Makers

One-page static website for the Enactus ISET Djerba chapter.
Plain HTML5 + CSS3 + vanilla JavaScript. **No framework, no npm, no build step.**



---

## Stack

| Layer | Tech |
|-------|------|
| Markup | HTML5 (`index.html`, one page) |
| Style | CSS3 (`style.css`, one file, 15 numbered sections) |
| Logic | Vanilla JS (`js/app.js`, one IIFE) |
| Fonts | Google Fonts: Outfit + Space Grotesk |

## Quick start

Do **not** open `index.html` with `file://` (paths and video behave differently). Use one of:

```bash
# VS Code: install "Live Server", right-click index.html > Open with Live Server
npx http-server . -p 8080 -c-1      # Node
python -m http.server 8080          # Python 3
```

Then open `http://localhost:8080`.

## Project structure

```
├── index.html            # All content. Sections are marked with big HTML comments
├── style.css             # All styles. Numbered sections (see below)
├── js/app.js             # All behaviour. One function per feature
├── assets/
│   ├── img/              # Photos, logo, project images
│   └── videos/           # hero-bg.mp4
├── README.md             # This file (for humans)
└── AGENTS.md             # Rules for AI coding agents
```

### `index.html` sections (ids)

`#home` (hero + video) · `#about` · `#mission` · `#team` (`#team-container`) · `#projects` (`#hydrobloom`, `#educare`) · `#contact` · `<footer>`
Desktop nav = `.premium-nav` · Mobile menu = `#mobile-menu`.

### `style.css` sections

`1` Tokens & base · `2` Preloader · `3` Navigation · `4` Mobile menu · `5` Reveal helpers · `6` Hero · `7` Section layout · `8` About · `9` Glass cards · `10` Mission · `11` **Team** · `12` Projects · `13` Hiring/contact · `14` Footer · `15` Responsive

Find one fast: `rg -n "11\. TEAM" style.css`

### `js/app.js` functions

`initNavigation` (menu, smooth scroll, active link) · `initReveal` (scroll animations) · `initTeam` (tap to open cards) · `initCompareSliders` (before/after) · `initPreloader` · `initHeroVideo` · all called from `init()`.

---

## Quick edit map

| I want to... | File | Search for |
|--------------|------|-----------|
| Add / edit / remove a team member | `index.html` | `team-avatar` or the member's name |
| Change a member photo | `assets/img/` + `index.html` | replace the file, keep the `<img src>` in sync |
| Change a member's hover bio | `index.html` | member's `.team-card-hover-content p` |
| Change a team card colour | `index.html` | `--team-accent` in the card's `style=""` |
| Change a team card animation | `index.html` | `effect-` and `direction-` classes (valid combos below) |
| Change team grid columns | `style.css` | section 11, `.team-grid` + `@media (min-width…)` |
| Fix team cards on phones | `style.css` | section 11, `@media (max-width: 639px)` |
| Edit hero title / text / stats | `index.html` | `hero-title`, `hero-description`, `hero-stats` |
| Change the Apply Google Form link | `index.html` | `forms.gle` (**2 places**: hero + `#contact`) |
| Edit About / Mission text | `index.html` | `id="about"` / `id="mission"` |
| Add / edit a project | `index.html` | `id="projects"`, `.project-item` |
| Before/after images | `index.html` | `.ba-slider` (`.ba-before`, `.ba-after`) |
| Change social links | `index.html` | `social-links` |
| Change colours / fonts | `style.css` | `:root` at the top (`--color-gold: #FFC222`) |
| Add a nav link | `index.html` | `.nav-menu` **and** `.mobile-menu-links` (both!) |
| Replace hero video / poster | `index.html` | `id="hero-video"` |
| Change preloader duration | `js/app.js` | `initPreloader` |
| Change scroll animations | `style.css` + `js/app.js` | section 5 + `initReveal` |
| Fix something on mobile | `style.css` | section 15 (nav, hero, sections) and the `max-width: 639px` block in section 11 (team) |
| Fix the hamburger menu | `style.css` | section 3, `.hamburger` |

---

## Recipes

### Add a team member

Paste inside `<div id="team-container" class="team-grid">`. The grid adapts by itself (2 cols phone, 3 tablet, 4 desktop).

```html
<article class="team-avatar effect-wipe direction-right" tabindex="0" role="button"
         aria-label="FULL NAME, ROLE" style="--team-accent: #ffc222;">
    <div class="team-card-face team-card-default">
        <img src="assets/img/full_name.jpg" alt="Full Name">
        <div class="team-card-copy">
            <span class="team-card-role">Role</span>
            <h4>Full Name</h4>
        </div>
    </div>
    <div class="team-card-face team-card-hover">
        <div class="team-card-hover-content">
            <p>Short bio (20–40 words).</p>
            <div>
                <strong>Full Name</strong>
                <span>Role</span>
            </div>
        </div>
    </div>
</article>
```

Photo tips: portrait, face in the upper half (the image is cropped to the top), lowercase file name.

**Valid effect / direction combos**

| Effect | Directions |
|--------|-----------|
| `effect-wipe` | `direction-right` (default), `left`, `top`, `bottom` |
| `effect-ripple` | `right`, `left`, `top`, `bottom`, `top-right` (none = centre) |
| `effect-curtain` | `right` (default), `left`, `bottom` |
| `effect-diagonal` | none, or `top-right` |
| `effect-strips` | none needed (always from the left) |

### Add a nav link

The target must be a `<section id="x">` so the active-link highlight works. Add **both** links:

```html
<!-- desktop, inside .nav-menu (before the "Join Us" CTA) -->
<a href="#x" class="nav-link" data-section="x"><span class="link-text">Label</span></a>

<!-- mobile, inside .mobile-menu-links (copy an existing block, change href, data-section and text) -->
<a href="#x" class="mobile-link" data-section="x">
    <span class="mobile-link-icon"><!-- copy an <svg> from another link --></span>
    <span>Label</span>
</a>
```

### Add a section

```html
<section id="x" class="section-padding">
    <h2 class="section-title reveal">Title</h2>
    <p class="section-subtitle reveal">Subtitle</p>
    <!-- content: add class "reveal" or "glass-card" to animate on scroll -->
</section>
```

### Add a project

Copy a `.project-item` block in `#projects` (`#hydrobloom` has the before/after slider, `#educare` has a single image):

```html
<div class="ba-slider">
    <img src="assets/img/new-after.png" class="ba-after" alt="After">
    <img src="assets/img/new-before.png" class="ba-before" alt="Before">
    <div class="ba-handle"></div>
</div>
```

A slider without `.ba-before` / `.ba-handle` is just a static image.

---

## How the team cards work

Each card has two faces that swap: `.team-card-default` (photo) and `.team-card-hover` (bio).

| Device | Trigger |
|--------|---------|
| Mouse | CSS `:hover` (only on real hover devices) |
| Touch | tap toggles `.is-open` (`initTeam`), tap outside or `Esc` closes, one card open at a time |
| Keyboard | CSS `:focus-visible` (+ Enter / Space on touch devices) |

Effects are driven by CSS variables set on `.team-avatar` (section 11). To add or tweak an effect, only change these tokens:

| Token | Meaning |
|-------|---------|
| `--clip-hidden` / `--clip-shown` | `clip-path` before / after (same shape type, e.g. `inset()` → `inset()`) |
| `--hover-from` / `--hover-to` | `transform` of the bio face before / after |
| `--default-out` | `transform` of the photo face when it fades out |
| `--team-accent` | card colour (set inline in the HTML) |

---

## Conventions

**CSS**
- One definition per component. Edit the existing rule; never add an overriding duplicate.
- New rules go in the matching numbered section. Use `:root` tokens for colours, fonts, easing.
- Mobile overrides: section 15, except team (inside section 11).
- Avoid `!important` (only used on `.nav-cta` and `.mobile-cta` colours).

**JS**
- One named function per feature inside the IIFE, registered in `init()`.
- Use the `$` / `$$` helpers. No libraries, no new files.

**Assets**
- Lowercase snake_case file names (`ghofrane_chrigui.jpg`): Linux hosts are case-sensitive.

---

## Testing checklist (before every commit)

- [ ] Hard refresh (`Ctrl+Shift+R`)
- [ ] Devtools device mode at 360 / 390 / 768 / 1280 px
- [ ] Team cards: hover on desktop, tap open / tap close on a real phone
- [ ] Hamburger opens, closes (X centred), links scroll to the right section
- [ ] Console has **no errors**, including 404s
- [ ] Every `src` / `href` in `index.html` exists in `assets/` with the exact same case
- [ ] `node --check js/app.js` prints nothing

## Known gotchas

- The `#hero-video` block must only reference files that exist. Today: `assets/videos/hero-bg.mp4`, and a `poster` image that exists in `assets/img/`. A missing file only shows as a 404 in the console, the site still works.
- Old browser cache on phones can keep an old `style.css`: hard refresh or clear site data.
- "Read More" buttons in projects use an inline `onclick` in the HTML.
- `--team-accent-soft` still appears inline on the older cards but is **not used** by the CSS. Ignore or delete it.
- Some images in `assets/img/` are not referenced by `index.html` (old team photos, `.jpg` copies of the Hydrobloom images). Safe to remove after a quick search.

## Deployment (GitHub Pages)

`index.html` must be at the repo root. Settings → Pages → deploy from the main branch, root. After publishing, open the site and check the console for 404s (usually a case mismatch in a file name).

## Credits & license

Team members and roles are in `index.html` (`#team`); they are not duplicated here to avoid stale info.
Footer credit: *BY BMS-DEV and OA-DEV*.

© 2026 Enactus ISET Djerba. All rights reserved.