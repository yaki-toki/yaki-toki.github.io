#!/usr/bin/env node
/**
 * Pull daily visitor counts from GoatCounter, merge them into the permanent
 * log at assets/data/visits.json, and render the footer sparkline directly
 * into index.html.
 *
 * The chart is written at commit time rather than fetched in the browser.
 * This site renders completely without JavaScript; a client-side chart would
 * be the one thing on the page that doesn't.
 *
 * Env: GOATCOUNTER_API_TOKEN — a token with "Read statistics" permission.
 * The site code is read from the data-goatcounter attribute in index.html,
 * so that string is the single place it is configured.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const HTML = join(ROOT, 'index.html');
const LOG = join(ROOT, 'assets', 'data', 'visits.json');

const WINDOW_DAYS = 90;  // refetched every run, so a skipped cron self-heals
const CHART_DAYS = 60;   // how much of the log the footer shows
const TZ_OFFSET = 9;     // GoatCounter site timezone: Asia/Seoul

const DAY_MS = 86_400_000;
const iso = (d) => d.toISOString().slice(0, 10);
const shift = (day, n) => iso(new Date(Date.parse(`${day}T00:00:00Z`) + n * DAY_MS));
const seoulToday = () => iso(new Date(Date.now() + TZ_OFFSET * 3_600_000));
const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/* ---- GoatCounter ------------------------------------------------------- */

function siteCode(html) {
  const m = html.match(/data-goatcounter="https:\/\/([a-z0-9-]+)\.goatcounter\.com\/count"/i);
  if (!m) throw new Error('No data-goatcounter attribute found in index.html');
  return m[1];
}

/**
 * /api/v0/stats/total returns the site-wide totals with a per-day breakdown,
 * so unlike /stats/hits it needs no summing across paths (which would double
 * count a visitor who read two pages).
 */
async function fetchDaily(code, token, start, end) {
  const url = `https://${code}.goatcounter.com/api/v0/stats/total`
            + `?start=${start}&end=${end}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`GoatCounter ${res.status} ${res.statusText}: ${(await res.text()).slice(0, 300)}`);
  }
  const body = await res.json();
  const stats = Array.isArray(body.stats) ? body.stats : [];

  // The schema documents `daily`, but only populates it when the response is
  // grouped by day. Fall back to summing the hourly buckets.
  const days = {};
  for (const s of stats) {
    if (!s || typeof s.day !== 'string') continue;
    // The range bounds are documented as hour-rounded, so the API is entitled
    // to hand back the boundary day. Never let a partial day into the log.
    if (s.day > end) continue;
    const count = typeof s.daily === 'number' && s.daily > 0
      ? s.daily
      : (Array.isArray(s.hourly) ? s.hourly.reduce((a, b) => a + (b || 0), 0) : 0);
    days[s.day] = count;
  }
  return days;
}

/* ---- Log --------------------------------------------------------------- */

async function readLog() {
  try {
    const parsed = JSON.parse(await readFile(LOG, 'utf8'));
    return { days: parsed.days ?? {} };
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    return { days: {} };
  }
}

/**
 * Only days present in the response are overwritten, so history that has aged
 * out of GoatCounter's retention window stays in the log forever.
 */
function mergeLog(existing, fetched) {
  const days = { ...existing.days, ...fetched };
  const sorted = {};
  for (const day of Object.keys(days).sort()) sorted[day] = days[day];
  return sorted;
}

/* ---- Chart ------------------------------------------------------------- */

const W = 900, BASE = 64, TOP = 8, LABEL_Y = 79;

function renderChart(days) {
  const logged = Object.keys(days).sort();
  if (logged.length === 0) return null;

  const end = logged[logged.length - 1];
  // Start at the window edge, or the first logged day if the log is younger.
  const start = [shift(end, -(CHART_DAYS - 1)), logged[0]].sort().pop();

  // Densify: a day with no visitors is a zero, not a hole in the series.
  const series = [];
  for (let d = start; d <= end; d = shift(d, 1)) series.push([d, days[d] ?? 0]);

  const max = Math.max(1, ...series.map(([, c]) => c));
  const peak = series.find(([, c]) => c === max);
  const step = W / series.length;
  const bw = Math.max(2, Math.min(11, step - 6));

  const bars = series
    .map(([day, c], i) => {
      if (c <= 0) return null;
      const h = Math.max(2, Math.round((c / max) * (BASE - TOP)));
      const x = (i * step + (step - bw) / 2).toFixed(2);
      return `          <rect class="visits__bar" x="${x}" y="${BASE - h}" `
           + `width="${bw.toFixed(2)}" height="${h}" rx="1">`
           + `<title>${day} · ${fmt(c)}</title></rect>`;
    })
    .filter(Boolean)
    .join('\n');

  const windowTotal = series.reduce((a, [, c]) => a + c, 0);
  const allTime = Object.values(days).reduce((a, c) => a + c, 0);
  const label = `Daily site visitors from ${start} to ${end}: `
              + `${fmt(windowTotal)} over the period, `
              + `peaking at ${fmt(max)} on ${peak[0]}. `
              + `${fmt(allTime)} recorded in total.`;

  const svg =
`        <svg class="visits__fig" viewBox="0 0 ${W} 86" role="img"
             aria-label="${label}">
          <line class="visits__axis" x1="0" y1="${BASE}" x2="${W}" y2="${BASE}"/>
${bars}
          <g class="visits__lab">
            <text x="0" y="${LABEL_Y}">${start}</text>
            <text x="${W}" y="${LABEL_Y}" text-anchor="end">${end}</text>
          </g>
        </svg>`;

  return { svg, start, end, days: series.length, windowTotal, allTime, max, updated: end };
}

function renderBlock(chart) {
  if (!chart) {
    return `      <figure class="visits">
        <p class="visits__empty">
          <span data-l="en">Visitor logging starts with the first recorded day.</span>
          <span data-l="ko">방문자 기록은 첫 집계일부터 표시됩니다.</span>
        </p>
      </figure>`;
  }
  const { svg, days, allTime, updated } = chart;
  return `      <figure class="visits">
        <figcaption class="visits__cap">
          <span class="visits__title">
            <span data-l="en">Visitors</span><span data-l="ko">방문자</span>
          </span>
          <span class="visits__sub">
            <span data-l="en">last ${days} days · ${fmt(allTime)} all-time · updated ${updated}</span>
            <span data-l="ko">최근 ${days}일 · 누적 ${fmt(allTime)} · ${updated} 갱신</span>
          </span>
        </figcaption>
${svg}
      </figure>`;
}

function inject(html, block) {
  const re = /([ \t]*<!-- visits:start -->\n)[\s\S]*?([ \t]*<!-- visits:end -->)/;
  if (!re.test(html)) throw new Error('visits:start / visits:end markers not found in index.html');
  return html.replace(re, (_m, open, close) => `${open}${block}\n${close}`);
}

/* ---- Main -------------------------------------------------------------- */

const token = process.env.GOATCOUNTER_API_TOKEN;
if (!token) {
  console.error('GOATCOUNTER_API_TOKEN is not set.');
  process.exit(1);
}

const html = await readFile(HTML, 'utf8');
const code = siteCode(html);
// Yesterday in Seoul: the last day that has actually closed. Reading through
// "today" would log a partial count and leave a stub bar at the end of every
// chart, since the scheduled run fires half an hour after midnight KST.
const end = shift(seoulToday(), -1);
const start = shift(end, -(WINDOW_DAYS - 1));

// Fetch before touching anything on disk: a failed request must never be able
// to blank the log or the chart.
const fetched = await fetchDaily(code, token, start, end);
console.log(`${code}.goatcounter.com — ${Object.keys(fetched).length} day(s) in ${start}..${end}`);

const days = mergeLog(await readLog(), fetched);
const chart = renderChart(days);

await writeFile(LOG, `${JSON.stringify({ site: code, updated: end, days }, null, 2)}\n`);
await writeFile(HTML, inject(html, renderBlock(chart)));

console.log(chart
  ? `log: ${Object.keys(days).length} day(s), ${fmt(chart.allTime)} all-time; chart ${chart.start}..${chart.end}`
  : 'log is empty — rendered the placeholder');
