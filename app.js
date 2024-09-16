// Load environment variables
require("dotenv").config();

// External packages
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const isCurrentRoute = require('./public/scripts/util')
const path = require('path');

// App initialization
const app = express();

// Database connection
require("./server/config/db.js"); // Connect to the database

// Set port
const PORT = process.env.PORT || 3000;

// Middleware for parsing static files, form data, and JSON
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.locals.isCurrentRoute = isCurrentRoute;

// View engine setup
app.use(expressLayouts);
app.set("views", path.join(  __dirname + "/views" ));

app.set("view engine", "ejs");
app.set("layout", "./layouts/main-layout");

// Cookie and session management
app.use(cookieParser("cookie-secret"));
app.use(
  session({
    secret: "session-secret", // Separate secret for session management
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 6000 }, // 6 seconds for session cookie (e.g., for flash messages)
  })
);

// Middleware
app.use(flash());
app.use(methodOverride("_method"));

// Routes
app.use("/", require("./server/routes/main"));
app.use("/contact", require("./server/routes/contact"));
app.use("/about", require("./server/routes/about"));
app.use("/post", require("./server/routes/post"));
app.use("/search", require("./server/routes/search"));
app.use("/admin", require("./server/routes/admin"));

// 404 error handling
app.use((req, res) => {
  res.status(400).render("./404.ejs", { title: "404 Not Found",currentRoute:'' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
