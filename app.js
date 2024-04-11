var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
const { request } = require('http');
var LoginRouter = require('./routes/Login')
var RegisterRouter = require('./routes/Register')
var app = express();
const connectDB = require('./db');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
var cors = require('cors');
const Auth = require('./routes/auth/Auth');
require('dotenv').config();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
connectDB();

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/v1/login', LoginRouter);
app.use('/api/v1/register', RegisterRouter);
app.use('/api/v1', apiRouter);



app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
