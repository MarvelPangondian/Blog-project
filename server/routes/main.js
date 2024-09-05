const express = require("express");
const router = express.Router();
const Post = require("../models/postModel.js");

// initial
router.route("/").get(async (req, res) => {
  const currentPage = parseInt(req.query.page) || 1;
  let nextPage;
  const eachPageCount = 6;
  const totalPage = await Post.countDocuments({});

  const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
    .skip((currentPage - 1) * 6)
    .limit(eachPageCount);

  // determine if there is a next page
  const pagesLeft = totalPage - ((currentPage - 1) * 6 + 6);
  if (pagesLeft >= 1) {
    nextPage = currentPage + 1;
  }
  res.render("./index.ejs", {
    title: "main page",
    data,
    currentPage,
    nextPage,
    currentRoute:'home',
  });
});

module.exports = router;
