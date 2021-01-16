const postcss = require("postcss");
const postcssPresetEnv = require("postcss-preset-env");

const postcssPlugins = [
  postcssPresetEnv({
    stage: 3,
    features: {
      "custom-properties": false,
      "nesting-rules": true,
      autoprefixer: {
        flexbox: "no-2009",
      },
    },
  }),
];

async function processPostcss(css) {
  return new Promise((resolve, _reject) => {
    postcss(postcssPlugins)
      .process(css, { from: "src/app.css", to: "dest/app.css" })
      .then((result) => {
        resolve(result.css);
      });
  });
}

export default processPostcss;
