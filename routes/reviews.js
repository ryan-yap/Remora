/**
 * Created by KangShiang on 2016-05-09.
 */
var express = require('express');
var passport = require('../passports/passport.js');
var Review = require('../objects/review');
var User = require('../objects/user');
var JsonResponse = require('../objects/jsonresponse');
var router = express.Router();
var validData = Object.keys(Review.schema.paths);

router.get('/',ensureAuthenticated,function(req, res, next){
    var json = new JsonResponse(null, "review", "www.remoraapp.com" + req.originalUrl, req.method, null);
    res.json(json);
});

// Deleting a session for the user. Eg. logging the user out.
router.post('/',ensureAuthenticated, validateData, function(req, res, next){
    var data = req.validatedData;
    var newReview = new Review({
        passengerID: data.passengerID,
        driverID : data.driverID,
        created_at: new Date().getTime(),
        review : data.review
    });

    newReview.save(function(err) {
        if (!err) {
            Review.find({driverID: data.driverID}).sort({created_at: -1}).limit(10).exec(function(err,docs){
                var numEntries = docs.length;
                var sum = 0;
                for(x in docs){
                    sum += docs[x].review
                }
                var newreview = Math.ceil(sum/docs.length);
                var rslt = updateDriverReview(data.driverID, newreview);
                if(rslt != null){
                    var json = new JsonResponse(null, "review", "www.remoraapp.com" + req.originalUrl, req.method, rslt);
                    res.json(json);
                    return
                }
            });
            var json = new JsonResponse(newReview, "review", "www.remoraapp.com" + req.originalUrl, req.method, null);
            res.json(json);
        }else{
            res.statusCode = 400;
            var json = new JsonResponse(null, "review", "www.remoraapp.com" + req.originalUrl, req.method, "Unable to save review");
            res.json(json);
        }
    });
});

function updateDriverReview(driverID, newreview){
    console.log(newreview);
    User.findById(driverID, function (err, user) {
        if (err) return {error: err};
        user.rating = newreview;
        User.findOneAndUpdate({_id: user._id}, user, {upsert: true}, function (err, doc) {
            if (err) return {error: err};
            return null
        });
        return null
    });
}

function ensureAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }
    res.redirect('/');
}

function validateData(req, res, next) {
    data = req.body;
    var rslt = {};
    for (var key in data)
        if (isDataValid(key)) {
            rslt[key] = data[key];
        } else {
            var json = new JsonResponse(null, "review", "www.remoraapp.com" + req.originalUrl, req.method, "Invalid Data");
            res.json(json);
            return
        }
    req.validatedData = rslt;
    return next();
}

function isDataValid(data){
    return(validData.indexOf(data) >= 0)
}

module.exports = router;