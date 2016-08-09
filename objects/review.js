/**
 * Created by KangShiang on 2016-05-04.
 */
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/Review');
var Schema = mongoose.Schema;

var reviewDB = db.model('Review', new Schema({
    passengerID: { type: String, required: true, unique: false },
    driverID: { type: String, required: true, unique: false },
    review: {type: Number, required : true, unique:false},
    created_at:{type: Date, required: true, unique: false}
}));

// create a schema
module.exports = reviewDB;