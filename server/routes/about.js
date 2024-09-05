const express = require("express");
const router = express.Router();

router.route("/").get((req, res) => {
  res.render("./about.ejs", { title: "about" });
});

module.exports = router;
