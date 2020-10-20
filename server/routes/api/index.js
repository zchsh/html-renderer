const express = require("express");
const renderHtml = require("./render-html")
const downloadFile = require("./download-file")
const requestZip = require("./request-zip")

const router = express.Router();

//  handle html render requests
router.post("/render-html", renderHtml);
router.get("/render-html", (req, res) => res.json({"hello": "render-html"}))

//  handle file download requests
router.get("/download-file*", downloadFile);

//  handle ZIP creation requests
router.post("/request-zip", requestZip);
router.get("/request-zip", (req, res) => res.json({"hello": "request-zip"}))

module.exports = router;