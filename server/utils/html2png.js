const puppeteer = require("puppeteer");
const { Readable } = require("stream");
const DatauriParser = require("datauri/parser");

// We set up a global page object so that we can run
// puppeteer continuously, rather than `.close()`
// and re-launch it on every request
let _page;

async function getPage() {
  if (_page) return _page;
  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--font-render-hinting=none",
    ],
  });
  _page = await browser.newPage();
  return _page;
}

/**
 * HTML2PNG receives a string representing an HTML document,
 * and a viewport object representing viewport size and scale,
 * and returns a stream of PNG data representing a render of the page directly after load
 *
 * @param {*} htmlInput - a string of HTML, which includes inline <style /> tags
 * @param {*} viewport - an object { width, height, deviceScaleFactor} that defines the viewport size
 */
async function html2png(htmlInput, viewport, clip) {
  //  Get a puppeteer _page (launch or used already launched instance)
  const page = await getPage();
  await page.setViewport(viewport);
  await page.setDefaultNavigationTimeout(0);

  //  Request interception is useful for debugging
  // Allows you to intercept a request; must appear before
  // your first page.goto()
  await page.setRequestInterception(true);
  // Request intercept handler... will be triggered with
  // each page.goto() statement
  page.on("request", (interceptedRequest) => {
    const { _url } = interceptedRequest;
    console.log({ _url });
    interceptedRequest.continue();
  });

  // Load the input HTML
  const htmlDataUri = getHtmlDataUri(htmlInput);
  await page.goto(htmlDataUri, { waitUntil: "networkidle0" });
  //  Take the screenshot
  const screenshot = await page.screenshot({
    type: "png",
    omitBackground: true,
    clip,
  });
  //  Return the full screenshot as a stream
  const pngStream = new Readable();
  pngStream._read = () => {};
  pngStream.push(screenshot);
  pngStream.push(null);
  return pngStream;
}

function getHtmlDataUri(html) {
  const parser = new DatauriParser();
  parser.format(".html", Buffer.from(html, "utf8"));
  return parser.content;
}

module.exports = html2png;
