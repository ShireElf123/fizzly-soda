// Optional real-browser regression audit. Set CHROMIUM_PATH to a Chromium executable.
// See README for setup. Serves the checkout locally and supplies GSAP from npm so
// the tests do not depend on CDN availability. It does not replace device testing.
const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const types = { '.html': 'text/html', '.webp': 'image/webp', '.png': 'image/png', '.js': 'application/javascript', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((req, res) => {
  const name = decodeURIComponent((req.url || '/').split('?')[0]);
  const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err, data) => { if (err) { res.writeHead(404).end(); return; } res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }).end(data); });
});
(async () => {
  if (!process.env.CHROMIUM_PATH) throw Error('Set CHROMIUM_PATH to an installed Chromium executable (see README).');
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  try {
    const context = await browser.newContext({ viewport: { width: 320, height: 568 } });
    const page = await context.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.route('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/**', route => route.fulfill({
      path: require.resolve(route.request().url().includes('ScrollTrigger') ? 'gsap/dist/ScrollTrigger.min.js' : 'gsap/dist/gsap.min.js'), contentType: 'application/javascript'
    }));
    // Fonts may load from Google; fallbacks also need to reflow when they cannot.
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2200);
    const intro = await page.evaluate(() => {
      const e = document.querySelector('#ld .l2'), range = document.createRange();
      range.selectNodeContents(e); const r = range.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
    });
    assert(intro.left >= 0 && intro.right <= 320 && intro.top >= 0 && intro.bottom <= 568, 'intro text fits 320px screen');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const [width, height] of [[320, 568], [360, 800], [390, 844], [430, 932], [667, 375], [768, 1024], [820, 800], [821, 800], [1024, 768], [1440, 900]]) {
      await page.setViewportSize({ width, height }); await page.goto(url, { waitUntil: 'domcontentloaded' });
      const m = await page.evaluate(() => {
        const rect = s => { const r = document.querySelector(s).getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom }; };
        return { scroll: document.documentElement.scrollWidth, logo: rect('.logo'), links: rect('#navlk'), controls: rect('nav .r'), can: rect('#hc img'), stage: rect('#stg') };
      });
      assert(m.scroll <= width, `${width}px page reflow`);
      assert(m.logo.left >= 0 && m.controls.right <= width, `${width}px navigation fits`);
      if (width > 820) assert(m.logo.right <= m.links.left && m.links.right <= m.controls.left, `${width}px navigation doesn't overlap`);
      assert(m.can.left >= 0 && m.can.right <= width && m.can.top >= m.stage.top - 2 && m.can.bottom <= m.stage.bottom + 2, `${width}px full hero can`);
      console.log(`${width}×${height}: reflow, navigation and hero passed`);
    }
    await page.setViewportSize({ width: 390, height: 844 }); await page.goto(url, { waitUntil: 'domcontentloaded' });
    for (let i = 0; i < 6; i++) {
      await page.locator('#exp .dot').nth(i).click();
      const m = await page.evaluate(() => {
        const img = document.querySelector('#exc img.can'), r = img.getBoundingClientRect(), s = document.querySelector('#ex').getBoundingClientRect();
        return { loaded: img.complete && img.naturalWidth > 0, fits: r.left >= s.left && r.right <= s.right && r.top >= s.top && r.bottom <= s.bottom };
      });
      assert(m.loaded && m.fits, `mobile explorer can ${i + 1}`);
    }
    await page.locator('.mnu').click(); assert.equal(await page.locator('.mnu').getAttribute('aria-expanded'), 'true');
    await page.locator('.mnu').click(); assert.equal(await page.locator('.mnu').getAttribute('aria-expanded'), 'false');
    await page.locator('.ad').first().click(); assert.equal(await page.locator('#cn').innerText(), '1');
    await page.locator('.bag').click();
    await page.locator('#ci .q button[data-d="1"]').first().click(); assert.equal(await page.evaluate(() => document.activeElement.getAttribute('data-d')), '1');
    await page.locator('#cob').click(); await page.waitForURL('**/cart.html');
    assert.equal(await page.locator('[data-cart-count]').innerText(), '2');
    await page.reload({ waitUntil: 'domcontentloaded' }); assert.equal(await page.locator('[data-cart-count]').innerText(), '2');
    console.log('Mobile flavour, menu, shared cart, focus and persistence passed.');
    // Check that performance suspension and the desktop pinned explorer still work
    // with motion enabled, without changing the original hero/intro animation.
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => getComputedStyle(document.querySelector('#ld')).display === 'none', null, { timeout: 8000 });
    // Check actual can alignment, not GSAP's internal transform, through interaction.
    for (const width of [390, 1440]) {
      await page.setViewportSize({width, height: 900});
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => getComputedStyle(document.querySelector('#ld')).display === 'none', null, { timeout: 8000 });
      await page.waitForTimeout(1500);
      const checkCentered = async label => {
        const delta = await page.evaluate(() => { const a=document.querySelector('#stg').getBoundingClientRect(), c=document.querySelector('#hc img').getBoundingClientRect(); return Math.abs((a.left+a.right-c.left-c.right)/2); });
        assert(delta < 2, `${width}px ${label}: can shifted ${delta}px`);
      };
      await checkCentered('after intro');
      await page.locator('#hero').dispatchEvent('pointermove', { pointerType: 'touch', clientX: width-1, clientY: 400 });
      await page.locator('#hero').dispatchEvent('pointermove', { pointerType: 'mouse', clientX: 1, clientY: 400 });
      await page.waitForTimeout(1400); await checkCentered('after touch and mouse');
      await page.locator('#hc').click(); await page.waitForTimeout(1400); await checkCentered('after can click');
      for(let i=0;i<6;i++){await page.locator('#dt button').nth(i).click(); await page.waitForTimeout(1100); await checkCentered(`after flavour ${i+1}`)}
    }
    await page.setViewportSize({width:390,height:844});
    await page.goto(url, {waitUntil:'domcontentloaded'});
    await page.waitForFunction(() => getComputedStyle(document.querySelector('#ld')).display === 'none', null, {timeout:8000});
    const motionSelectors = ['#mq', '.cd .bd', '#ex .bgf', '.pv .sc'];
    for (const selector of motionSelectors) assert.notEqual(await page.locator(selector).first().evaluate(e => getComputedStyle(e).animationName), 'none', `${selector} animation enabled`);
    await page.locator('#motion-toggle').click();
    assert.equal(await page.locator('#motion-toggle').getAttribute('aria-pressed'), 'true');
    for (const selector of motionSelectors) assert.equal(await page.locator(selector).first().evaluate(e => getComputedStyle(e).animationPlayState), 'paused', `${selector} paused`);
    await page.locator('#motion-toggle').click();
    for (const selector of motionSelectors) assert.equal(await page.locator(selector).first().evaluate(e => getComputedStyle(e).animationPlayState), 'running', `${selector} resumed`);
    await page.locator('#exp .dot').nth(1).click();
    await page.waitForTimeout(100);
    const during = await page.locator('#ex').evaluate(e => getComputedStyle(e).backgroundColor);
    await page.waitForTimeout(750);
    const after = await page.locator('#ex').evaluate(e => getComputedStyle(e).backgroundColor);
    assert.notEqual(during, after, 'flavour background colour transitions');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390, 'animated mobile page has no horizontal overflow');
    await page.locator('#flav').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('#hero').classList.contains('motion-paused'));
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => !document.querySelector('#hero').classList.contains('motion-paused'));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => getComputedStyle(document.querySelector('#ld')).display === 'none', null, { timeout: 8000 });
    const pin = await page.evaluate(() => { const t = ScrollTrigger.getAll().find(x => x.vars.trigger === '#ex'); return t && { start: t.start, end: t.end }; });
    assert(pin && pin.end > pin.start, 'desktop explorer is pinned');
    await page.evaluate(pos => window.scrollTo(0, pos), pin.start + (pin.end - pin.start) * .8);
    await page.waitForFunction(() => document.querySelector('#ext').textContent === 'FLAVOUR 05 / 06');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    for (const selector of motionSelectors) assert.equal(await page.locator(selector).first().evaluate(e => getComputedStyle(e).animationName), 'none', `${selector} respects reduced motion`);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.unrouteAll({ behavior: 'ignoreErrors' });
    await page.route('https://cdnjs.cloudflare.com/**', route => route.abort());
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    assert.equal(await page.locator('#ld').isHidden(), true);
    await page.locator('.ad').first().click();
    assert.equal(await page.locator('#ts').evaluate(e => e.classList.contains('show')), true);
    assert.deepEqual(errors, []);
    console.log('Motion pause/offscreen resume, desktop scroll explorer and blocked-CDN fallback passed.');
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
