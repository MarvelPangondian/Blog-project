const express = require("express");
const router = express.Router();
const Post = require("../models/postModel.js");

router.route("/:id").get(async (req, res) => {
  const id = req.params.id;
  const data = await Post.findOne({ _id: id });
  if (!data) {
    res.redirect("/404");
    return;
  }
  res.status(200).render("./post.ejs", { title: data.title, post: data, currentRoute:''});
});

module.exports = router;
