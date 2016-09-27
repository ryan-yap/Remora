/**
 * Created by KangShiang on 2016-05-09.
 */
var express = require('express');
var passport = require('../passports/passport.js');
var JsonResponse = require('../objects/jsonresponse');
var router = express.Router();
var Token = require('../objects/token');
var Notification = require('../objects/notification');

var apn = require('apn');
var options = {
    cert: __dirname + "/certificates/cert.pem",
    key: __dirname + "/certificates/key.pem",
};
var apnProvider = new apn.Provider(options);

router.get('/:id', function(req, res, next){
    var id = req.params.id;
    var payload = {message : "world"};
    var note = new apn.Notification({
        alert:  "Hello",
    });
    note.sound = "ping.aiff";
    note.badge = 1;
    note.topic = "com.remorapp.carpooling";
    note.payload = payload;
    console.log(id);

    var newNotification = new Notification({
        userID: id,
        notification:note
    });

    newNotification.save(function(err) {
        if (!err) {
            Token.findById(id, function(err, token) {
                if (token != null){
                    if (!err) {
                        console.log(token);
                        var token = token.token
                        var tokens = [token];
                        note.payload.id = newNotification._id;
                        apnProvider.send(note, tokens).then( result => {
                            var json = new JsonResponse(result, "notification", "www.remoraapp.com" + req.originalUrl, req.method, null);
                        res.json(json);
                    });
                    }else{
                        console.log(err);
                        var json = new JsonResponse(null, "notification", "www.remoraapp.com" + req.originalUrl, req.method, "Unable to find token with ID");
                        res.json(json);
                    }
                }else{
                    var json = new JsonResponse(null, "notification", "www.remoraapp.com" + req.originalUrl, req.method, "Unable to find token with ID");
                    res.json(json);
                }
            });
        }else{
            res.statusCode = 400;
            console.log(err);
            var json = new JsonResponse(null, "notification", "www.remoraapp.com" + req.originalUrl, req.method, "Unable to send notification");
            res.json(json);
        }
    })
});

router.get('/',function(req, res, next){
    var id = req.user.facebookID;
    Notification.find({userID:id}, function(err, notifications) {
        if (!err) {
            console.log("Retrieving notifications with ID = " + id);
            var json = new JsonResponse(notifications, "notification", "www.remoraapp.com" + req.originalUrl, req.method, null);
            res.json(json);
        }else{
            console.log(err);
            var json = new JsonResponse(null, "notification", "www.remoraapp.com" + req.originalUrl, req.method, "Error: Unable to retrieve profile");
            res.json(json);
        }
    });
});

router.post('/', ensureAuthenticated, function(req, res, next){
    var data = req.body;
    var user = req.user;
    var id = data.id;
    var payload = {message: data.type};

    var note = new apn.Notification({
        alert:  data.type
    });

    note.sound = "ping.aiff";
    note.badge = 1;
    note.topic = "com.remorapp.carpooling";
    note.payload = payload;

    var newNotification = new Notification({
        userID: id,
        notification:note
    });

    newNotification.save(function(err) {
        if (!err) {
            Token.findById(id, function(err, token) {
                if (token != null){
                    if (!err) {
                        console.log(token);
                        var token = token.token
                        var tokens = [token];
                        note.payload.id = newNotification._id;
                        apnProvider.send(note, tokens).then( result => {
                            var json = new JsonResponse(result, "notification", "www.remoraapp.com" + req.originalUrl, req.method, null);
                        res.json(json);
                    });
                    }else{
                        console.log(err);
                        var json = new JsonResponse(null, "notification", "www.remoraapp.com" + req.originalUrl, req.method, "Unable to find token with ID");
                        res.json(json);
                    }
                }else{
                    var json = new JsonResponse(null, "notification", "www.remoraapp.com" + req.originalUrl, req.method, "Unable to find token with ID");
                    res.json(json);
                }
            });
        }else{
            res.statusCode = 400;
            console.log(err);
            var json = new JsonResponse(null, "notification", "www.remoraapp.com" + req.originalUrl, req.method, "Unable to send notification");
            res.json(json);
        }
    })
});

router.delete('/', ensureAuthenticated, function(req, res,next){
    var data = req.body;
    var id = req.body.id;
    Notification.remove({ _id: id }, function(err) {
        if (!err) {
            var json = new JsonResponse(null, "notification", "www.remoraapp.com" + req.originalUrl, req.method);
            res.json(json);
        }
        else {
            var json = new JsonResponse(null, "notification", "www.remoraapp.com" + req.originalUrl, req.method, "Unable to delete notification");
            res.json(json);
        }
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }
    res.redirect('/');
}

module.exports = router;