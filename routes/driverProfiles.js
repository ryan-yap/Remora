/**
 * Created by KangShiang on 2016-05-09.
 */
var express = require('express');
var passport = require('../passports/passport.js');
var DriverProfile = require('../objects/driverProfile');
var User = require('../objects/user');
var JsonResponse = require('../objects/jsonresponse');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var router = express.Router();
var validData = Object.keys(DriverProfile.schema.paths);
var fs = require('fs');

router.get('/',ensureAuthenticated,function(req, res, next){
    var json = new JsonResponse(null, "driverProfile", "www.remoraapp.com" + req.originalUrl, req.method, null);
    res.json(json);
});

// Deleting a session for the user. Eg. logging the user out.
router.post('/',ensureAuthenticated, validateData, function(req, res, next){
    var data = req.validatedData;
    var user = req.user;
    var newProfile = new DriverProfile({
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
                if (err) return res.send({error: err});
                var json = new JsonResponse(user, "driverProfile", "www.remoraapp.com" + req.originalUrl, req.method, null);
                res.json(json);
            });
            var json = new JsonResponse(newProfile, "driverProfile", "www.remoraapp.com" + req.originalUrl, req.method, null);
            res.json(json);
        }else{
            res.statusCode = 400;
            var json = new JsonResponse(null, "driverProfile", "www.remoraapp.com" + req.originalUrl, req.method, "Unable to save driver's profile");
            res.json(json);
        }
    });
});

router.post('/profile', ensureAuthenticated, upload.single('avatar'), function (req, res, next) {
    fs.writeFile("../../cars/" + req.user.facebookID + "." + req.file.mimetype, req.file, function(err) {
        if(err) {
            var json = new JsonResponse(nil, "driverProfile", "www.remoraapp.com" + req.originalUrl, req.method, "Error Writing to file");
            res.json(json);
            return
        }
        console.log(req.files)
        var json = new JsonResponse("Written to file successfully", "driverProfile", "www.remoraapp.com" + req.originalUrl, req.method, nil);
        res.json(json);
        return
    });
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