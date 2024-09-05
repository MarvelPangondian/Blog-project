// External packages
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Post = require("../models/postModel.js");
const jwt = require("jsonwebtoken");

// Router initialization
const router = express.Router();

// Middleware
const authenticateWebTokenMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jyuKairosGrace;
    if (!token) {
      return res.redirect("/401");
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = token.usernameId;
    next();
  } catch (err) {
    res.clearCookie("jyuKairosGrace");
    return res.redirect("/401");
  }
};

// Routers

// Main page
router.route("/").get((req, res) => {
  res.render("./admin/index.ejs", {
    title: "Admin page",
    layout: "./admin/layouts/main-layout.ejs",
  });
});

// Login page
router
  .route("/login")
  .get((req, res) => {
    // GET /admin/login

    // Check if jwt exists and valid, if so then redirect to dashboard
    let authenticated;
    const message = req.flash("msg");

    try {
      const token = req.cookies.jyuKairosGrace;
      if (!token) {
        authenticated = false;
      }
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      authenticated = true;
    } catch (err) {
      authenticated = false;
    }

    // render login page if token is invalid
    if (!authenticated) {
      res.render("./admin/login.ejs", {
        title: "login",
        layout: "./admin/layouts/main-layout.ejs",
        message,
      });
      return;
    }

    // redirect to dashboard if token is valid
    res.redirect("/admin/dashboard");
  })

  .post(async (req, res) => {
    // POST admin/login
    // validate username and password

    try {
      const username = await User.findOne({ username: req.body.username }); // finding suitable username

      if (
        username &&
        (await bcrypt.compare(req.body.password, username.password))
      ) {
        // sign token
        const token = jwt.sign(
          { usernameId: username._id },
          process.env.SECRET_KEY,
          { expiresIn: 60 * 60 } // 1 hour
        );

        // store token in cookies
        res.cookie("jyuKairosGrace", token, { httpOnly: true, maxAge: 1000 * 60 * 60  });

        // redirect to dashboard
        res.redirect("/admin/dashboard");
        return;
      }

      // flash invalid credentials
      req.flash("msg", "Invalid Credentials");
      res.redirect("/admin/login");
    } catch (err) {
      console.log(err);

      req.flash("msg", "Invalid Credentials");
      res.redirect("/admin/login");
    }
  });

// Logout
router.route('/logout')
  .get((req,res) => {
    res.clearCookie('jyuKairosGrace');
    res.redirect('/');
  })

// Dashboard
router
  .route("/dashboard")
  .get(authenticateWebTokenMiddleware, async (req, res) => {
    // Paging process
    const currentPage = parseInt(req.query.page) || 1;
    let nextPage;
    const eachPageCount = 6;
    const totalPage = await Post.countDocuments({});
    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip((currentPage - 1) * 6)
      .limit(eachPageCount);

    const pagesLeft = totalPage - ((currentPage - 1) * 6 + 6);
    if (pagesLeft >= 1) {
      nextPage = currentPage + 1;
    }

    res.render("./admin/dashboard", {
      title: "dashboard",
      layout: "./admin/layouts/main-layout.ejs",
      data,
      currentPage,
      nextPage,
    });
  })

  .delete(authenticateWebTokenMiddleware, async (req, res) => {
    await Post.deleteOne({_id : req.body.postId});
    res.redirect('/admin/dashboard');
  })

  .put(authenticateWebTokenMiddleware, (req, res) => {
    res.json({
      postId: req.body.postId,
    });
  });

// Add route
router.route('/add')
  .get(authenticateWebTokenMiddleware, (req,res) => {
    // res.send('inside');
    let message = [];
    res.render('./admin/addPage.ejs', {        
      title: "add",
      layout: "./admin/layouts/main-layout.ejs",
      message});
  })
  .post(authenticateWebTokenMiddleware, async (req,res) => {
    const today = new Date();
    await Post.insertMany([{
      title:req.body.title,
      body:req.body.body,
      createdAt: today,
      updatedAt: today
    }]);
    res.redirect('/admin/dashboard');
  })

module.exports = router;
