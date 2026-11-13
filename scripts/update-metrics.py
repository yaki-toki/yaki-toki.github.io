#!/usr/bin/env python3
"""Build portfolio counters/charts from HTML records; optionally refresh Scholar."""
import argparse
from collections import Counter
from datetime import datetime, timezone
from html import escape
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
PROFILE = "PpU-8aAAAAAJ"
SCHOLAR_URL = f"https://scholar.google.com/citations?user={PROFILE}&hl=en"
VOID = set("area base br col embed hr img input link meta param source track wbr".split())


class Element:
    def __init__(self, tag="root", attrs=(), parent=None):
        self.tag, self.attrs, self.parent = tag, dict(attrs), parent
        self.children = []

    def text(self):
        return "".join(c if isinstance(c, str) else c.text() for c in self.children)

    def has(self, cls):
        return cls in self.attrs.get("class", "").split()

    def find(self, predicate):
        result = []
        for child in self.children:
            if isinstance(child, Element):
                if predicate(child):
                    result.append(child)
                result.extend(child.find(predicate))
        return result


class Document(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.root = Element()
        self.current = self.root
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        node = Element(tag, attrs, self.current)
        self.current.children.append(node)
        if tag not in VOID:
            self.current = node

    def handle_startendtag(self, tag, attrs):
        self.current.children.append(Element(tag, attrs, self.current))

    def handle_endtag(self, tag):
        node = self.current
        while node.parent:
            if node.tag == tag:
                self.current = node.parent
                return
            node = node.parent

    def handle_data(self, data):
        self.current.children.append(data)


def one(nodes, label):
    if len(nodes) != 1:
        raise ValueError(f"Expected one {label}; found {len(nodes)}")
    return nodes[0]


def records(source):
    doc = Document(source).root
    papers, patents, seen = [], [], set()
    for section_id in ("publications", "domestic", "patents"):
        section = one(doc.find(lambda n: n.attrs.get("id") == section_id), section_id)
        for article in section.find(lambda n: n.tag == "article" and (n.has("entry") or n.has("patent"))):
            title = one(article.find(lambda n: n.has("entry__title") or n.has("patent__title")), "record title").text().strip()
            year_text = one(article.find(lambda n: n.has("entry__year")), "record year").text().strip()
            if not re.fullmatch(r"20\d{2}", year_text):
                raise ValueError(f"Invalid record year: {year_text}")
            if section_id == "patents":
                number = one(article.find(lambda n: n.has("patent__no")), "application number").text()
                match = re.match(r"\s*(\d{2}-\d{4}-\d{7})\b", number)
                if not match:
                    raise ValueError("Missing Korean patent application number")
                key = ("patent", match[1])
                if key in seen:
                    raise ValueError(f"Duplicate application: {match[1]}")
                seen.add(key)
                patents.append({"title": title, "year": int(year_text), "number": match[1]})
                continue
            group = article.parent
            while group.parent and not group.has("pubgroup"):
                group = group.parent
            kind = "domestic" if section_id == "domestic" else "conference" if group.has("pubgroup--conferences") else "journal"
            status = article.attrs.get("data-status", "review" if group.has("pubgroup--review") else "published")
            if status not in {"published", "accepted", "review", "revision", "rejected", "withdrawn"}:
                raise ValueError(f"Unknown publication status: {status}")
            if status in {"rejected", "withdrawn"}:
                continue
            key = (section_id, " ".join(title.casefold().split()))
            if key in seen:
                raise ValueError(f"Duplicate paper: {title}")
            seen.add(key)
            category = "review" if status in {"review", "revision"} else kind
            papers.append({"title": title, "year": int(year_text), "category": category})
    projects = one(doc.find(lambda n: n.attrs.get("id") == "projects"), "projects")
    counts = Counter(p["category"] for p in papers)
    for category in ("journal", "conference", "domestic", "review"):
        counts.setdefault(category, 0)
    counts["published"] = counts["journal"] + counts["conference"]
    counts["patents"] = len(patents)
    counts["projects"] = len(projects.find(lambda n: n.tag == "article"))
    for group in projects.find(lambda n: "data-project-group" in n.attrs):
        counts["projects-" + group.attrs["data-project-group"]] = len(group.find(lambda n: n.tag == "article"))
    return papers, patents, counts


def parse_scholar(source):
    doc = Document(source).root
    # Reject bot challenges, login pages, or a different profile instead of recording zero.
    name = one(doc.find(lambda n: n.attrs.get("id") == "gsc_prf_in"), "Scholar profile name").text().strip()
    if name not in {"김지하", "Jiha Kim"}:
        raise ValueError("Scholar profile identity did not match")
    table = one(doc.find(lambda n: n.attrs.get("id") == "gsc_rsb_st"), "Scholar metrics table")
    headers = table.find(lambda n: n.tag == "th")
    if len(headers) != 3 or headers[1].text().strip() != "All":
        raise ValueError("Scholar all-time column changed")
    values = {}
    names = {"Citations": "citations", "h-index": "h_index", "i10-index": "i10_index"}
    for row in table.find(lambda n: n.tag == "tr"):
        cells = [c for c in row.children if isinstance(c, Element) and c.tag == "td"]
        if not cells or cells[0].text().strip() not in names:
            continue
        if len(cells) != 3:
            raise ValueError("Scholar All/Recent columns changed")
        number = cells[1].text().strip()  # All-time, not the recent column.
        if not re.fullmatch(r"(?:\d+|\d{1,3}(?:,\d{3})+)", number):
            raise ValueError("Invalid Scholar metric")
        key = names[cells[0].text().strip()]
        if key in values:
            raise ValueError("Duplicate Scholar metric")
        values[key] = int(number.replace(",", ""))
    validate_metrics(values)
    return values


def validate_metrics(values):
    if set(values) != {"citations", "h_index", "i10_index"}:
        raise ValueError("Incomplete Scholar metrics")
    if any(type(v) is not int or v < 0 for v in values.values()):
        raise ValueError("Metrics must be non-negative integers")
    if values["h_index"] ** 2 > values["citations"] or values["i10_index"] * 10 > values["citations"]:
        raise ValueError("Inconsistent Scholar metrics")


def fetch_scholar():
    # One public profile request. No pagination, proxy, login or challenge bypass.
    request = urllib.request.Request(SCHOLAR_URL, headers={"User-Agent": "JihaKimPortfolio/1.0 (+https://yaki-toki.github.io/)"})
    with urllib.request.urlopen(request, timeout=25) as response:
        if response.status != 200 or not response.headers.get("Content-Type", "").startswith("text/html"):
            raise ValueError("Unexpected Scholar response")
        charset = response.headers.get_content_charset() or "utf-8"
        source = response.read(2_000_001)
        if len(source) > 2_000_000:
            raise ValueError("Scholar response too large")
        values = parse_scholar(source.decode(charset))
    return {"source": "Google Scholar", "profile_id": PROFILE, "url": SCHOLAR_URL,
            "scope": "all_time", "last_success": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "metrics": values}


def replace_block(source, name, body):
    pattern = rf"<!-- metrics:{name}:start -->[\s\S]*?<!-- metrics:{name}:end -->"
    if len(re.findall(pattern, source)) != 1:
        raise ValueError(f"Missing or duplicate generated block: {name}")
    return re.sub(pattern, lambda _: f"<!-- metrics:{name}:start -->\n{body}\n      <!-- metrics:{name}:end -->", source)


def mark(category, x, y, title):
    tooltip = f"<title>{escape(title)}</title>"
    if category == "conference":
        return f'<rect class="mark m2" x="{x-8:g}" y="{y-8:g}" width="16" height="16" rx="2">{tooltip}</rect>'
    if category == "domestic":
        return f'<path class="mark m3" d="M{x:g} {y-8:g} L{x+8:g} {y+7:g} L{x-8:g} {y+7:g} Z">{tooltip}</path>'
    return f'<circle class="mark {"m4" if category == "review" else "m1"}" cx="{x:g}" cy="{y:g}" r="8">{tooltip}</circle>'


def paper_chart(papers, counts):
    years = sorted({p["year"] for p in papers})
    totals = Counter(p["year"] for p in papers)
    baseline = max(100, max(totals.values(), default=0) * 24 + 28)
    svg = [f'<svg viewBox="0 0 900 {baseline+38}" role="img" aria-label="One mark per paper. Annual totals: {escape(str(dict(sorted(totals.items()))))}">',
           f'<line class="axis" x1="40" y1="{baseline}" x2="866" y2="{baseline}"/>']
    rank = {"journal": 0, "conference": 1, "domestic": 2, "review": 3}
    for i, year in enumerate(years):
        x = 450 if len(years) == 1 else 100 + i * 720 / (len(years)-1)
        entries = sorted((p for p in papers if p["year"] == year), key=lambda p: rank[p["category"]])
        for j, paper in enumerate(entries):
            svg.append(mark(paper["category"], x, baseline-20-j*24, paper["title"]))
        svg.append(f'<text class="yr" text-anchor="middle" x="{x:g}" y="{baseline+22}">{year}</text>')
    svg.append('</svg>')
    legends = []
    for key, ko, en in [("journal", "국제 저널", "Global journal"), ("conference", "국제학회", "International conf."), ("domestic", "국내학회", "Domestic conf."), ("review", "심사·수정 중", "Review / revision")]:
        legends.append(f'<li><svg viewBox="0 0 20 20" aria-hidden="true">{mark(key,10,10,"")}</svg><span data-l="ko">{ko} · {counts[key]}편</span><span data-l="en">{en} · {counts[key]}</span></li>')
    return f'''      <figure class="chart">
        <figcaption><span class="chart__title"><span data-l="en">Output by year</span><span data-l="ko">연도별 실적</span></span>
          <span class="chart__sub"><span data-l="ko">국제 {counts['published']}편 · 국내 {counts['domestic']}편 · 심사·수정 중 {counts['review']}편</span><span data-l="en">{counts['published']} international · {counts['domestic']} domestic · {counts['review']} in review / revision</span></span></figcaption>
        {''.join(svg)}
        <ul class="chart__legend">{''.join(legends)}</ul>
        <p class="project__note" data-l="ko">마크 1개 = 논문 1편. 사이트 목록에서 자동 집계합니다. 국제 실적은 게재 확정을 포함하며, 국내 발표는 제1저자·공저 논문을 모두 포함합니다.</p>
        <p class="project__note" data-l="en">One mark = one paper, counted from this site's records. International papers include accepted work; domestic presentations include first- and co-authored work.</p>
      </figure>'''


def patent_chart(patents):
    years = sorted({p["year"] for p in patents})
    total = Counter(p["year"] for p in patents)
    baseline = max(94, max(total.values(), default=0)*24+20)
    svg = [f'<figure class="ptl"><svg viewBox="0 0 900 {baseline+30}" role="img" aria-label="Patent applications by year: {escape(str(dict(sorted(total.items()))))}">',f'<line class="axis" x1="40" y1="{baseline}" x2="860" y2="{baseline}"/>']
    for i, year in enumerate(years):
        x = 450 if len(years) == 1 else 150 + i*600/(len(years)-1)
        for j, patent in enumerate(p for p in patents if p["year"] == year):
            svg.append(f'<circle class="dot" cx="{x:g}" cy="{baseline-16-j*24}" r="6.5"><title>{escape(patent["number"]+" — "+patent["title"])}</title></circle>')
        svg.append(f'<text class="yr" text-anchor="middle" x="{x:g}" y="{baseline+20}">{year}</text>')
    return "      " + "".join(svg) + '</svg></figure>'


def render(source, scholar):
    papers, patents, counts = records(source)
    validate_metrics(scholar["metrics"])
    if scholar["profile_id"] != PROFILE or scholar["scope"] != "all_time":
        raise ValueError("Wrong cached profile or metric scope")
    counts.update(scholar["metrics"])
    values = {k: str(v) for k, v in counts.items()}
    values["publications-tab"] = f"{counts['published']:02}+{counts['review']:02}"
    values["work-tab"] = f"{counts['patents']:02}+{counts['projects']:02}"
    pattern = r'<(span|i)([^>]*\bdata-count="([\w-]+)"[^>]*)>[^<]*</\1>'
    def replace_count(match):
        key = match[3]
        if key not in values:
            raise ValueError(f"Unknown counter: {key}")
        return f'<{match[1]}{match[2]}>{values[key]}</{match[1]}>'
    source = re.sub(pattern, replace_count, source)
    source = replace_block(source, "papers", paper_chart(papers, counts))
    source = replace_block(source, "patents", patent_chart(patents))
    date = datetime.fromisoformat(scholar["last_success"]).date().isoformat()
    source = replace_block(source, "scholar-date", f'''      <p class="metrics-note"><a href="{escape(SCHOLAR_URL, quote=True)}">Google Scholar</a> · <span data-l="ko">누적 지표 · 마지막 확인 {date}</span><span data-l="en">All-time metrics · last checked {date}</span></p>''')
    return source, dict(counts)


def update(root=ROOT, refresh=False):
    html_path, cache_path = root/"index.html", root/"assets/data/scholar.json"
    original = html_path.read_text()
    # Validate records before fetching or writing anything.
    records(original)
    scholar = json.loads(cache_path.read_text()) if cache_path.exists() else None
    error = None
    if refresh:
        try:
            scholar = fetch_scholar()
        except Exception as exc:
            error = str(exc)
            print(f"Scholar refresh failed; retaining last successful metrics: {error}", file=sys.stderr)
    if scholar is None:
        raise ValueError("No verified Scholar cache available")
    rendered, counts = render(original, scholar)
    # Compute and validate every output before committing files.
    if refresh and not error:
        cache_path.parent.mkdir(parents=True, exist_ok=True)
        cache_path.write_text(json.dumps(scholar, ensure_ascii=False, indent=2)+"\n")
    if rendered != original:
        html_path.write_text(rendered)
    print(json.dumps(counts, ensure_ascii=False, sort_keys=True))
    return 1 if error else 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--scholar", action="store_true", help="Refresh the public Google Scholar profile once")
    args = parser.parse_args()
    sys.exit(update(refresh=args.scholar))
