"use strict";
/* app.js
 * Contain server core engine
 * Created by : Webstorm the : 01/07/2016
 * Last update : 14/01/2017
 */

/*
* Modules
*/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var session = require('express-session');
var flash = require('express-flash');
var compression = require('compression');
var fs = require('fs');

/*
* Private modules
*/
var logs_writer = require('./private_modules/logs_writer');
var settings = require('./settings');


//<editor-fold desc="Routes imports">
var index = require('./routes/index');
var audit = require('./routes/audit');
var contact = require('./routes/contact');
//</editor-fold>

var app = express();
app.set('env', 'development'); //set the running environment : 'development' || 'production'


//<editor-fold desc="Express, Jade, SASS, flash engine settings">
//enable default gzip compression for all responses
app.use(compression());

//set the cache control
app.use(express.static(__dirname + '/public', { maxAge: 864000000 })); // 864000000 : ten days


// flash engine setup
app.use(cookieParser(settings.cookie));
app.use(session({secret: settings.session, resave: true, saveUninitialized: true}));
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('node-sass-middleware')
({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));


// display html code indented
if (app.get('env') === 'development')
{
  app.locals.pretty = true;
}

app.use(express.static(path.join(__dirname, 'public')));
//</editor-fold>

//<editor-fold desc=" Routes manager">
app.use('/', index);
app.use('/audit', audit);
app.use('/contact', contact);
//</editor-fold>

//<editor-fold desc="Error Manager">

/*
 * catch 404 and forward to error handler
 * Forbidden some request method
 */
app.use(function(req, res, next)
{
    const ALLOWED_METHODS = ['GET', 'POST', 'HEAD'];

    var err;
    if(ALLOWED_METHODS.indexOf(req.method) === -1)
    {
        err = new Error('Forbidden');
        err.status = 403;
    }
    else
    {
        err = new Error('Not Found');
        err.status = 404;
    }

    next(err);
});

app.use(function(err, req, res, next)
{
  // in case server side error
  if(!err.status)
  {
      // development error handler will print stacktrace
      if (app.get('env') === 'development')
      {
          console.log('\x1b[31m%s\x1b[0m', err.message); // display server side error in red
      }

      // add an entry in log
      logs_writer.write('server', '[server] : ' + err.message);

      // client no needs details (override error)
      err.status = 500;
      err.message = "Internal Server Error";
  }

  // in case of client side error
  if(err.status != 500)
  {
      // add an entry in log
      logs_writer.write('client', "[client] : " +  (err.status || 500) + " - " + err.message);
  }

  // display error to client
  res.status(err.status || 500).render('error', {'message': err.message, 'status': err.status});
});
//</editor-fold>

module.exports = app;
module.exports.env = app.get('env');
