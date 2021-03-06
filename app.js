var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var passport = require('./passports/passport')

var routes = require('./routes/index');
var users = require('./routes/users');
var sessions = require('./routes/sessions');
var schedules = require('./routes/schedules');
var reviews = require('./routes/reviews');
var drivers = require('./routes/driverProfiles');
var apns = require('./routes/apns');
var notifications = require('./routes/notifications');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// Configuration for cookie storage.
var MongoStore = require('connect-mongo')(expressSession);
app.use(expressSession({
  name: 'Remora',
  secret: 'a@1s0OIW<cP_9^2',
  duration: 60 * 60 * 24 * 365 * 10 * 1000,
  activeDuration: 60 * 60 * 24 * 365 *10 * 1000,
  saveUninitialized : true,
  resave: true,
  store: new MongoStore({ url: 'mongodb://localhost:27017/Session' })
}));

//Initializing passport
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser('a@1s0OIW<cP_9^2'));


app.use('/', express.static('static'));
app.use('/users', users);
app.use('/sessions', sessions);
app.use('/schedules', schedules);
app.use('/reviews', reviews);
app.use('/drivers', drivers);
app.use('/apns', apns);
app.use('/notifications', notifications);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
