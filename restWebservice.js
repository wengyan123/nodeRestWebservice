var express = require('express');
var bodyParser = require('body-parser');
var db = require('./db');

var app = express();
app.set('port', 3300);

//Configuring Express App to make use of BodyParser's JSON parser to parse
//JSON request body
app.use(bodyParser.json());


//Starting up the server on the port: 3300
app.listen(app.get('port'), function(){
   console.log('Server up: http://localhost:' + app.get('port'));
});


//Get all the books
app.get('/book/getall', function(req, res){
   //find all the books 
   db.book.find({}, function(err, result){
      if(err) throw err;
      //save the result into the response object
      res.json(result);
   });
});

//Get the details of the book with the given isbn
app.get('/book/get/:isbn', function(req, res){
   console.log("Fetching details for book with ISBN: " + req.params.isbn);
   //The parameter in the roote is accessed via request.params.object
   db.book.findOne({isbn: req.params.isbn}, function(err, result){
      if (err) throw err;
      res.json(result);
   });
});



//Add a new book 
app.post('/book/add', function(req, res){
   console.log("Adding new book: " + req.body.name);
   var book = new db.book({
      name: req.body.name,
      isbn: req.body.isbn,
      author: req.body.author,
      pages: req.body.pages
   });
   //saving the model instance to the db
   book.save(function(err, result){
      if(err) throw err;
      //After successfully saving the book we generate a JSON response with the message and the inserted book information.
      res.json({
         message:"Successfully added book",
         book:result
      });
   });
});

//update an existing book 
app.put("/book/update/:isbn", function(req, res){
   db.book.findOne({isbn: req.params.isbn}, function(err, result){
      if (err) throw err;
      
      if (!result){
         res.json({
            message: "Book with ISBN: " + req.params.isbn + " not found. ", 
         });
      }
      
      result.name = req.body.name;
      result.isbn = req.body.isbn;
      result.author = req.body.author;
      result.pages = req.body.pages;
   
      result.save(function(err, result){
         if (err) throw err;
         res.json({
            message: "Successsfully updated the book", 
            book: result
         });
      });
   })
});


//Delete an existing book 
app.delete("/book/delete/:isbn", function(req, res){
   db.book.findOneAndRemove({isbn: req.params.isbn}, function(err, result){
      res.json({
         message: "Successfully deleted the book",
         book: result
      });
   });
});

