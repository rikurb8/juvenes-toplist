var cheerio = require('cheerio');
var request = require('request');
var xml2js = require('xml2js');

module.exports = {
    
    getFood: function () {
        //restaurant id's
        restaurants = {"Newton": "1149", "Newton Fusion": "1187", "Motivaattori": "1674",
            "Zip": "1150", "Rom": "1677", "Edison": "1151", "Voltti": "1675", "Pasta": "1676"};


        var url_start = "http://www.juvenes.fi/tabid/336/moduleid/";
        var url_end = "/RSS.aspx";

        for (restaurant in restaurants) {

            var url = url_start + restaurants[restaurant] + url_end;
            request(url, function (error, response, body) {

                //if we dont get an error, convert the xml to json
                if (!error && response.statusCode == 200) {
                    var parser = new xml2js.Parser();
                    parser.parseString(body, function (err, result) {

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

                            $("ul").each(function () {
                                $(this).find("li").each(function () {
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
}
