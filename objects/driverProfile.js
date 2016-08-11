/**
 * Created by KangShiang on 2016-05-15.
 */
/**
 * Created by KangShiang on 2016-05-04.
 */
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/DriverProfile');
var Schema = mongoose.Schema;

var driverDB = db.model('DriverProfile', new Schema({
    _id: Number,
    carplate:{type:String,required: false, unique:false},
    carbrand:{type:String, required:false, unique:false},
    model:{type:String, required:false, unique:false},
    color:{type:String, required:false, unique:false},
    year:{type:String, required:false, unique:false},
    doors:{type:Number, required:false, unique:false},
    seats:{type:Number, required:false, unique:false}
}));
// create a schema
module.exports = driverDB;