/**
 * Created by KangShiang on 2016-05-04.
 */
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/User');
var Schema = mongoose.Schema;

var userDB = db.model('User', new Schema({
    username: { type: String, required: true, unique: false },
    created_at: { type: Date, required: true, unique: false },
    facebookID: { type: String, required: true, unique: true },
    rating: {type:Number, required:true, unique:false},
    rideCompleted:{type:Number, required:true, unique:false},
    address: {type: String, required: false, unique:false},
    email:{type: String, required:false, unique:false},
    phone_number:{type: String, required: false, unique: false},
    credit:{type: Number, required: true, unique: false},
    driverProfile:{type:Boolean, required:true, unique:false}
}));
// create a schema
module.exports = userDB;