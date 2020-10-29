const DatauriParser = require("datauri/parser");

function getHtmlDataUri(html) {
  const parser = new DatauriParser();
  parser.format(".html", Buffer.from(html, "utf8"));
  return parser.content;
}

module.exports = getHtmlDataUri