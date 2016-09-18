/**
 * Created by KangShiang on 2016-05-04.
 */
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/Schedule');
var Schema = mongoose.Schema;

// create a schema
var scheduleDB = db.model('Schedule', new Schema({
    passengers: {
        type: [String],
        required: false,
        unique: false
    },
    driverID: { type: String, required: false, unique: false },
    created_at: { type: Number, required: true, unique: false },
    time : { type: Number, required: true, unique: false },
    flexibility_early : {type: Number, required: false, unique : false},
    flexibility_late : {type: Number, required: false, unique : false},
    number_of_seat : {type: Number, required: true, unique : false},
    type : {type : String, required: true, unique: false},
    driver_fare : {type : Number, required: true, unique: false},
    passenger_fare : {type : Number, required: false, unique: false},
    accepted : {type : Boolean, required: true, unique: false},
    origin_location: {
        type: [Number],  // [<longitude>, <latitude>]
        index: '2d',      // create the geospatial index
        required: true,
        unique: false
    },
    destination_location:{
        type: [Number],  // [<longitude>, <latitude>]
        index: '2d',      // create the geospatial index
        required: true,
        unique: false
    },
    origin_address : {type : String, required: false, unique : false},
    destination_address : {type : String, required: false, unique : false}
}));

module.exports = scheduleDB;
