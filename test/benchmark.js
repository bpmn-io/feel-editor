// @ts-nocheck — benchmark harness (DOM/SVG heavy, not shipped; lives on the
// benchmark branch only).
//
// Measures a single lint pass via lintExpression (the text path — immune to the
// editor's CodeMirror-duplicate issue), comparing syntax-only vs syntax +
// compatibility. Meaningful only against a feel-lint that supports the
// `engines` option (e.g. run via `@bpmn-io/sr -l bpmn-io/feel-lint#compatibility-rule`).
import { lintExpression } from '@bpmn-io/feel-lint';

const BUILTINS = [
  { name: 'from json', engines: { camunda: '>=8.9' } },
  { name: 'to json', engines: { camunda: '>=8.9' } }
];

const ENGINES = { camunda: '8.6' };

/**
 * Build a large, deeply-nested, valid FEEL expression full of version-gated
 * built-in calls.
 */
export function nastyExpression(size) {
  const terms = [];

  for (let i = 0; i < size; i++) {
    terms.push(`from json(to json(from json("${ i }")))`);
  }

  return '[\n  ' + terms.join(',\n  ') + '\n]';
}

function bench(fn, iterations) {
  for (let i = 0; i < 5; i++) {
    fn();
  }

  const samples = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    samples.push(performance.now() - start);
  }

  return samples;
}

function stats(samples) {
  const sorted = [ ...samples ].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = sorted.reduce((a, b) => a + b, 0) / n;
  const variance = sorted.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
  const at = q => sorted[Math.min(n - 1, Math.floor(q * n))];

  return {
    mean,
    median: at(0.5),
    p95: at(0.95),
    min: sorted[0],
    max: sorted[n - 1],
    stddev: Math.sqrt(variance)
  };
}

const ms = value => value.toFixed(3);

export function mountBenchmark(parent) {
  const root = document.createElement('div');
  root.style.cssText = 'margin: 16px 0; font-family: sans-serif; font-size: 13px;';
  root.innerHTML = `
    <h3 style="margin: 0 0 8px">Compatibility lint benchmark</h3>
    <div style="margin-bottom: 8px">
      terms <input class="bm-size" type="number" value="300" min="1" style="width: 80px">
      iterations <input class="bm-iter" type="number" value="25" min="1" style="width: 60px">
      <button class="bm-run">Run</button>
      <span class="bm-status" style="margin-left: 8px; color: #666"></span>
    </div>
    <div class="bm-results"></div>
  `;
  parent.appendChild(root);

  root.querySelector('.bm-run').addEventListener('click', () => {
    const size = Number(root.querySelector('.bm-size').value) || 1;
    const iterations = Number(root.querySelector('.bm-iter').value) || 1;
    const status = root.querySelector('.bm-status');

    status.textContent = `running… ${ size } terms × ${ iterations } iterations`;

    // defer so the status paints before the (blocking) run
    setTimeout(() => {
      const expression = nastyExpression(size);
      const baseOpts = { parserDialect: 'camunda', builtins: BUILTINS };
      const compatOpts = { ...baseOpts, engines: ENGINES };

      const baseline = stats(bench(() => lintExpression(expression, baseOpts), iterations));
      const compat = stats(bench(() => lintExpression(expression, compatOpts), iterations));
      const findings = lintExpression(expression, compatOpts).length;

      status.textContent = '';
      root.querySelector('.bm-results').innerHTML = renderResults(expression, {
        size, findings, baseline, compat
      });
    }, 0);
  });

  return root;
}

function renderResults(expression, { size, findings, baseline, compat }) {
  const overhead = compat.mean - baseline.mean;
  const ratio = baseline.mean ? compat.mean / baseline.mean : 0;

  const row = (label, s) => `
    <tr>
      <td>${ label }</td>
      <td>${ ms(s.mean) }</td><td>${ ms(s.median) }</td><td>${ ms(s.p95) }</td>
      <td>${ ms(s.min) }</td><td>${ ms(s.max) }</td><td>${ ms(s.stddev) }</td>
    </tr>`;

  return `
    <p style="margin: 4px 0">
      ${ expression.length.toLocaleString() } chars ·
      ~${ (size * 3).toLocaleString() } built-in calls ·
      ${ findings.toLocaleString() } warnings
    </p>
    <table border="1" cellpadding="4" style="border-collapse: collapse; margin-top: 4px">
      <tr><th></th><th>mean</th><th>median</th><th>p95</th><th>min</th><th>max</th><th>stddev</th></tr>
      ${ row('syntax only', baseline) }
      ${ row('syntax + compatibility', compat) }
    </table>
    <p style="margin: 6px 0; font-weight: bold">
      compatibility overhead: +${ ms(overhead) } ms/lint (${ ratio.toFixed(2) }×)
    </p>
    <p style="color: #666; margin: 4px 0">all times in ms per lint pass</p>
    ${ renderChart(baseline, compat) }`;
}

function renderChart(baseline, compat) {
  const groups = [
    { label: 'mean', a: baseline.mean, b: compat.mean },
    { label: 'p95', a: baseline.p95, b: compat.p95 }
  ];

  const width = 360, height = 180, pad = 30, barWidth = 28, groupWidth = 120;
  const max = Math.max(...groups.flatMap(g => [ g.a, g.b ])) || 1;
  const scale = value => (height - pad * 2) * (value / max);

  const bars = groups.map((g, i) => {
    const x = pad + i * groupWidth;
    const ay = height - pad - scale(g.a);
    const by = height - pad - scale(g.b);

    return `
      <rect x="${ x }" y="${ ay }" width="${ barWidth }" height="${ scale(g.a) }" fill="#94a3b8"></rect>
      <rect x="${ x + barWidth + 4 }" y="${ by }" width="${ barWidth }" height="${ scale(g.b) }" fill="#2563eb"></rect>
      <text x="${ x + barWidth }" y="${ height - pad + 14 }" text-anchor="middle" font-size="11">${ g.label }</text>`;
  }).join('');

  return `
    <svg width="${ width }" height="${ height }">
      ${ bars }
      <g font-size="11">
        <rect x="${ width - 150 }" y="12" width="12" height="12" fill="#94a3b8"></rect>
        <text x="${ width - 132 }" y="22">syntax only</text>
        <rect x="${ width - 150 }" y="30" width="12" height="12" fill="#2563eb"></rect>
        <text x="${ width - 132 }" y="40">+ compatibility</text>
      </g>
    </svg>`;
}
