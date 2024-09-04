const express = require('express');
const router = express.Router();

router.route('/')
  .get((req,res) => {
    res.render('./admin/index.ejs', {title:'Admin page', layout:"./admin/layouts/main-layout.ejs"});
  });

router.route('/login')
  .get((req,res) => {
    res.render('./admin/login.ejs', {title:'login',layout:"./admin/layouts/main-layout.ejs"});
  })

module.exports = router;