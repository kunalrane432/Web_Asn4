var mongoose = require('mongoose');
var Schema = mongoose.Schema;
BookSchema = new Schema({
    title : String,
    author : String,
	price: Number,
    "price (including used books)": String,
    pages: String,
    avg_reviews: String,
    n_reviews: String,
    star: String,
    dimensions: String,
    weight: String,
    language: String,
    publisher: String,
    ISBN_13: String,
    complete_link:String
});
module.exports = mongoose.model('Book', BookSchema);