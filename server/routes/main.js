const express = require("express");
const router = express.Router();

// initial
router.route("/").get((req,res) => {
  res.render('./index.ejs', {title:'main page'});
});

module.exports = router;