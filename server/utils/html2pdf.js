const puppeteer = require("puppeteer");
const { Readable } = require("stream");
const html2datauri = require("./html2datauri");

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
      "--font-render-hinting=none"
    ]
  });
  _page = await browser.newPage();
  return _page;
}

/**
 * HTML2PDF receives a string representing an HTML document,
 * and a viewport object representing viewport size and scale,
 * and returns a stream of PDF data representing a render of the page directly after load
 *
 * @param {*} htmlInput - a string of HTML, which includes inline <style /> tags
 * @param {*} viewport - an object { width, height, deviceScaleFactor} that defines the viewport size
 */
async function html2pdf(htmlInput, viewport, width, height) {
  //  Get a puppeteer _page (launch or used already launched instance)
  const page = await getPage();
  await page.setViewport(viewport);
  await page.setDefaultNavigationTimeout(0);

  // Load the input HTML
  const htmlDataUri = html2datauri(htmlInput);
  await page.goto(htmlDataUri, { waitUntil: "networkidle0" });
  //  Generate the PDF
  const pdfBuffer = await page.pdf();
  //  Return the full screenshot as a stream
  const pdfStream = new Readable();
  pdfStream._read = () => {};
  pdfStream.push(pdfBuffer);
  pdfStream.push(null);
  return pdfStream;
}

module.exports = html2pdf;
