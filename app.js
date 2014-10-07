
/**
 * Module dependencies.
 */

var express = require('express');
//var routes = require('./routes');
//var user = require('./routes/user');
var http = require('http');
var path = require('path');
var cheerio = require('cheerio');
var request = require('request');
var xml2js = require('xml2js');
var mongoose = require("mongoose");
var foodscaper = require('./foodscraper');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


//db
mongoose.connect('mongodb://localhost:27017/juvenes');
var db = mongoose.connection;
db.once('open', function callback () {
    console.log("We have connection");
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
//app.get('/', get_menus);

app.get('/', function(err, res) {
   console.log("yolo");
   res.send("Viikon kierto!");
});

app.get('/food', function(err, res) {
    foodscaper.getFood();
    res.send('cholo');
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
