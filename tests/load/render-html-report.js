// Render reports/page-load/page-load-report.json as a standalone HTML page
// (reports/page-load/page-load-report.html). Run after a smoke run:
//   node tests/load/render-html-report.js
const fs = require('fs');
const path = require('path');
const REPO = require('path').join(__dirname, '..', '..');
const { meta, results: raw } = JSON.parse(fs.readFileSync(path.join(REPO, 'reports/page-load/page-load-report.json'), 'utf8'));

// normalise (same rules as renderReport)
const results = raw.map((r) => {
  const warnings = (r.warnings || []).filter((w) => !/^known app-wide script errors/.test(w));
  return { ...r, warnings, status: r.failures.length ? 'FAIL' : warnings.length ? 'WARN' : 'PASS' };
});
const counts = { PASS: 0, WARN: 0, FAIL: 0 };
for (const r of results) counts[r.status]++;
const modules = [];
for (const r of results) {
  let m = modules.find((x) => x.name === r.module);
  if (!m) { m = { name: r.module, PASS: 0, WARN: 0, FAIL: 0, total: 0 }; modules.push(m); }
  m[r.status]++; m.total++;
}
const fails = results.filter((r) => r.status === 'FAIL');
const noAdd = results.filter((r) => r.addFound === null && !r.failures.length);
const slow = [...results].sort((a, b) => b.loadMs - a.loadMs).slice(0, 8);
const globalErrs = [
  { text: 'jsVectorMap is not defined', note: 'dashboard vector-map script referenced but not loaded' },
  { text: 'NullInjectorError: R3InjectorError(Standalone[sn]) - No provider for Z', note: 'Angular layout component missing a provider' },
];
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const data = JSON.stringify(results.map((r) => ({
  s: r.status, m: r.module, n: r.name, p: r.path, l: r.loadMs, ld: r.loaderMs, a: r.addFound ? (r.addOpened ? 'opened' : 'not opened') : 'none', am: r.addMs,
  f: r.failures, w: r.warnings,
}))).replace(/</g, '\\u003c');

const html = `<title>qap Page-Load Smoke</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:wght@500;600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
:root{
  --bg:#F5F7F6; --panel:#FFFFFF; --ink:#1B2430; --ink-2:#4A5563; --ink-3:#7A8594; --line:#DCE2E0; --line-2:#EAEEEC;
  --accent:#1F5F8B; --accent-soft:#E3EEF6;
  --pass:#237A4E; --pass-soft:#E1F1E7; --warn:#A5680F; --warn-soft:#FBEED7; --fail:#B3261E; --fail-soft:#F9E2E0;
  --mono:'IBM Plex Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  --sans:'IBM Plex Sans',system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
  --cond:'IBM Plex Sans Condensed','IBM Plex Sans',system-ui,Segoe UI,Roboto,sans-serif;
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){
  --bg:#12171B; --panel:#1A2127; --ink:#E7ECEF; --ink-2:#B4BEC7; --ink-3:#7F8B96; --line:#2C363E; --line-2:#232C33;
  --accent:#6FB1E3; --accent-soft:#1D3143;
  --pass:#6FCF97; --pass-soft:#173A29; --warn:#E5B461; --warn-soft:#3F3117; --fail:#F08A83; --fail-soft:#46211E;
}}
:root[data-theme="dark"]{
  --bg:#12171B; --panel:#1A2127; --ink:#E7ECEF; --ink-2:#B4BEC7; --ink-3:#7F8B96; --line:#2C363E; --line-2:#232C33;
  --accent:#6FB1E3; --accent-soft:#1D3143;
  --pass:#6FCF97; --pass-soft:#173A29; --warn:#E5B461; --warn-soft:#3F3117; --fail:#F08A83; --fail-soft:#46211E;
}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 var(--sans);padding-block:28px 64px;padding-inline:clamp(16px,4vw,48px)}
.wrap{max-width:1240px;margin:0 auto;display:grid;gap:28px}
h1,h2,h3{font-family:var(--cond);font-weight:600;text-wrap:balance;margin:0;letter-spacing:-.01em}
h1{font-size:clamp(28px,4vw,40px);line-height:1.1}
h2{font-size:22px;line-height:1.2}
h3{font-size:16px}
.eyebrow{font:500 12px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--ink-3)}
header{display:grid;gap:10px}
.meta{display:flex;flex-wrap:wrap;gap:8px 22px;color:var(--ink-2);font-size:14px}
.meta b{color:var(--ink);font-weight:500}
code,.mono{font-family:var(--mono);font-size:.92em}
.summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
.tile{background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:14px 16px;display:grid;gap:4px}
.tile .n{font:600 34px/1 var(--cond);font-variant-numeric:tabular-nums}
.tile .l{font-size:13px;color:var(--ink-2)}
.tile.pass .n{color:var(--pass)} .tile.warn .n{color:var(--warn)} .tile.fail .n{color:var(--fail)}
.bar{display:flex;height:10px;border-radius:5px;overflow:hidden;border:1px solid var(--line)}
.bar i{display:block;height:100%}
.bar .p{background:var(--pass)} .bar .w{background:var(--warn)} .bar .f{background:var(--fail)}
section{display:grid;gap:12px}
.panel{background:var(--panel);border:1px solid var(--line);border-radius:6px;overflow:hidden}
.fail-list{display:grid}
.fail-list > div{display:grid;grid-template-columns:minmax(200px,1.1fr) minmax(0,2fr);gap:4px 20px;padding:12px 16px;border-top:1px solid var(--line-2);align-items:start}
.fail-list > div:first-child{border-top:0}
.fail-list .where b{font-weight:600}
.fail-list .where code{display:block;color:var(--ink-3);font-size:12px;margin-top:2px;word-break:break-all}
.fail-list .why{color:var(--ink-2);font-size:14px;word-break:break-word}
.tag{display:inline-block;font:500 11px/1 var(--mono);letter-spacing:.04em;padding:4px 7px;border-radius:4px;margin-right:6px;vertical-align:1px;white-space:nowrap}
.tag.api{background:var(--fail-soft);color:var(--fail)}
.tag.js{background:var(--warn-soft);color:var(--warn)}
.tag.add{background:var(--accent-soft);color:var(--accent)}
.tag.route{background:var(--fail-soft);color:var(--fail)}
.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;align-items:start}
table{width:100%;border-collapse:collapse;font-size:14px}
th{font:500 11px/1.2 var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--ink-3);text-align:left;padding:10px 12px;border-bottom:1px solid var(--line);background:var(--panel);position:sticky;top:0}
td{padding:9px 12px;border-top:1px solid var(--line-2);vertical-align:top}
td.num,th.num{text-align:right;font-variant-numeric:tabular-nums}
td code{font-size:12.5px;color:var(--ink-2);word-break:break-all}
.mod td:first-child{font-weight:500}
.mini{display:flex;height:8px;border-radius:4px;overflow:hidden;min-width:120px;background:var(--line-2)}
.mini i{display:block;height:100%}
.pill{display:inline-block;font:500 11px/1 var(--mono);letter-spacing:.05em;padding:4px 8px;border-radius:999px}
.pill.PASS{background:var(--pass-soft);color:var(--pass)} .pill.WARN{background:var(--warn-soft);color:var(--warn)} .pill.FAIL{background:var(--fail-soft);color:var(--fail)}
.controls{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:12px 16px;border-bottom:1px solid var(--line)}
.controls input,.controls select{font:14px var(--sans);color:var(--ink);background:var(--bg);border:1px solid var(--line);border-radius:4px;padding:7px 10px}
.controls input{min-width:220px;flex:1}
.chips{display:flex;gap:6px}
.chip{font:500 12px var(--mono);padding:6px 10px;border-radius:999px;border:1px solid var(--line);background:var(--panel);color:var(--ink-2);cursor:pointer}
.chip[aria-pressed="true"]{background:var(--accent-soft);border-color:var(--accent);color:var(--accent)}
.chip:focus-visible,.controls :focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.scroll{overflow-x:auto}
.count{color:var(--ink-3);font-size:13px;margin-left:auto}
.notes{color:var(--ink-2);font-size:13px;max-width:60ch}
.stripe td:first-child{border-left:3px solid transparent}
.stripe.FAIL td:first-child{border-left-color:var(--fail)} .stripe.WARN td:first-child{border-left-color:var(--warn)} .stripe.PASS td:first-child{border-left-color:var(--pass)}
ul.plain{margin:0;padding-left:18px;color:var(--ink-2);font-size:14px;display:grid;gap:6px}
ul.plain code{color:var(--ink)}
.legend{font-size:13px;color:var(--ink-2)}
@media (max-width:640px){.fail-list > div{grid-template-columns:1fr}.controls input{min-width:0}}
</style>
<div class="wrap">
<header>
  <div class="eyebrow">Playwright · tests/load · page-load smoke</div>
  <h1>qap Page-Load Smoke</h1>
  <div class="meta">
    <span>Client <b>qap</b> · <span class="mono">https://qap.sioniq.com</span></span>
    <span>Login <b>Admin / Kakkanad</b></span>
    <span>Run <b>${esc(meta.startedAt)}</b> → <b>${esc(meta.finishedAt)}</b></span>
    <span>Pages <b>${results.length}</b> of 157 catalogued (1 skipped: <span class="mono">/pages-profile</span>)</span>
  </div>
</header>

<section>
  <div class="summary">
    <div class="tile pass"><div class="n">${counts.PASS}</div><div class="l">Pass — opened, Add worked, no errors</div></div>
    <div class="tile warn"><div class="n">${counts.WARN}</div><div class="l">Warn — fine, but no Add button or console errors</div></div>
    <div class="tile fail"><div class="n">${counts.FAIL}</div><div class="l">Fail — broken load, Add or API</div></div>
    <div class="tile"><div class="n">${Math.round(results.reduce((a, r) => a + r.loadMs, 0) / results.length / 100) / 10}s</div><div class="l">Mean time to open a page</div></div>
    <div class="tile"><div class="n">${results.filter((r) => r.addOpened).length}</div><div class="l">Add forms opened, of ${results.filter((r) => r.addFound).length} Add buttons found</div></div>
  </div>
  <div class="bar" aria-hidden="true"><i class="p" style="width:${counts.PASS / results.length * 100}%"></i><i class="w" style="width:${counts.WARN / results.length * 100}%"></i><i class="f" style="width:${counts.FAIL / results.length * 100}%"></i></div>
  <div class="legend">Each page: open the route → wait for the loader → confirm the screen rendered (no redirect, blank, error text or error toast) → click the “+” Add button → confirm a form opened, while capturing failed API calls, uncaught JS errors and console errors.</div>
</section>

<section>
  <h2>Failures — ${fails.length} pages</h2>
  <div class="panel fail-list">
    ${fails.map((r) => {
      const f = r.failures.join('; ');
      const kind = /API 5xx/.test(f) ? ['api', 'API 501'] : /UNCAUGHT JS/.test(f) ? ['js', 'JS error'] : /ADD CLICKED/.test(f) ? ['add', 'Add dead'] : /REDIRECT/.test(f) ? ['route', 'Route → login'] : ['api', 'Load'];
      return `<div><div class="where"><b>${esc(r.module)} › ${esc(r.name)}</b><code>${esc(r.path)}</code></div><div class="why"><span class="tag ${kind[0]}">${kind[1]}</span>${esc(f.replace(/API 5xx: /, '').replace(/UNCAUGHT JS ERROR: /, 'Uncaught: '))}</div></div>`;
    }).join('')}
  </div>
  <p class="notes">Seven of the twelve are list or lookup APIs answering <b>501 Not Implemented</b> on this client. Certification Stone Setup already holds its single record, so the dead “+” may be by design — worth confirming. The Admin Approval page (<span class="mono">/adm/app-approval</span>) rendered completely blank on one of two runs and is not counted above.</p>
</section>

<div class="two">
<section>
  <h2>By module</h2>
  <div class="panel scroll"><table class="mod">
    <thead><tr><th>Module</th><th class="num">Pages</th><th class="num">Pass</th><th class="num">Warn</th><th class="num">Fail</th><th>Share</th></tr></thead>
    <tbody>${modules.map((m) => `<tr><td>${esc(m.name)}</td><td class="num">${m.total}</td><td class="num">${m.PASS}</td><td class="num">${m.WARN}</td><td class="num">${m.FAIL || ''}</td><td><div class="mini"><i style="width:${m.PASS / m.total * 100}%;background:var(--pass)"></i><i style="width:${m.WARN / m.total * 100}%;background:var(--warn)"></i><i style="width:${m.FAIL / m.total * 100}%;background:var(--fail)"></i></div></td></tr>`).join('')}</tbody>
  </table></div>
</section>
<section>
  <h2>Seen on every page</h2>
  <div class="panel" style="padding:14px 16px;display:grid;gap:14px">
    <div>
      <h3>Two script errors fire on every full page load</h3>
      <ul class="plain">${globalErrs.map((g) => `<li><code>${esc(g.text)}</code> — ${esc(g.note)}</li>`).join('')}</ul>
      <p class="notes" style="margin:8px 0 0">Counted once here instead of failing all ${results.length} pages. Worth one defect each.</p>
    </div>
    <div>
      <h3>Slowest to open</h3>
      <div class="scroll"><table><thead><tr><th>Page</th><th class="num">Open</th><th class="num">Loader</th></tr></thead>
      <tbody>${slow.map((r) => `<tr><td>${esc(r.name)} <code>${esc(r.path)}</code></td><td class="num">${(r.loadMs / 1000).toFixed(1)}s</td><td class="num">${r.loaderMs ? (r.loaderMs / 1000).toFixed(1) + 's' : '–'}</td></tr>`).join('')}</tbody></table></div>
    </div>
    <div>
      <h3>${noAdd.length} pages have no Add button</h3>
      <p class="notes" style="margin:0">Dashboards, settings and report screens: ${noAdd.map((r) => `<code>${esc(r.path.split('/').slice(2).join('/'))}</code>`).join(', ')}.</p>
    </div>
  </div>
</section>
</div>

<section>
  <h2>All ${results.length} pages</h2>
  <div class="panel">
    <div class="controls">
      <div class="chips" role="group" aria-label="Filter by status">
        <button class="chip" id="chip-all" data-status="" aria-pressed="true">All</button>
        <button class="chip" id="chip-fail" data-status="FAIL" aria-pressed="false">Fail</button>
        <button class="chip" id="chip-warn" data-status="WARN" aria-pressed="false">Warn</button>
        <button class="chip" id="chip-pass" data-status="PASS" aria-pressed="false">Pass</button>
      </div>
      <select id="module-filter" aria-label="Module"><option value="">All modules</option>${modules.map((m) => `<option>${esc(m.name)}</option>`).join('')}</select>
      <input id="search" type="search" placeholder="Search page or route…" aria-label="Search page or route">
      <span class="count" id="count"></span>
    </div>
    <div class="scroll"><table id="pages">
      <thead><tr><th>Status</th><th>Module</th><th>Page</th><th>Route</th><th class="num">Open</th><th class="num">Loader</th><th>Add</th><th>Notes</th></tr></thead>
      <tbody id="rows"></tbody>
    </table></div>
  </div>
</section>
</div>
<script>
const DATA = ${data};
const rows = document.getElementById('rows');
const count = document.getElementById('count');
const search = document.getElementById('search');
const modSel = document.getElementById('module-filter');
const chips = [...document.querySelectorAll('.chip')];
let status = '';
const esc = (s) => String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function render(){
  const q = search.value.trim().toLowerCase();
  const mod = modSel.value;
  const list = DATA.filter(r => (!status || r.s === status) && (!mod || r.m === mod) && (!q || (r.n + ' ' + r.p + ' ' + r.m).toLowerCase().includes(q)));
  rows.innerHTML = list.map(r => {
    const notes = [...r.f, ...r.w].join('; ');
    const add = r.a === 'none' ? '<span style="color:var(--ink-3)">none</span>' : r.a === 'opened' ? 'opened · ' + (r.am/1000).toFixed(1) + 's' : '<span style="color:var(--fail)">not opened</span>';
    return '<tr class="stripe ' + r.s + '"><td><span class="pill ' + r.s + '">' + r.s + '</span></td><td>' + esc(r.m) + '</td><td>' + esc(r.n) + '</td><td><code>' + esc(r.p) + '</code></td><td class="num">' + (r.l/1000).toFixed(1) + 's</td><td class="num">' + (r.ld ? (r.ld/1000).toFixed(1) + 's' : '–') + '</td><td>' + add + '</td><td class="notes">' + esc(notes) + '</td></tr>';
  }).join('');
  count.textContent = list.length + ' of ' + DATA.length;
}
chips.forEach(c => c.addEventListener('click', () => { status = c.dataset.status; chips.forEach(x => x.setAttribute('aria-pressed', String(x === c))); render(); }));
search.addEventListener('input', render);
modSel.addEventListener('change', render);
render();
</script>
`;
const out = path.join(REPO, 'reports', 'page-load', 'page-load-report.html');
fs.writeFileSync(out, html);
console.log('written', out, html.length, 'bytes', counts);
