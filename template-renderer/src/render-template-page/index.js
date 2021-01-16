import React from "react";
import fs from "fs";
import path from "path";
import ReactDOMServer from "react-dom/server";
import wrapperHtml from "./wrapper-html";
import processPostcss from "./process-postcss";
//  For now we just have one template
import TestComponent from "./templates/test-component";

const DIR = path.join(
  process.cwd(),
  "template-renderer",
  "src",
  "render-template-page"
);

const templateDict = {
  test: {
    Component: TestComponent,
    cssPath: path.join(DIR, "templates", "test-component", "style.css"),
    width: 200,
    height: 200,
  },
};

async function getTemplatePage(slug, props) {
  // Get the Component and CSS based on the slug
  const template = templateDict[slug];
  if (!template) return [null, `Could not find template  "${slug}"`];
  const { Component, cssPath, width, height } = template;
  // Render the component, with the passed props, and parse CSS
  const componentHtml = ReactDOMServer.renderToString(<Component {...props} />);
  const css = await processPostcss(fs.readFileSync(cssPath, "utf-8"));
  // Populate the wrapper document with the component's markup and CSS
  const html = wrapperHtml
    .replace("<!-- component-html-replace-target -->", componentHtml)
    .replace("/* component-css-replace-target */", css);
  return [
    {
      html,
      width,
      height,
    },
    null,
  ];
}

export default getTemplatePage;
