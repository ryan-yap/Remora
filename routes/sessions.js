/**
 * Created by KangShiang on 2016-05-09.
 */
var express = require('express');
var passport = require('../passports/passport.js');
var User = require('../objects/user');
var JsonResponse = require('../objects/jsonresponse');
var router = express.Router();

// Deleting a session for the user. Eg. logging the user out.
router.delete('/',ensureAuthenticated, function(req, res, next){
    console.log("Logging out");
    req.logOut();
    console.log("Logging out");
    var json = new JsonResponse(req.user, "session", "www.remoraapp.com" + req.originalUrl, req.method, null);
    res.json(json);
});

function ensureAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }
    res.redirect('/');
}

module.exports = router;