const getScreenshot = require("../../utils/get-screenshot");
const renderTemplatePage = require("../../../template-renderer/dist/render-template-page")
  .default;
const parseRequest = require("./parse-request");

async function handler(req, res) {
  const [parsedReq, parseErr] = parseRequest(req);
  if (parseErr) return res.status(500).send(parseErr);
  const { id, fmt, props } = parsedReq;
  //
  // console.log({ id, fmt, props });
  //
  // Generate an HTML document for the component, or error if not possible
  const [templatePage, renderErr] = await renderTemplatePage(id, props);
  if (renderErr) return res.status(500).send(renderErr);
  const { html, width, height } = templatePage;
  //
  // console.log({ html, width, height });
  //
  const viewport = { width, height };
  const clip = { x: 0, y: 0, width, height };
  //  Render the .png
  const file = await getScreenshot(html, clip, viewport, fmt);
  // Send the rendered image
  res.statusCode = 200;
  res.setHeader("Content-Type", `image/png`);
  // Should actually set cache stuff once deploying for realzzz
  // res.setHeader(
  //   "Cache-Control",
  //   `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
  // );
  res.end(file);
}

module.exports = handler;
