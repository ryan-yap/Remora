/**
 * Created by KangShiang on 2016-05-09.
 */
// Configurting Passport
// var expressSession = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;
//var user_db = require('mongoskin').db('mongodb://54.153.62.38:27017/User');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcrypt-nodejs');
var User = require('../objects/user');
//var Agent = require('../objects/agent')

// Passport Serializer for session
passport.serializeUser(function(user, done) {
    console.log(user);
    done(null, user);
});

// Passport Deserializer for session
passport.deserializeUser(function(obj, done) {
    console.log(obj);
    done(null, obj);
});

passport.use('login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'facebookID',
        passReqToCallback : true
    },
    function(req, username, password, done) {
        // check in mongo if a user with username exists or not
        //var username_in_lower_case = username.toLowerCase();
        //User.findOne({ 'username' :  username },
        //    function(err, user) {
        //        // In case of any error, return using the done method
        //        if (err)
        //            return done(err);
        //        // Username does not exist, log error & redirect back
        //        if (!user){
        //            console.log('User Not Found with username '+username);
        //            return done(null, false,
        //                req.flash('message', 'User Not found.'));
        //        }
        //        // User exists but wrong password, log the error
        //        if (!isValidPassword(user, password)){
        //            console.log('Invalid Password');
        //            return done(null, false,
        //                req.flash('message', 'Invalid Password'));
        //        }
        //        // User and password both match, return user from
        //        // done method which will be treated like success
        //        return done(null, user);
        //    }
        //);
    }));

passport.use('signup', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'facebookID',
            passReqToCallback : true
        },
        function(req, username, facebookID, done) {
            console.log(username);
            console.log(facebookID);

            var d = User.find({username:username, facebookID:facebookID}, function(error, curr_data) {
                if(curr_data.length <= 0) { // check to make sure only unique entries are entered
                    // find a user in Mongo with provided username
                    var newUser = new User({
                        username: username,
                        facebookID: facebookID,
                        created_at : new Date(),
                        rating: 0,
                        rideCompleted:0,
                        address: "",
                        email: "",
                        credit:20,
                        driverProfile:false
                    });
                    newUser.save(function(err) {
                        if (!err) {
                            console.log(newUser);
                            done(null, newUser);
                        }else{
                            console.log("User already exists! Provide a different username");
                            return done(null, false);
                        }
                    });
                }else{
                    console.log("User already created! Now log in");
                    done(null, curr_data);
                }
            });
        }
    )
);


module.exports = passport;