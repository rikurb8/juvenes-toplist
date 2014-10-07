var mongoose = require('mongoose');

//restaurants: 1. newton 2. zip 3. edison
var foodSchema = new Schema({
    mainDish: String,
    sideDish1: String,
    sideDish2: String,
    sideDish3: String,
    restaurant: Number,
    serveDate: Date
});

module.exports = mongoose.model('Food', foodSchema);
