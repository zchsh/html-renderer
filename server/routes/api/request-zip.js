const path = require("path");
const util = require("util");
const format = require("date-fns/format");
const { exec } = require("child_process")
const execPromise = util.promisify(exec);

const LIVE_URL = "https://html-renderer.glitch.me"
const DOWNLOAD_ROUTE = "api/download-file"
const TMP_DIR = "tmp";
const PUBLIC_DIR = path.join(process.cwd(), TMP_DIR);
const RENDER_DIR = "renders";

const FILE_ROUTE = "/api/download-file";

async function handler(req, res) {
  const { fileUrls } = req.body;

  const filePaths = fileUrls.map(urlString =>
    urlString.replace(LIVE_URL, "").replace(FILE_ROUTE + "/" + RENDER_DIR, ".")
  );

  const datetime = format(new Date(), "yyyy-MM-dd--HH-mm-ss");
  const zipFilename = `${datetime}_zipped-assets.zip`;

  const cdCommand = `cd ${path.join(PUBLIC_DIR, RENDER_DIR)}`;
  const zipCommand = `zip ./${zipFilename} ${filePaths.join(" ")}`;
  
  const fileUrl = `${LIVE_URL}/${DOWNLOAD_ROUTE}/${RENDER_DIR}/${zipFilename}`
  
  const { stdout, stderr } = await execPromise(`${cdCommand} && ${zipCommand}`)

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({ cdCommand, zipFilename, filePaths, zipCommand, fileUrl });
}

module.exports = handler;
