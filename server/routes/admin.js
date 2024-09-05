// External packages
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Post = require("../models/postModel.js");
const jwt = require("jsonwebtoken");

// Router initialization
const router = express.Router();

// tools
const setSuccess = (req, message) => {
  req.flash("msg", message);
  req.flash("msgStatus", "Ok");
};

const setFail = (req, message) => {
  req.flash("msg", message);
  req.flash("msgStatus", "No");
};

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
    currentRoute:''
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
        currentRoute:'',
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
        res.cookie("jyuKairosGrace", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60,
        });

        // redirect to dashboard
        res.redirect("/admin/dashboard");
        return;
      }

      // flash invalid credentials
      setFail(req, "Invalid Credentials");
      res.redirect("/admin/login");
    } catch (err) {
      console.log(err);
      setFail(req, "Invalid Credentials");
      res.redirect("/admin/login");
    }
  });

// Logout
router.route("/logout").get((req, res) => {
  res.clearCookie("jyuKairosGrace");
  res.redirect("/");
});

// Dashboard
router
  .route("/dashboard")
  .get(authenticateWebTokenMiddleware, async (req, res) => {
    const message = req.flash("msg");
    const messageStatus = req.flash("msgStatus");
    
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
      message,
      messageStatus,
      currentRoute:''
    });
  })

  .delete(authenticateWebTokenMiddleware, async (req, res) => {
    try {
      await Post.deleteOne({ _id: req.body.postId });
      setSuccess(req, "Delete successful!");
      res.redirect("/admin/dashboard");
      return;
    } catch (err) {
      setFail(req, "Delete unsuccessful!");
      res.redirect("/admin/dashboard");
    }
  });

// Add route
router
  .route("/add")
  .get(authenticateWebTokenMiddleware, (req, res) => {
    // res.send('inside');
    let message = [];
    res.render("./admin/addPage.ejs", {
      title: "add",
      layout: "./admin/layouts/main-layout.ejs",
      message,
      currentRoute:''
    });
  })
  .post(authenticateWebTokenMiddleware, async (req, res) => {
    const today = new Date();
    try {
      await Post.insertMany([
        {
          title: req.body.title,
          body: req.body.body,
          createdAt: today,
          updatedAt: today,
        },
      ]);
      setSuccess(req,"Added post!");
      res.redirect("/admin/dashboard");
      return;
    } catch (err) {

      setFail(req, "Failed to add post..");
      res.redirect("/admin/dashboard");
    }
  });

// Edit route
router
  .route("/edit/:id")
  .get(authenticateWebTokenMiddleware, async (req, res) => {
    const data = await Post.findOne({ _id: req.params.id });

    res.render("./admin/editPage.ejs", {
      title: "edit",
      layout: "./admin/layouts/main-layout.ejs",
      postId: req.params.id,
      data,
      currentRoute:''
    });
  })
  .put(authenticateWebTokenMiddleware, async (req, res) => {
    try {
      const { title, body } = req.body;
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        { title, body, updatedAt: new Date(), hasBeenUpdated: true }
      );
      setSuccess(req, "Edit successful");
      res.redirect("/admin/dashboard");
    } catch (err) {
      setFail(req, "Edit unsuccessful!");
      res.redirect("/admin/dashboard");
    }
  });

// view post
router
  .route("/post/:id")
  .get(authenticateWebTokenMiddleware, async (req, res) => {
    const id = req.params.id;
    const data = await Post.findOne({ _id: id });
    if (!data) {
      res.redirect("/404");
      return;
    }
    res.status(200).render("./post.ejs", {
      title: data.title,
      post: data,
      layout: "./admin/layouts/main-layout.ejs",
      currentRoute:''
    });
  });

router
  .route("/about")
  .get(authenticateWebTokenMiddleware, async (req, res) => {
    res.status(200).render("./about.ejs", {
      title: 'about',
      layout: "./admin/layouts/main-layout.ejs",
      currentRoute:'about'
    });
  });

router
  .route("/contact")
  .get(authenticateWebTokenMiddleware, async (req, res) => {
    res.status(200).render("./contact.ejs", {
      title: 'contact',
      layout: "./admin/layouts/main-layout.ejs",
      currentRoute:'contact'
    });
  });


module.exports = router;
