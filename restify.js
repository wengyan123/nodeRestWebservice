var restify = require('restify');
var db = require('./db');

var server = restify.createServer({
   name: 'Node REST Webservice Server',
   version: '0.0.1'
});
 
server.use(restify.jsonp());
server.use(restify.bodyParser());


server.listen(3300, function () {
  console.log('%s listening at %s', server.name, server.url);
});

//Get all the books
server.get('/book/getall', function (req, res, next) {
   console.log("Listing all the books");
   //find all the books 
   db.book.find({}, function(err, result){
      if(err) throw err;
      //save the result into the response object
      res.json(result);
   });
  return next();
});



//Get the details of the book with the given isbn
server.get('/book/get/:isbn', function(req, res, next){
   console.log("Fetching details for book with ISBN: " + req.params.isbn);
   //The parameter in the roote is accessed via request.params.object
   db.book.findOne({isbn: req.params.isbn}, function(err, result){
      if (err) throw err;
      res.json(result);
   });
   return next();
});

//Add a new book 
server.post('/book/add', function(req, res, next){
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
   return next();
});

//update an existing book 
server.put("/book/update/:isbn", function(req, res, next){
   console.log("Updating the book:" + req.body.name);
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
   });
   return next();
});

//Delete an existing book 
server.del("/book/delete/:isbn", function(req, res, next){
   console.log("Deleting the book:" + req.body.name);
   db.book.findOneAndRemove({isbn: req.params.isbn}, function(err, result){
      res.json({
         message: "Successfully deleted the book",
         book: result
      });
   });
   return next();
});
