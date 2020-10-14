const fs = require("fs")
const path = require("path")
const html2png = require("../utils/html2png")
const format = require("date-fns/format")

const PUBLIC_DIR = path.resolve(__dirname, "../../public");
const RENDER_DIR = "renders";

async function handler(req, res) {
  res.statusCode = 200;

  const { body } = req;
  const { html, clip } = body;
  
  console.log({ html, clip })

  //  Render the .png
  const defaultViewport = {
    width: 3000,
    height: 2000,
    deviceScaleFactor: 2
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
  const fileUrl = path.join("/", RENDER_DIR, fileName);

  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ fileUrl, body, ...clip }));
}

module.exports = handler;
