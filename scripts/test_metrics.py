import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("metrics", Path(__file__).with_name("update-metrics.py"))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


def paper(title="Example", year=2026, status="published"):
    return f'<article class="entry" data-status="{status}"><span class="entry__year">{year}</span><h4 class="entry__title">{title}</h4></article>'


def page(journals="", review="", domestic="", patents=""):
    return f'''<section id="publications"><div class="pubgroup pubgroup--journals">{journals}</div><div class="pubgroup pubgroup--review">{review}</div></section>
<section id="domestic">{domestic}</section><section id="patents">{patents}</section><section id="projects"></section>
<span data-count="published">99</span><span data-count="review">99</span><span data-count="domestic">99</span><span data-count="patents">99</span>
<!-- metrics:papers:start --><!-- metrics:papers:end -->
<!-- metrics:patents:start --><!-- metrics:patents:end -->
<!-- metrics:scholar-date:start --><!-- metrics:scholar-date:end -->'''


CACHE = {"profile_id": m.PROFILE, "scope": "all_time", "last_success": "2026-11-01T01:00:00+00:00", "metrics": {"citations": 63, "h_index": 5, "i10_index": 1}}
SCHOLAR = '<div id="gsc_prf_in">김지하</div><table id="gsc_rsb_st"><tr><th></th><th>All</th><th>Since 2021</th></tr>' + ''.join(f'<tr><td>{name}</td><td>{value}</td><td>0</td></tr>' for name, value in [('Citations', 63), ('h-index', 5), ('i10-index', 1)]) + '</table>'


class MetricsTests(unittest.TestCase):
    def test_scholar_all_time_and_validation(self):
        self.assertEqual(m.parse_scholar(SCHOLAR), CACHE['metrics'])
        for invalid in ['<h1>Captcha</h1>', SCHOLAR.replace('김지하', 'Someone Else'), SCHOLAR.replace('>All<', '>Recent<'), SCHOLAR.replace('>63<', '>N/A<'), SCHOLAR.replace('>63<', '>2<')]:
            with self.assertRaises(ValueError):
                m.parse_scholar(invalid)

    def test_add_remove_and_status_change(self):
        source = page(journals=paper(), review=paper('Pending', 2027, 'revision'), domestic=paper('국내'))
        result, counts = m.render(source, CACHE)
        self.assertEqual((counts['published'], counts['review'], counts['domestic']), (1, 1, 1))
        self.assertIn('2027</text>', result)
        result, counts = m.render(source.replace('data-status="revision"', 'data-status="accepted"'), CACHE)
        self.assertEqual((counts['published'], counts['review']), (2, 0))
        self.assertIn('data-count="review">0</span>', result)
        result, counts = m.render(page(), CACHE)
        self.assertEqual(counts['published'], 0)
        self.assertEqual(counts['domestic'], 0)
        self.assertNotIn('class="mark ', result.split('<ul class="chart__legend">')[0])

    def test_patent_uniqueness(self):
        patent = '<article class="patent"><span class="entry__year">2024</span><h3 class="patent__title">Title</h3><p class="patent__no">10-2024-0000001 · published 10-2026-0000002</p></article>'
        self.assertEqual(m.records(page(patents=patent))[2]['patents'], 1)
        with self.assertRaises(ValueError):
            m.records(page(patents=patent * 2))
        with self.assertRaises(ValueError):
            m.records(page(journals=paper(status='typo')))

    def test_refresh_failure_keeps_cache_and_updates_content(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root/'assets/data').mkdir(parents=True)
            cache = root/'assets/data/scholar.json'
            cache.write_text(json.dumps(CACHE))
            before = cache.read_bytes()
            (root/'index.html').write_text(page(journals=paper()))
            with patch.object(m, 'fetch_scholar', side_effect=OSError('unavailable')):
                self.assertEqual(m.update(root, refresh=True), 1)
            self.assertEqual(cache.read_bytes(), before)
            self.assertIn('data-count="published">1</span>', (root/'index.html').read_text())
            self.assertIn('2026-11-01', (root/'index.html').read_text())

    def test_real_page_idempotent_and_matches_chart(self):
        source = (m.ROOT/'index.html').read_text()
        cache = json.loads((m.ROOT/'assets/data/scholar.json').read_text())
        rendered, counts = m.render(source, cache)
        self.assertEqual(m.render(rendered, cache)[0], rendered)
        chart = m.Document(rendered).root.find(lambda n: n.has('chart'))[0]
        plot = next(c for c in chart.children if isinstance(c, m.Element) and c.tag == 'svg')
        self.assertEqual(len(plot.find(lambda n: n.has('mark'))), counts['published'] + counts['domestic'] + counts['review'])


if __name__ == '__main__':
    unittest.main()
