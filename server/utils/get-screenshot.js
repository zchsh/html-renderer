const puppeteer = require("puppeteer");
// We set up a global page object so that we can run
// puppeteer continuously, rather than `.close()`
// and re-launch it on every request
let _page;

async function getPage() {
  if (_page) return _page;
  const options = await getOptions();
  const browser = await puppeteer.launch(options);
  _page = await browser.newPage();
  return _page;
}

async function getScreenshot(html, clip, viewport, type) {
  const page = await getPage();
  await page.setViewport(viewport);
  await page.setContent(html);
  const file = await page.screenshot({ type, omitBackground: true, clip });
  return file;
}

function getOptions() {
  return {
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--font-render-hinting=none",
    ],
    headless: true,
  };
}

module.exports = getScreenshot;
