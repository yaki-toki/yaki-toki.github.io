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

## Notes

- Preview locally with `python3 -m http.server` from the repo root, then open
  <http://localhost:8000>. Opening `index.html` via `file://` breaks the
  root-relative `/assets/...` paths.
- The page is print-styled; **Cmd-P → Save as PDF** produces a usable CV.
- Manuscripts under double-blind review should be listed by title and abstract
  only. Do not add a PDF link until the decision is out.
