require("dotenv").config();
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
require("./server/config/db.js"); // connect to database

const PORT = process.env.PORT || 5000;

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}))

// Template engine
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "./layouts/main-layout");

// routes
app.use("/", require("./server/routes/main"));
app.use("/post", require('./server/routes/post'));
app.use('/', (req,res) => {
  res.status(404).render('./404.ejs', {title:'304 Not Found'});
})

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}...`);
});
