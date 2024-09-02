require('dotenv').config();
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

const PORT = process.env.PORT || 5000;

app.use(express.static('public'));

// Template engine
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', './layouts/main-layout');

// routes
app.use('/', require('./server/routes/main'))

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}...`)
});