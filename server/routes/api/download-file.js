const fs = require("fs");
const path = require("path");

const TMP_DIR = "tmp";
const PUBLIC_DIR = path.join(process.cwd(), TMP_DIR);

async function handler(req, res) {
  const { url, params } = req;

  if (!params || !params["0"]) {
    console.log({ url, params });
    res.statusCode = 404;
    res.end();
  } else {
    const filePath = path.join(PUBLIC_DIR, params["0"]);
    res.statusCode = 200;
    res.download(filePath);
  }
}

module.exports = handler;
