const assert = require('node:assert/strict');
const { mkdir, writeFile } = require('node:fs/promises');
const { chromium, webkit } = require('playwright');

// Optional browser verification; start the README's local preview server first.
const baseURL = process.argv[2] || 'http://127.0.0.1:8765';
const results = [];
const unitOpacity = page => page.locator('#english [data-hero-unit]').evaluateAll(units => units.map(unit => Number(getComputedStyle(unit).opacity)));
const complete = async page => {
  for (let attempt = 0; attempt < 80; attempt++) {
    if (await page.locator('[data-hero-unit]').evaluateAll(units => units.every(unit => getComputedStyle(unit).opacity === '1'))) return;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('Text did not reach its final state within 8 seconds');
};
const noOverflow = async page => assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Horizontal overflow');
const check = (browser, name) => { results.push({ browser, check: name, passed: true }); console.log(`${browser}: ${name}`); };

(async () => {
  await mkdir('.tmp/browser-check', { recursive: true });
  for (const [name, engine] of Object.entries({ chromium, webkit })) {
    const browser = await engine.launch({ headless: true });
    try {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference' });
      const page = await context.newPage();
      page.setDefaultTimeout(8000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${baseURL}/examples/reveal-composition.html`);
      const originalBox = await page.locator('#english').boundingBox();
      await page.evaluate(() => document.getAnimations().forEach(animation => { animation.pause(); animation.currentTime = 500; }));
      const opacity = await unitOpacity(page);
      assert(opacity[0] > 0 && opacity[0] < 1 && opacity.at(-1) === 0, 'Character fade is not staggered');
      await page.screenshot({ path: `.tmp/browser-check/${name}-entrance.png` });
      check(name, 'Character opacity progresses in order');
      assert.equal(await page.getByRole('heading', { name: 'Words arrive gently.', exact: true }).count(), 1);
      assert.equal(await page.getByRole('heading', { name: '让文字，慢慢浮现。', exact: true }).count(), 1);
      const unicode = await page.locator('#unicode [data-hero-unit]').allTextContents();
      assert(unicode.includes('é') && unicode.includes('👩🏽‍💻'), 'Grapheme clusters were broken');
      check(name, 'Complete accessible headings and intact CJK/emoji/combining marks');
      const beforeScroll = await page.locator('.cards li').first().evaluate(el => getComputedStyle(el).opacity);
      assert.equal(beforeScroll, '0');
      await page.evaluate(() => document.getAnimations().forEach(animation => animation.finish()));
      await complete(page);
      await page.waitForFunction(() => document.querySelector('#english').dataset.heroSettled === 'true');
      assert.deepEqual(await page.locator('#english').boundingBox(), originalBox, 'Entrance shifted headline layout');
      assert.equal(await page.locator('#english .accent').evaluate(el => getComputedStyle(el).color), 'rgba(0, 0, 0, 0)');
      check(name, 'Completed headline and gradient retain layout');
      await page.locator('.cards').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => [...document.querySelectorAll('.cards li')].every(el => getComputedStyle(el).opacity === '1'));
      await page.evaluate(() => scrollTo(0, 0));
      assert((await unitOpacity(page)).every(value => value === 1));
      await page.screenshot({ path: `.tmp/browser-check/${name}-desktop.png` });
      check(name, 'Bundled scroll reveal works independently and hero does not replay');
      await page.setViewportSize({ width: 360, height: 800 });
      await noOverflow(page);
      await page.screenshot({ path: `.tmp/browser-check/${name}-mobile.png`, fullPage: true });
      check(name, '360px layout has no horizontal overflow');
      await context.close();

      const reduced = await browser.newContext({ reducedMotion: 'reduce' });
      const reducedPage = await reduced.newPage();
      await reducedPage.goto(`${baseURL}/examples/reveal-composition.html`);
      await complete(reducedPage);
      assert.equal(await reducedPage.evaluate(() => document.getAnimations().length), 0);
      assert.equal(await reducedPage.locator('.cards li').first().evaluate(el => getComputedStyle(el).opacity), '1');
      check(name, 'Initial reduced motion shows all text, accent and cards');
      await reduced.close();

      const live = await browser.newContext({ reducedMotion: 'no-preference' });
      const livePage = await live.newPage();
      await livePage.goto(`${baseURL}/examples/reveal-composition.html`);
      await livePage.emulateMedia({ reducedMotion: 'reduce' });
      await complete(livePage);
      await livePage.waitForFunction(() => document.querySelector('#english').dataset.heroSettled === 'true');
      await livePage.waitForFunction(() => document.querySelector('.cards').dataset.revealVisible === 'true');
      assert.equal(await livePage.locator('.cards li').first().evaluate(el => getComputedStyle(el).opacity), '1');
      await livePage.emulateMedia({ reducedMotion: 'no-preference' });
      assert((await unitOpacity(livePage)).every(value => value === 1));
      assert.equal(await livePage.locator('.cards li').first().evaluate(el => getComputedStyle(el).opacity), '1');
      check(name, 'Live reduced-motion change completes both effects without replay');
      await live.close();

      const noJS = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'no-preference' });
      const noJSPage = await noJS.newPage();
      await noJSPage.goto(`${baseURL}/examples/reveal-composition.html`);
      await complete(noJSPage);
      assert.equal(await noJSPage.locator('.cards li').first().evaluate(el => getComputedStyle(el).opacity), '1');
      check(name, 'Without JavaScript, finite CSS entrance completes and cards remain visible');
      await noJS.close();
      assert.deepEqual(errors, [], 'Browser runtime errors');
      check(name, 'No runtime errors in the normal composition');
    } finally { await browser.close(); }
  }
  await writeFile('.tmp/browser-check/results.json', JSON.stringify(results, null, 2));
  console.log(`${results.length} browser scenarios passed.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
