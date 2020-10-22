const fs = require("fs")
const path = require("path")
const html2png = require("../../utils/html2png")
const format = require("date-fns/format")

const LIVE_URL = "https://html-renderer.glitch.me"
const DOWNLOAD_ROUTE = "api/download-file"
const TMP_DIR = "tmp";
const PUBLIC_DIR = path.join(process.cwd(), TMP_DIR);
const RENDER_DIR = "renders";

async function renderHtml(req, res) {
  res.statusCode = 200;

  const { body } = req;
  const { html, clip } = body;

  //  Render the .png
  const defaultViewport = {
    width: 3000,
    height: 2000,
    deviceScaleFactor: 1
  };
  const pngStream = await html2png(html, defaultViewport, clip);

  //  Write out the .png
  const datetime = format(new Date(), "yyyy-MM-dd--HH-mm-ss");
  const fileName = `${datetime}--test.png`;
  fs.mkdirSync(path.join(PUBLIC_DIR, RENDER_DIR), { recursive: true})
  const fileOut = path.join(PUBLIC_DIR, RENDER_DIR, fileName);  
  const outputStream = fs.createWriteStream(fileOut);
  await pngStream.pipe(outputStream);

  //  Return the file location as a URL, plus request body data for reference
  const filePath = path.join(RENDER_DIR, fileName);
  const fileUrl = `${LIVE_URL}/${DOWNLOAD_ROUTE}/${filePath}`

  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ fileUrl, ...clip }));
}

module.exports = renderHtml;
