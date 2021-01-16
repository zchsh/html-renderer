// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes/api");
const cors = require("cors");

const app = express();
const port = process.env.PORT;

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.json({ limit: "12mb" }));

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("./server/public"));

// routes
app.use("/api", router);

// send the default landing page
app.get("/", (req, res) => res.json("Index page for html-renderer."));

// listen for requests :)
const listener = app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
