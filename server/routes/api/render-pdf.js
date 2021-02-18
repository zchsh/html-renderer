const fs = require("fs");
const path = require("path");
const html2pdf = require("../../utils/html2pdf");
const format = require("date-fns/format");

const LIVE_URL = "https://html-renderer.herokuapp.com";
const DOWNLOAD_ROUTE = "api/download-file";
const TMP_DIR = "tmp";
const PUBLIC_DIR = path.join(process.cwd(), TMP_DIR);
const RENDER_DIR = "pdf-renders";

async function renderHtml(req, res) {
  //  @TODO get the name and html from POST body
  const { body } = req;
  const { html, width, height } = body;
  const name = "pdf-test";
  const viewport = { width: 1440, height: 900 };

  //  Render the .pdf
  const pdfStream = await html2pdf(html, viewport, width, height);

  //  Write out the .pdf
  const datetime = format(new Date(), "yyyy-MM-dd-HH-mm-ss");
  const fileName = `${datetime}--${name}.pdf`;
  fs.mkdirSync(path.join(PUBLIC_DIR, RENDER_DIR), { recursive: true });
  const fileOut = path.join(PUBLIC_DIR, RENDER_DIR, fileName);
  const outputStream = fs.createWriteStream(fileOut);
  await pdfStream.pipe(outputStream);

  //  Return the file location as a URL, plus request body data for reference
  const filePath = path.join(RENDER_DIR, fileName);
  const fileUrl = `${LIVE_URL}/${DOWNLOAD_ROUTE}/${filePath}`;

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ fileUrl }));
}

module.exports = renderHtml;
