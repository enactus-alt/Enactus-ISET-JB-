# AGENTS.md

Static one-page site (Enactus ISET Djerba). Plain HTML + CSS + vanilla JS. No build, no npm, no framework.
Code files: `index.html`, `style.css`, `js/app.js`. Nothing else contains logic.

## Find things fast (never read whole files)

```bash
rg -n "TEAM SECTION|ABOUT SECTION|MISSION SECTION|PROJECTS SECTION|JOIN US SECTION|HERO SECTION|NAVIGATION" index.html
rg -n "═══ [0-9]+\." style.css          # numbered CSS sections; ASCII-safe: rg -n "11\. TEAM" style.css
rg -n "^    function init|^    const .* = \(\) =>" js/app.js
rg -n "team-avatar|Member Name" index.html
```

| Area | Where |
|------|-------|
| Team cards | `index.html` `#team-container`; `style.css` section 11 (mobile block `max-width: 639px` is inside it) |
| Nav | `.nav-menu` (desktop) AND `.mobile-menu-links` (mobile): always edit both |
| Colours / fonts / easing | `:root` at the top of `style.css` |
| Responsive (non-team) | `style.css` section 15 |
| Scroll animations | `style.css` section 5 + `initReveal()` |
| Apply form link | `forms.gle` appears twice in `index.html` (hero + `#contact`) |
| JS features | `initNavigation`, `initReveal`, `initTeam`, `initCompareSliders`, `initPreloader`, `initHeroVideo`, called from `init()` |

## Token-saving rules

- Grep the anchors above, then read only the matching range. Do not open whole files.
- Do not list or scan `assets/`; only check that a referenced file exists.
- Do not read `README.md` unless asked (it has a "Quick edit map" for humans).

## Change rules

- Minimal diffs. No refactors, no new dependencies, no new code files.
- Edit the existing rule instead of adding an overriding duplicate. New CSS goes in the matching numbered section.
- Fixing mobile must not change desktop, and the reverse.
- Team card animations are CSS variables (`--clip-hidden`, `--clip-shown`, `--hover-from`, `--hover-to`, `--default-out`). Change tokens, not structure.
- Filenames: lowercase snake_case, and case must match exactly (Linux hosting).

## Before finishing

1. Every `src` / `href` path in `index.html` exists on disk with the same case.
2. `node --check js/app.js` prints nothing.
3. Answer with the list of changed files, one line each.

## Request template (owner)

> Change X in section Y. Do not touch Z. Files allowed: index.html / style.css / js/app.js.