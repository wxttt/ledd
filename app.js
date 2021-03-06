
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes/index');
var http = require('http');
var path = require('path');
var less = require('express-less');

var app = express();
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var flash = require('connect-flash');


// all environments
app.set('port', process.env.PORT || 7777);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(flash());
app.use(express.favicon(path.join(__dirname, '/public/images/favicon.ico')));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + '/public/images' }));
app.use(express.session({
    secret: settings.cookieSecret,
    key: settings.db,//cookie name
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    store: new MongoStore({
        db: settings.db
    })
}));
app.use(app.router);
app.use('/public/stylesheets', less(__dirname + '/less'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


routes(app);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
