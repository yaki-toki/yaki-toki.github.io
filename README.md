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

## Research history

The Projects section contains eight national R&D projects, six documented Innopia
industry research entries, one KISTA standard-patent support program, and one
existing applied research topic. National participation dates follow the personal
NTIS records checked on 7 October 2026. Industry entries were reconciled with
named research-team records, reports, and authored correspondence on 13 November 2026.

Industry record dates are evidence dates, not individual participation periods.
Contract dates are explicitly labeled separately. Do not infer personal start/end
dates from either, or double-count the earlier media recommendation overview.
Private contracts, reports, and email links remain outside this public repository.

## Automatic research metrics

The cards, tab counts, section counts, and publication/patent charts are generated
from the actual articles in `index.html` by `scripts/update-metrics.py`. Add or
remove records in the appropriate section, then push: **Update research metrics**
recounts them and rebuilds GitHub Pages automatically. No manual counter edits are
needed. This does not discover or add new publications automatically.

- Published papers: international journals (including accepted work) plus international conferences.
- Domestic: all domestic presentations, including co-authored papers.
- Review/revision: manuscripts in `pubgroup--review`.
- Patent applications: one per unique application number in the patent list.
- Project totals and group counts also follow the project articles.

Move a manuscript to the journal group when accepted and update its visible venue
status. Optional article `data-status` values are `published`, `accepted`, `review`,
`revision`, `rejected`, or `withdrawn`; the last two are excluded from counts.
These attributes override the group's default status but do not rewrite visible
text or move articles. Generated regions use `metrics:*` comments; do not edit
their charts directly. Counter spans use `data-count`.

Daily at approximately **10:17 KST**, the same workflow checks the public
[Google Scholar profile](https://scholar.google.com/citations?user=PpU-8aAAAAAJ&hl=en)
once for all-time citations, h-index, and i10-index. It requires no secret or paid
service. Only validated metrics and the successful check timestamp are stored in
`assets/data/scholar.json`; the profile HTML is not stored. The public page shows
the last successful check date. An unavailable or changed Scholar response keeps
the previous metrics/date and reports a failed workflow instead of recording zero.
On 13 November 2026, the local fetch succeeded but the GitHub-hosted runner
received HTTP 403. Therefore scheduled Scholar refresh is configured but is **not
currently operational from GitHub**; list-based counters work independently.
Scholar can restrict automated access, and GitHub schedules may be delayed or
disabled after prolonged repository inactivity; this is not a real-time guarantee.

Use the workflow's **Run workflow** button to refresh manually. Locally:

```sh
python3 -m unittest discover -s scripts -p test_metrics.py
python3 scripts/update-metrics.py           # local record counts and cached Scholar
python3 scripts/update-metrics.py --scholar # also refresh Scholar once
```

The bot explicitly requests a Pages rebuild because commits made with
`GITHUB_TOKEN` do not start ordinary push workflows. Content-writing workflows
share a concurrency group to avoid concurrent edits.

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
timezone to Asia/Seoul so its day boundaries match the ones in the log. Until that
secret exists the scheduled run skips with a notice instead of failing; once it
exists, a rejected token or an unreachable API does fail the run.

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
