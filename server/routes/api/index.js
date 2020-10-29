const express = require("express");
const renderHtml = require("./render-html");
const renderPdf = require("./render-pdf")
const downloadFile = require("./download-file");
const requestZip = require("./request-zip");
const upload = require('./upload')

const router = express.Router();

//  handle html render requests
router.post("/render-html", renderHtml);

//  handle html to PDF render requests
router.post("/render-pdf", renderPdf);

//  handle file download requests
router.get("/download-file*", downloadFile);

//  handle ZIP creation requests
router.post("/request-zip", requestZip);

//  handle uploads
router.post("/upload", upload);

module.exports = router;
