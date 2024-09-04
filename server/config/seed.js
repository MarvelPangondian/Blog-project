const Post = require("../models/postModel.js");

function getDateNDaysAgoOrAhead(n) {
  const currentDate = new Date();
  const newDate = new Date(currentDate.getTime() + n * 24 * 60 * 60 * 1000);
  return newDate;
}

function generateObjArr() {
  const arr = [];
  for (let i = 0; i < 10; i++) {
    arr.push({
      title: "Lorem Ipsum",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et varius nunc. Duis egestas lorem ligula, ac bibendum massa elementum sit amet. Ut euismod tellus in massa imperdiet molestie. Cras fermentum, elit vel ornare sagittis, quam nibh aliquam odio, quis mattis eros risus eget ligula. Fusce sit amet eros leo. In aliquet lectus vitae turpis hendrerit dapibus. Duis vel varius odio.",
      createdAt: getDateNDaysAgoOrAhead(i * -1),
      updatedAt: getDateNDaysAgoOrAhead(i * -1),
    });
  }
  return arr;
}

const arr = generateObjArr();

const generateSeed = async () => {
  await Post.insertMany(arr);
};

generateSeed().catch((err) => console.log(err));
