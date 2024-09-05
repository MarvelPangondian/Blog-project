// Load environment variables
require("dotenv").config();

// External packages
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

// App initialization
const app = express();

// Database connection
require("./server/config/db.js"); // Connect to the database

// Set port
const PORT = process.env.PORT || 5000;

// Middleware for parsing static files, form data, and JSON
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View engine setup
app.use(expressLayouts);
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

// Flash messaging middleware
app.use(flash());

// Routes
app.use("/", require("./server/routes/main"));
app.use("/post", require("./server/routes/post"));
app.use("/search", require("./server/routes/search"));
app.use("/admin", require("./server/routes/admin"));

// 404 error handling
app.use((req, res) => {
  res.status(400).render("./404.ejs", { title: "404 Not Found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
