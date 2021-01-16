import fs from "fs";
import path from "path";

const DIRNAME = path.join(
  process.cwd(),
  "template-renderer",
  "src",
  "render-template-page",
  "wrapper-html"
);

const rawWrapper = fs.readFileSync(
  path.join(DIRNAME, "document.html"),
  "utf-8"
);
const cssReset = fs.readFileSync(
  path.join(DIRNAME, "css", "reset.css"),
  "utf-8"
);
const cssGlobals = fs.readFileSync(
  path.join(DIRNAME, "css", "globals.css"),
  "utf-8"
);
const globalCss = [cssReset, cssGlobals];
const emptyWrapper = rawWrapper.replace(
  "/* global-css-replace-target */",
  globalCss.join("\n\n")
);

export default emptyWrapper;
