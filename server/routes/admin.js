const express = require("express");
const bcrypt = require('bcrypt');
const User  = require('../models/userModel');
const router = express.Router();

router.route("/").get((req, res) => {
  res.render("./admin/index.ejs", {
    title: "Admin page",
    layout: "./admin/layouts/main-layout.ejs",
  });
});

router.route("/login")
  .get((req, res) => {
  const message = req.flash("msg");

  res.render("./admin/login.ejs", {
    title: "login",
    layout: "./admin/layouts/main-layout.ejs",
    message
  })
})
  .post(async (req,res) => {
    try {

      const username = await User.findOne({username:req.body.username});
      if (username) {
        console.log(username.password);
        if (await bcrypt.compare(req.body.password,username.password )){
          res.send('Success !');
          return;
        }
      }

      req.flash("msg", "Invalid Credentials");
      res.redirect('/admin/login');
    } catch(err){
      console.log(err);

      req.flash("msg", "Invalid Credentials");
      res.redirect('/admin/login');
    }

  });

module.exports = router;
