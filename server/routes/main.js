const express = require("express");
const router = express.Router();
const { Post } = require("../models/postModel.js");

// initial
router.route("/").get((req, res) => {
  res.render("./index.ejs", { title: "main page" });
});

router.route("/data").get(async (req, res) => {
  try {
    const currentPage = req.query.page || 1;
    const eachPageCount = 6;
    const howMuchPageToSkip = (currentPage - 1) * 6;
    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(howMuchPageToSkip)
      .limit(eachPageCount);

    res.json(data);
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
