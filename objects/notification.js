/**
 * Created by KangShiang on 2016-05-04.
 */
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/Notification');
var Schema = mongoose.Schema;

var notificationDB = db.model('Notification', new Schema({
    userID: { type: String, required: true, unique: false },
    notification: { type: Object, required: true, unique: false }
}));

// create a schema
module.exports = notificationDB;