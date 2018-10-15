var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
// var secret = {
//   CLIENT_ID: process.env.CLIENT_ID,
// CLIENT_SECRET: process.env.CLIENT_SECRET
// };
// console.log(secret);
console.log(process.env.CLIENT_ID, process.env.CLIENT_SECRET);


//eventually setup our own user with thefunction
passport.use( new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL:'http://localhost:3000/auth/google/callback'},
  function( req, accessToken, refreshToken, profile, done){
        done( null, profile );
  }
));


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({ secret: 'anything' }));
app.use(passport.initialize());
app.use(passport.session());
//passport uses to place user into the session
//might only want user.id
passport.serializeUser(function( user, done){
  done(null, user)
});

//use findUserByID() before done...
passport.deserializeUser(function( user, done ) {
  done(null, user)
})
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('auth', authRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
