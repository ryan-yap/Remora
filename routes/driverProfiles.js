/**
 * Created by KangShiang on 2016-05-09.
 */
var express = require('express');
var passport = require('../passports/passport.js');
var DriverProfile = require('../objects/driverProfile');
var User = require('../objects/user');
var JsonResponse = require('../objects/jsonresponse');
var router = express.Router();
var validData = Object.keys(DriverProfile.schema.paths);
var multer  = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

var upload = multer({ storage: storage });

router.get('/',ensureAuthenticated,function(req, res, next){
    var id = req.user[0].facebookID;
    DriverProfile.findById(id, function(err, driverProfile) {
        if (!err) {
            console.log("Retrieving driver profile with ID = " + id);
            var json = new JsonResponse(driverProfile, "driverProfile", "www.remoraapp.com" + req.originalUrl, req.method, null);
            res.json(json);
        }else{
            console.log(err);
            var json = new JsonResponse(null, "driverProfile", "www.remoraapp.com" + req.originalUrl, req.method, "Error: Unable to retrieve profile");
            res.json(json);
        }
    });
});

router.post('/',ensureAuthenticated, validateData, function(req, res, next){
    var data = req.validatedData;
    var user = req.user[0];
    var newProfile = new DriverProfile({
        _id: user.facebookID,
        carplate:data.carplate,
        carbrand:data.carbrand,
        model:data.model,
        color:data.color,
        year:data.year,
        doors:data.doors,
        seats:data.seats
    });

    user.driverProfile = true;
    newProfile.save(function(err) {
        if (!err) {
            User.findOneAndUpdate({_id: user._id}, user, {upsert: true}, function (err, doc) {
                if (err){
                    var json = new JsonResponse(newProfile, "driverProfile", "www.remoraapp.com" + req.originalUrl, req.method, "Unable to store driver profile");
                    res.json(json);
                    return
                }
                var json = new JsonResponse(newProfile, "driverProfile", "www.remoraapp.com" + req.originalUrl, req.method, null);
                res.json(json);
            });
        }else{
            res.statusCode = 400;
            console.log(err);
            var json = new JsonResponse(null, "driverProfile", "www.remoraapp.com" + req.originalUrl, req.method, "Unable to save driver's profile");
            res.json(json);
        }
    });
});

router.get('/car/uploads', ensureAuthenticated, function (req, res, next) {
    var json = new JsonResponse(null, "driverProfile", "www.remoraapp.com" + req.originalUrl, req.method, null);
    res.json(json);
});

router.post('/car/uploads', ensureAuthenticated, upload.single('avatar'), function (req, res, next) {
    var json = new JsonResponse(null, "driverProfile", "www.remoraapp.com" + req.originalUrl, req.method, null);
    res.json(json);
});

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
            var json = new JsonResponse(null, "driverProfile", "www.remoraapp.com" + req.originalUrl, req.method, "Invalid Data");
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
