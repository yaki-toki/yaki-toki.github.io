# yaki-toki.github.io

Academic CV for **Jiha Kim (김지하)** — Integrated MS–PhD candidate, Department of
Information and Communication Engineering, Myongji University (DAN Lab).

Live at <https://yaki-toki.github.io/>.

## How it is built

A plain static site — no Jekyll, no build step, no dependencies. GitHub Pages
serves the files as they are, which is why `.nojekyll` is present.

```
index.html              all content, both languages, inline
assets/css/style.css    design tokens + layout
assets/js/main.js       language toggle, theme toggle, scroll reveal
assets/papers/*.pdf     manuscripts linked from the Publications section
assets/data/visits.json       the daily visitor log
scripts/update-visits.mjs     pulls counts and redraws the footer chart
.github/workflows/visits.yml  runs that script once a day
```

## Editing

**Content** lives directly in `index.html`. Each publication is one `<article
class="entry">` block; copy an existing one and edit it.

**Both languages sit side by side** in the markup:

```html
<span data-l="en">Under review</span>
<span data-l="ko">심사 중</span>
```

CSS hides the inactive one (`:root[lang="en"] [data-l="ko"] { display: none }`),
so the toggle needs no JavaScript to be correct — JS only remembers the choice.
Anything without a `data-l` attribute (paper titles, venues, names) shows in
both languages. When adding text, add both variants or neither.

**Colours, type scale and spacing** are CSS custom properties at the top of
`style.css`. Change them there rather than in individual rules.

## Visit log

Daily visitor counts are collected by [GoatCounter](https://www.goatcounter.com)
— no cookies, no personal data, so there is nothing to put a consent banner on.
The beacon is one `async` tag at the bottom of `index.html`.

Once a day `.github/workflows/visits.yml` runs `scripts/update-visits.mjs`, which:

1. reads the site code out of the `data-goatcounter` attribute in `index.html`
   — that attribute is the only place it is configured;
2. asks `/api/v0/stats/total` for the last 90 days. The whole window is refetched
   every run, so a skipped or delayed cron repairs itself on the next one;
3. merges the result into `assets/data/visits.json`. Only days present in the
   response are overwritten, so history outlives GoatCounter's retention window;
4. redraws the footer chart **into `index.html`** and commits both files.

The chart is written at commit time rather than fetched in the browser. This site
renders completely without JavaScript, and a client-side chart would be the one
thing on the page that doesn't; it also costs no extra request and no client code.
Anything between the `<!-- visits:start -->` and `<!-- visits:end -->` markers is
generated — do not hand-edit it.

Only completed days are logged: the job runs at 00:30 KST and reads through
*yesterday*, so no partial day ever lands in the log.

**Setup.** The workflow needs a repository secret `GOATCOUNTER_API_TOKEN` — a
GoatCounter API token with *Read statistics* permission. Set the GoatCounter site
timezone to Asia/Seoul so its day boundaries match the ones in the log.

To change how much is shown or fetched, edit `CHART_DAYS` and `WINDOW_DAYS` at the
top of the script. For fewer commits, drop the cron to weekly — the counts stay
per-day either way.

## Notes

- Preview locally with `python3 -m http.server` from the repo root, then open
  <http://localhost:8000>. Opening `index.html` via `file://` breaks the
  root-relative `/assets/...` paths.
- The page is print-styled; **Cmd-P → Save as PDF** produces a usable CV.
- Manuscripts under double-blind review should be listed by title and abstract
  only. Do not add a PDF link until the decision is out.
