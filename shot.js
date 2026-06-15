// Dev-only screenshot helper: node shot.js <output.png> [fullPage] [prepareScript]
import puppeteer from 'puppeteer-core';

const [, , out = 'shot.png', fullPage = 'false', prepare = ''] = process.argv;

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
});

const page = await browser.newPage();
page.on('console', (m) => console.log('[console]', m.type(), m.text()));
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
page.on('requestfailed', (r) => console.log('[reqfail]', r.url(), r.failure()?.errorText));
await page.setViewport({ width: 1440, height: 1000 });
await page.goto(process.env.APP_URL || 'http://localhost:5174', { waitUntil: 'networkidle0', timeout: 30000 });
await page.waitForSelector('.kpi-card', { timeout: 15000 });
if (prepare) {
  await page.evaluate(prepare);
  await new Promise((r) => setTimeout(r, 600));
}
await new Promise((r) => setTimeout(r, 800));
await page.screenshot({ path: out, fullPage: fullPage === 'true' });
await browser.close();
console.log('saved', out);
