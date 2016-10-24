var mongoose = require('mongoose');


var dbHost = 'mongodb://localhost:27017/RestWebservice';
mongoose.connect(dbHost);

//create a schema for Book
var bookSchema = mongoose.Schema({
   name: String,
   //also creating index on field isbn
   isbn: {type: String, index: true},
   author: String,
   pages: Number
});

//Create a Model by using the schema defined above
var book = mongoose.model('book', bookSchema);

//connecting to Mongodb instance
mongoose.connection;

exports.mongoose = mongoose;
exports.book = book;
