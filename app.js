
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var cheerio = require('cheerio');
var request = require('request');
var xml2js = require('xml2js');
var mongoose = require("mongoose");


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
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



var Schema = mongoose.Schema;

//restaurants: 1. newton 2. zip 3. edison
var foodSchema = new Schema({
    mainDish: String,
    sideDish1: String,
    sideDish2: String,
    sideDish3: String
    restaurant: Number,
    serveDate: Date
});

var Food = mongoose.model('Food', foodSchema);


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/getmenu', get_menus);
app.get('/users', user.list);



function get_menus() {


//restaurant id's
    restaurants = {"Newton" : "1149", "Newton Fusion" : "1187", "Motivaattori" : "1674",
        "Zip" : "1150", "Rom" : "1677", "Edison" : "1151", "Voltti" : "1675", "Pasta" : "1676"};


    var url_start = "http://www.juvenes.fi/tabid/336/moduleid/";
    var url_end = "/RSS.aspx";

    for (restaurant in restaurants) {

        var url = url_start+restaurants[restaurant]+url_end;
        request(url, function(error, response, body) {

            //if we dont get an error, convert the xml to json
            if (!error && response.statusCode == 200) {
                var parser = new xml2js.Parser();
                parser.parseString(body, function(err, result) {

                    //info for a single restaurant for a ~week
                    restauraunt_info = result.rss.channel[0].item;

                    for (var info in restauraunt_info) {
                        var title = restauraunt_info[info].title[0];
                        var menu_html = restauraunt_info[info].description;
                        $ = cheerio.load(menu_html);

                        //the 3 different types of food are in their own ul's
                        //rohee, reilu, vege
                        console.log('++++++++++++++++++++++');
                        console.log(title);

                        $("ul").each(function() {
                            $(this).find("li").each(function() {
                                console.log($(this).text());
                            });
                            console.log("---------------------");
                        });

                    }

                });
            }

        });

    }
}



get_menus();

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
