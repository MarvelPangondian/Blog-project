require("dotenv").config();
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
require('./server/config/db.js'); // connect to database
const {Post} = require('./server/models/postModel.js');

const PORT = process.env.PORT || 5000;

app.use(express.static("public"));

// Template engine
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "./layouts/main-layout");

// routes
app.use("/", require("./server/routes/main"));

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}...`);
});
