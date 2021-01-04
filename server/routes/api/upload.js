const path = require("path");
const fs = require("fs");
const multer = require("multer");
const slugify = require("slugify");

const TMP_DIR = "tmp";
const PUBLIC_DIR = path.join(process.cwd(), TMP_DIR);

//  Set up upload directory
const uploadDir = path.join(PUBLIC_DIR, "uploads");

try {
  fs.mkdirSync(uploadDir, {recursive: true})
} catch(e) {
  console.error(e)
}

// Set up [multer](https://www.npmjs.com/package/multer) options
var multerStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    console.log({ file });
    cb(null, Date.now() + "-" + slugify(file.originalname, { lower: true }));
  }
});
const multerUploader = multer({ storage: multerStorage }).any();

//  Set up upload handler
function handler(req, res) {
  multerUploader(req, res, function(err) {
    if (err) {
      console.error(err);
      res.json({ error: "Encountered an error. Please check the server logs" });
    }
    // Everything went fine.
    if (req.file) res.json(req.file);
    if (req.files && req.files.length > 0) res.json(req.files[0]);
    else res.json({ file: req.file, files: req.files, body: req.body });
  });
}

module.exports = handler;
