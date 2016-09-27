/**
 * Created by KangShiang on 2016-05-09.
 */
var express = require('express');
var passport = require('../passports/passport.js');
var JsonResponse = require('../objects/jsonresponse');
var router = express.Router();
var Token = require('../objects/token');

var apn = require('apn');
var options = {
    cert: __dirname + "/certificates/cert.pem",
    key: __dirname + "/certificates/key.pem",
};
var apnProvider = new apn.Provider(options);

router.get('/:id', function(req, res, next){
    var id = req.params.id;
    var payload = {message: "Hey, we've found you a driver"};
    var note = new apn.Notification({
        alert:  "Hey, we've found you a driver"
    });
    note.sound = "ping.aiff";
    note.badge = 1;
    note.topic = "com.remorapp.carpooling";
    note.payload = payload;
    console.log(id);
    Token.findById(id, function(err, token) {
        if (token != null){
            if (!err) {
                console.log(token);
                var token = token.token
                var tokens = [token];
                apnProvider.send(note, tokens).then( result => {
                    var json = new JsonResponse(result, "apn", "www.remoraapp.com" + req.originalUrl, req.method, null);
                res.json(json);
            });

            }else{
                console.log(err);
                var json = new JsonResponse(null, "driverProfile", "www.remoraapp.com" + req.originalUrl, req.method, "Unable to find token with ID");
                res.json(json);
            }
        }else{
            var json = new JsonResponse(null, "driverProfile", "www.remoraapp.com" + req.originalUrl, req.method, "Unable to find token with ID");
            res.json(json);
        }
    });
});

router.post('/', ensureAuthenticated, function(req, res, next){
    var data = req.body;
    var id = req.user.facebookID;
    var token = data.token;

    console.log("facebookID is " + id);
    var d = Token.findById(id, function(error, curr_data) {
        console.log(curr_data);
        if (curr_data == null) { // check to make sure only unique entries are entered
            // find a user in Mongo with provided username
            console.log("Token not found");
            var newToken = new Token({
                _id: id,
                token: token
            });

            newToken.save(function(err) {
                if (!err) {
                    var json = new JsonResponse(newToken, "Token", "www.remoraapp.com" + req.originalUrl, req.method, null);
                    res.json(json);
                }else{
                    res.statusCode = 400;
                    console.log(err);
                    var json = new JsonResponse(null, "Token", "www.remoraapp.com" + req.originalUrl, req.method, "Unable to save token");
                    res.json(json);
                }
            });
        }else{
            console.log("Token found");
            var newToken = new Token({
                _id: id,
                token: token
            });
            Token.findOneAndUpdate({_id: id}, newToken, {upsert: true}, function (err, doc) {
                if (err){
                    var json = new JsonResponse(null, "Token", "www.remoraapp.com" + req.originalUrl, req.method, "Unable to save token");
                    res.json(json);
                    return
                }
                var json = new JsonResponse(newToken, "Token", "www.remoraapp.com" + req.originalUrl, req.method, null);
                res.json(json);
            });
        }
    })
});

function ensureAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }
    res.redirect('/');
}

module.exports = router;