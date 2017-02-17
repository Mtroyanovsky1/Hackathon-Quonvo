var express = require('express');
var router = express.Router();
var models = require('../models');
var User = models.User;

//////////////////////////////// PUBLIC ROUTES ////////////////////////////////
// Users who are not logged in can see these routes

router.get('/', function(req, res, next) {
  res.render('home');
});


///////////////////////////// END OF PUBLIC ROUTES /////////////////////////////

router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

//////////////////////////////// PRIVATE ROUTES ////////////////////////////////
// Only logged in users can see these routes


router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', {
    username: req.user.username,
  });
});


router.get('/:anything', function(req, res) {
  res.redirect('dashboard');
});





///////////////////////////// END OF PRIVATE ROUTES /////////////////////////////

module.exports = router;
