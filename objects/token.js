/**
 * Created by KangShiang on 2016-05-04.
 */
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/Token');
var Schema = mongoose.Schema;

var tokenDB = db.model('Token', new Schema({
    _id: Number,
    token: { type: String, required: true, unique: false }
}));

// create a schema
module.exports = tokenDB;