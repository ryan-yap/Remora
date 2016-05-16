/**
 * Created by KangShiang on 2016-05-04.
 */
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/User');
var Schema = mongoose.Schema;

var userDB = db.model('User', new Schema({
    username: { type: String, required: true, unique: true },
    created_at: { type: Date, required: true, unique: false },
    facebookID: { type: String, required: true, unique: true },
    rating: {type:Number, required:true, unique:false},
    rideCompleted:{type:Number, required:true, unique:false},
    address: {type: String, required: false, unique:false},
    email:{type: String, required:false, unique:true},
    credit:{type: Number, required: true, unique: true},
    driverProfile:{type:Boolean, required:true, unique:false}
}));
// create a schema
module.exports = userDB;