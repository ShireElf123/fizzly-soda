// Lightweight behavioural regression checks; jsdom does not render or verify layout.
const fs = require('fs');
const assert = require('assert');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('index.html', 'utf8').replace(/<script src="https:\/\/cdnjs[^>]+><\/script>/g, '');
function run(width, reduced) {
  const errors = [], chain = new Proxy(function () {}, { get: (_, k) => k === 'then' || k === Symbol.toPrimitive ? undefined : () => chain, apply: () => chain });
  const timeline = new Proxy({}, { get: (_, k) => k === 'then' ? undefined : () => timeline });
  const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://fizzly.test/', beforeParse(w) {
    w.onerror = message => errors.push(message);
    w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: () => () => {} });
    w.matchMedia = query => ({ matches: query.includes('reduced-motion') ? reduced : width <= 820, addEventListener() {} });
    // Intentionally omit GSAP in reduced mode to cover the CDN failure fallback.
    if (!reduced) {
      w.gsap = Object.assign(chain, { registerPlugin() {}, killTweensOf() {}, timeline: () => timeline, utils: { toArray: x => Array.from(x) } });
      w.ScrollTrigger = { create: () => ({ kill() {} }) };
    }
  }});
  const w = dom.window, d = w.document;
  assert.equal(d.querySelectorAll('.cd').length, 6);
  assert(d.querySelector('#ld .l2').textContent.includes('Ready to'));
  assert.equal(d.querySelector('#ld').style.display, reduced ? 'none' : 'grid');
  if (!reduced) { d.querySelector('#motion-toggle').click(); assert.equal(d.querySelector('#motion-toggle').getAttribute('aria-pressed'), 'true'); d.querySelector('#motion-toggle').click(); assert.equal(d.querySelector('#motion-toggle').getAttribute('aria-pressed'), 'false'); }
  assert.equal(d.querySelectorAll('#dt [aria-pressed="true"]').length, 1);
  d.querySelectorAll('#dt button')[4].click();
  assert.equal(d.querySelectorAll('#dt button')[4].getAttribute('aria-pressed'), 'true');
  d.querySelectorAll('#ch button')[2].click();
  assert.equal(d.querySelectorAll('#ch button')[2].getAttribute('aria-pressed'), 'true');
  assert.equal([...d.querySelectorAll('.cd')].filter(el => el.style.display !== 'none').length, 3);
  d.querySelectorAll('#ch button')[0].click();
  for (let i = 0; i < 6; i++) {
    d.querySelectorAll('#exp .dot')[i].click();
    assert.equal(d.querySelectorAll('#exp .dot')[i].getAttribute('aria-pressed'), 'true');
    assert(d.querySelector('#exc img.can').getAttribute('src').includes(['cherry','lime','orange','grape','lemon','blue-razz'][i]));
  }
  d.querySelector('.ad').click();
  assert.equal(d.querySelector('#cn').textContent, '1');
  assert(d.querySelector('#ts').classList.contains('show'));
  d.querySelector('.bag').click();
  d.querySelector('#ci .q button[data-d="1"]').click();
  assert.equal(d.activeElement.getAttribute('data-d'), '1');
  d.querySelector('#cob').click();
  assert.equal(d.activeElement.name, 'name');
  assert.equal(d.querySelector('#checkout-form').checkValidity(), false);
  d.querySelector('#checkout-form button[type="button"]').click();
  assert.equal(d.activeElement.id, 'cob');
  d.querySelector('#xc').click();
  for (let i = 0; i < 6; i++) w.changeMix(1, 1);
  assert.equal(d.querySelector('#build-add').disabled, false);
  d.querySelector('#build-add').click();
  assert.equal(d.querySelector('#cn').textContent, '8');
  assert.deepEqual(errors, []);
  dom.window.close();
  console.log(`${width}px, reduced motion ${reduced}: interactions passed (no layout engine)`);
}
run(320, false); run(390, true); run(1440, false);
