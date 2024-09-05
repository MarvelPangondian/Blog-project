const express = require("express");
const router = express.Router();

router.route("/").get((req, res) => {
  
  res.render("./contact.ejs", { title: "contact",currentRoute:'contact' });
});

module.exports = router;
