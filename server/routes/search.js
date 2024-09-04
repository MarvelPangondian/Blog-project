const express = require("express");
const router = express.Router();
const Post = require("../models/postModel.js");

router.route("/").get(async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;
    const currentPage = parseInt(req.query.page) || 1;
    let nextPage;
    const perPage = 6;
    const pageNeedToSkip = (currentPage - 1) * perPage;

    // removing special Characters
    let cleanedString = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    let posts = await Post.find({
      $or: [
        { title: { $regex: new RegExp(cleanedString, "i") } },
        { body: { $regex: new RegExp(cleanedString, "i") } },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(pageNeedToSkip)
      .exec();

    const data = posts.length <= perPage ? posts : posts.slice(0, perPage);
    if (posts.length - data.length > 0) {
      nextPage = currentPage + 1;
    }

    res.render("./search.ejs", {
      title: "search results",
      searchTerm,
      data,
      currentPage,
      nextPage,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/404");
  }
});

module.exports = router;
