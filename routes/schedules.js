/**
 * Created by KangShiang on 2016-05-09.
 */
var express = require('express');
var Schedule = require('../objects/schedule');
var JsonResponse = require('../objects/jsonresponse')
var router = express.Router();

//TODO: Reject request that has invalid data.
/**
 * GET a list of matching driver. Matching criteria include origin_location,
 * destination_location, and scheduled time.
 * */
router.get('/match/driver', ensureAuthenticated, function(req, res, next) {
    console.log("Getting Schedule")
    var limit = req.query.limit || 10;
    var maxDistance = req.query.radius || 1;
    //var time = req.query.time*1000;
    maxDistance /= 6371;

    var origin_coords = [];
    origin_coords[0] = parseFloat(req.query.origin_longitude);
    origin_coords[1] = parseFloat(req.query.origin_latitude);

    var destination_coords = [];
    destination_coords[0] = parseFloat(req.query.destination_longitude);
    destination_coords[1] = parseFloat(req.query.destination_latitude);

    var origin_query = {};
    var destination_query = {};
    if(req.query.time != null) {
        var time = parseFloat(req.query.time);
        origin_query = {
            origin_location: {
                $near: origin_coords,
                $maxDistance: maxDistance
            },
            type: "Offer A Ride",
            flexibility_early: {$lte : time},
            flexibility_late:{$gte: time}
        };

        destination_query={
            destination_location: {
                $near: destination_coords,
                $maxDistance: maxDistance
            },
            type: "Offer A Ride",
            flexibility_early: {$lte : time},
            flexibility_late:{$gte: time}
        }
    }else{
        origin_query = {
            origin_location: {
                $near: origin_coords,
                $maxDistance: maxDistance
            },
            type: "Offer A Ride"
        };

        destination_query={
            destination_location: {
                $near: destination_coords,
                $maxDistance: maxDistance
            },
            type: "Offer A Ride"
        }
    }
    console.log("Origin Query");
    console.log(origin_query);
    console.log("Destination Query");
    console.log(destination_query);

    Schedule.find(origin_query,function(err, schedules_with_same_org) {
        if (err) {
            console.log(err);
            var json = new JsonResponse(null, "schedule", "www.remoraapp.com" + req.originalUrl, req.method, "Error: Unable to find schedule from the same origin");
            res.json(json);
        }else{
            console.log(schedules_with_same_org);
            Schedule.find(destination_query,function(err, schedules_with_same_dst) {
                if (err) {
                    console.log(err);
                    var json = new JsonResponse(null, "schedule", "www.remoraapp.com" + req.originalUrl, req.method, "Error: Unable to find schedule to the same destination");
                    res.json(json);
                }else {
                    console.log(schedules_with_same_dst);
                    var rslt = [];

                    for(var i in schedules_with_same_dst){
                        dstID = new String(schedules_with_same_dst[i]._id).valueOf();
                        for(var j in schedules_with_same_org){
                            orgID = new String(schedules_with_same_org[j]._id).valueOf();
                            if(dstID == orgID){
                                rslt.push(schedules_with_same_dst[i]);
                            }
                        }
                    }
                    var json = new JsonResponse(rslt, "schedule", "www.remoraapp.com" + req.originalUrl, req.method, null);
                    res.json(json);
                }
            });
        }
    });
});

/**
 * GET a list of matching passenger. Matching criteria include origin_location,
 * destination_location, and scheduled time.
 * */
router.get('/match/passenger', ensureAuthenticated, function(req, res, next) {
    console.log("Getting Schedule!");
    var limit = req.query.limit || 10;
    var maxDistance = req.query.radius || 1;

    maxDistance /= 6371;

    var origin_coords = [];
    origin_coords[0] = parseFloat(req.query.origin_longitude);
    origin_coords[1] = parseFloat(req.query.origin_latitude);

    var destination_coords = [];
    destination_coords[0] = parseFloat(req.query.destination_longitude);
    destination_coords[1] = parseFloat(req.query.destination_latitude);


    if(req.query.time != null) {
        var time = parseFloat(req.query.time);
        var origin_query = {
            origin_location: {
                $near: origin_coords,
                $maxDistance: maxDistance
            },
            type: "Need A Ride",
            flexibility_early: {$lte : time},
            flexibility_late:{$gte: time}
        };

        var destination_query={
            destination_location: {
                $near: destination_coords,
                $maxDistance: maxDistance
            },
            type: "Need A Ride",
            flexibility_early: {$lte : time},
            flexibility_late:{$gte: time}
        }
    }else{
        var origin_query = {
            origin_location: {
                $near: origin_coords,
                $maxDistance: maxDistance
            },
            type: "Need A Ride"
        };

        var destination_query={
            destination_location: {
                $near: destination_coords,
                $maxDistance: maxDistance
            },
            type: "Need A Ride"
        }
    }
    Schedule.find(origin_query,function(err, schedules_with_same_org) {
        if (err) {
            var json = new JsonResponse(null, "schedule", "www.remoraapp.com" + req.originalUrl, req.method, "Error: Unable to find schedule");
            res.json(json);
        }else{
            Schedule.find(destination_query,function(err, schedules_with_same_dst) {
                if (err) {
                    var json = new JsonResponse(null, "schedule", "www.remoraapp.com" + req.originalUrl, req.method, "Error: Unable to find schedule");
                    res.json(json);
                }else {
                    var rslt = [];

                    for(var i in schedules_with_same_dst){
                        dstID = new String(schedules_with_same_dst[i]._id).valueOf();
                        for(var j in schedules_with_same_org){
                            orgID = new String(schedules_with_same_org[j]._id).valueOf();
                            if(dstID == orgID){
                                rslt.push(schedules_with_same_dst[i]);
                            }
                        }
                    }
                    var json = new JsonResponse(rslt, "schedule", "www.remoraapp.com" + req.originalUrl, req.method, null);
                    res.json(json);
                }
            });
        }
    });
});

/**
 * GET a single schedule given the id.
 * */
router.get('/:id', ensureAuthenticated, function (req, res, next){
    var id = req.params.id;
    Schedule.findById(id, function(err, schedule) {
        if (!err) {
            var json = new JsonResponse(schedule, "schedule", "www.remoraapp.com" + req.originalUrl, req.method, null);
            res.json(json);
        }else{
            var json = new JsonResponse(null, "schedule", "www.remoraapp.com" + req.originalUrl, req.method, "Error: Unable to retrieve schedule");
            res.json(json);
        }
    });
});

/**
 * Get all the drivers' schedules.
 */
router.get('/all/drivers', ensureAuthenticated, function(req, res, next){
    Schedule.find({
        type: "Offer A Ride"
    },function(err, drivers_schedules) {
        if (err) {
            var json = new JsonResponse(null, "schedule", "www.remoraapp.com" + req.originalUrl, req.method, "Error: Unable to find schedule");
            res.json(json);
        } else {
            var json = new JsonResponse(drivers_schedules, "schedule", "www.remoraapp.com" + req.originalUrl, req.method, null);
            res.json(json);
        }
    })
});

/**
 * Get all the passengers' schedules.
 */
router.get('/all/passengers', ensureAuthenticated, function(req, res, next){
    Schedule.find({
        type: "Need A Ride"
    },function(err, drivers_schedules) {
        if (err) {
            var json = new JsonResponse(null, "schedule", "www.remoraapp.com" + req.originalUrl, req.method, "Error: Unable to find schedule");
            res.json(json);
        } else {
            var json = new JsonResponse(drivers_schedules, "schedule", "www.remoraapp.com" + req.originalUrl, req.method, null);
            res.json(json);
        }
    })
});

/**
 * Post a new schedule.
 */
router.post('/', ensureAuthenticated, function(req, res, next) {
    var data = req.body;
    var passengers = [];
    if(data.passengerID != null){
        passengers.push(data.passengerID);
    }

    var newSchedule = new Schedule({
        passengers: passengers,
        driverID : data.driverID,
        created_at: new Date().getTime(),
        time : new Date(data.time*1000).getTime(),
        flexibility_early : new Date(data.flexibility_early*1000).getTime(),
        flexibility_late :  new Date(data.flexibility_late*1000).getTime(),
        number_of_seat : data.number_of_seat,
        type : data.type,
        passenger_fare : data.passenger_fare,
        driver_fare : data.driver_fare,
        accepted : false,
        destination_location: [data.toLongitude, data.toLatitude],
        origin_location: [data.fromLongitude, data.fromLatitude]

    });

    console.log(newSchedule);
    newSchedule.save(function(err) {
        if (!err) {
            var json = new JsonResponse(newSchedule, "schedule", "www.remoraapp.com" + req.originalUrl, req.method, null);
            res.json(json);
        }else{
            res.statusCode = 400;
            console.log(err);
            var json = new JsonResponse(null, "schedule", "www.remoraapp.com" + req.originalUrl, req.method, "Error: Unable to create new schedule");
            res.json(json);
        }
    });

});

//TODO: Create another delete route that takes queries
/**
 * Delete a schedule given an id
 */
router.delete('/:id', ensureAuthenticated, function(req, res, next){
    var id = req.params.id;
    Schedule.findByIdAndRemove(id, function (err,schedule){
        if(err) {
            var json = new JsonResponse(null, "schedule", "www.remoraapp.com" + req.originalUrl, req.method, "Unsuccessful Delete");
            res.json(json);
        }else {
            var json = new JsonResponse(schedule, "schedule", "www.remoraapp.com" + req.originalUrl, req.method, null);
            res.json(json);
        }
    });
});

/**
 * Accept a passenger's request
 */
router.put('/accept/:id/driver', ensureAuthenticated, function(req, res, next){
    var id = req.params.id;
    var userID = req.user[0]._id;
    Schedule.findById(id, function(err, schedule) {
        if (err) {
            var json = new JsonResponse(null, "schedule", "www.remoraapp.com" + req.originalUrl, req.method, "Unable to modify schedule");
            res.json(json);
        }else{
            if(schedule != null) {
                schedule.accepted = true;
                schedule.driverID = userID;
                Schedule.findOneAndUpdate({_id: id}, schedule, {upsert: true}, function (err, doc) {
                    if (err) return res.send(500, {error: err});
                    var json = new JsonResponse(doc, "schedule", "www.remoraapp.com" + req.originalUrl, req.method, null);
                    res.json(json);
                });
            }else{
                var json = new JsonResponse(null, "schedule", "www.remoraapp.com" + req.originalUrl, req.method, "Schedule not found");
                res.json(json);
            }
        }
    });
});

/**
 * Accept a driver's request
 */
router.put('/accept/:id/passenger', ensureAuthenticated, function(req, res, next){
    var id = req.params.id;
    var userID = req.user[0]._id;
    Schedule.findById(id, function(err, schedule) {
        if (err) {
            var json = new JsonResponse(null, "schedule", "www.remoraapp.com" + req.originalUrl, req.method, "Unable to modify schedule");
            res.json(json);
        }else{
            if(schedule != null) {
                schedule.accepted = true;
                if (schedule.passengers.indexOf(userID) < 0) {
                    schedule.passengers.push(userID);
                }
                Schedule.findOneAndUpdate({_id: id}, schedule, {upsert: true}, function (err, doc) {
                    if (err) return res.send(500, {error: err});
                    var json = new JsonResponse(doc, "schedule", "www.remoraapp.com" + req.originalUrl, req.method, null);
                    res.json(json);
                });
            }else{
                var json = new JsonResponse(null, "schedule", "www.remoraapp.com" + req.originalUrl, req.method, "Schedule not found");
                res.json(json);
            }
        }
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }
    console.log("Authentication Failure");
    res.redirect('/');
}

module.exports = router;
