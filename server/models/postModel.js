const mongoose = require("mongoose");

class PostTemplate {
  title;
  body;
  createdAt;
  updatedAt;
}
const PostScheme = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required !"],
  },
  body: {
    type: String,
    required: [true, "body is required !"],
  },
  createdAt: {
    type: Date,
    required: [true, "createdAt is required!"],
  },
  updatedAt: {
    type: Date,
    required: [true, "Updated at is required! "],
  },
});

const Post = mongoose.model("Posts", PostScheme);

module.exports = Post;