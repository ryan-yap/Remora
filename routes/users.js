var express = require('express');
var router = express.Router();
var passport = require('../passports/passport.js')
var JsonResponse = require('../objects/jsonresponse');
var User = require('../objects/user');
var validData = [
    "address",
    "email"
];

/* GET users listing. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  console.log(req.user);
  res.send('respond with a resource');
});

router.post('/',passport.authenticate('signup', { failureRedirect: '/' }),function(req, res, next) {
  console.log("Creating Users");
  var user = req.user;
  var json = new JsonResponse(user, "user", "www.remoraapp.com" + req.originalUrl, req.method, null);
  res.json(json);
});

router.put('/', ensureAuthenticated, validateData, function(req, res, next){
  console.log(req.validatedData);
  user = req.user;
  for (var key in data){
    user[key] = data[key];
  }
  User.findOneAndUpdate({_id: user._id}, user, {upsert: true}, function (err, doc) {
    if (err) return res.send({error: err});
    var json = new JsonResponse(user, "schedule", "www.remoraapp.com" + req.originalUrl, req.method, null);
    res.json(json);
  });
});

router.put('/ride', ensureAuthenticated, function(req, res, next){
  user = req.user;
  data = req.body;
  user.rideCompleted += 1;
  User.findOneAndUpdate({_id: user._id}, user, {upsert: true}, function (err, doc) {
    if (err) return res.send({error: err});
    var json = new JsonResponse(user, "schedule", "www.remoraapp.com" + req.originalUrl, req.method, null);
    res.json(json);
  });
});

router.put('/pay/:id/', ensureAuthenticated,function(req, res, next){
  data = req.body;
  user = req.user;
  var driverID = req.params.id;
  if(data.amount == null){
    var json = new JsonResponse(user, "user", "www.remoraapp.com" + req.originalUrl, req.method, "Invalid Data");
    res.json(json);
  }else{
    user.credit -= data.amount;
    User.findOneAndUpdate({_id: user._id}, user, {upsert: true}, function (err, doc) {
      if (err) return res.send({error: err});
      var rslt = updateDriverCredit(driverID,data.amount);
      if(rslt != null){
        var json = new JsonResponse(null, "user", "www.remoraapp.com" + req.originalUrl, req.method, rslt);
        res.json(json);
      }else {
        var json = new JsonResponse(user, "user", "www.remoraapp.com" + req.originalUrl, req.method, null);
        res.json(json);
      }
    });
  }
});

function updateDriverCredit(driverID, amount){
  User.findById(driverID, function (err, user) {
    if (err) return {error: err};
    user.credit += amount;
    User.findOneAndUpdate({_id: user._id}, user, {upsert: true}, function (err, doc) {
      if (err) return {error: err};
      return null
    });
    return null
  });
}

function validateData(req, res, next) {
  data = req.body;
  var rslt = {};
  for (var key in data)
    if (isDataValid(key)) {
      rslt[key] = data[key];
    } else {
      var json = new JsonResponse(null, "user", "www.remoraapp.com" + req.originalUrl, req.method, "Invalid Data");
      res.json(json);
      return
    }
  req.validatedData = rslt;
  return next();
}

function isDataValid(data){
  return(validData.indexOf(data) >= 0)
}

function ensureAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
