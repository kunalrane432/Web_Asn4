var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
const exphbs = require('express-handlebars');
 
var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

//app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect(database.url);

var Book = require('./models/book');



//Defining the layout engine to redner hbs files
app.engine('.hbs', exphbs.engine({ extname: '.hbs' ,
helpers: {
        strong:function(str){
            
            return (str.title)

           
        }
}}));

//Setting the Layout engine
app.set('view engine', 'hbs');
 
 
//get all books data from db
app.get('/api/books', function(req, res) {
	// use mongoose to get all todos in the database
	Book.find(function(err, books) {
		//if there is an error retrieving, send the error otherwise send data
		//var details=JSON.parse(books[0]);
		//console.log(details);
		//console.log(typeof books[0]);
		if (err)
		//console.log("error"+err)
		res.render('alldata', { message:  'Error Loading the file'+err});

		res.render('alldata', { layout:false,data:books});	
		//res.json(books[0]); // return all books in JSON format
	}).lean();
});

// get a book with ID of 1
app.get('/api/books/:id', function(req, res) {
	let id = req.params.id;
	Book.findById(id, function(err, book) {
		if (err)
			res.send(err)
 
		res.json(book);
	});
 
});


app.get('/add/book/', function(req, res)
    {
        res.render('add_book',{ layout:false});
    }
    
);


// create book and send back all books after creation
app.post('/api/books', function(req, res) {

    // create mongose method to create a new record into collection
    console.log(req.body);

	Book.create({
		title : req.body.title,
		author : req.body.author,
		price : req.body.price,
		//isbn : req.body.isbn
	}, function(err, book) {
		if (err)
			res.send(err);
 
		// get and return all the books after newly created employe record
		Book.find(function(err, books) {
			if (err)
            {
                console.log("Log was created for error")
                res.send(err)
            }

				
			res.json(books);
		});
	});
 
});


// create employee and send back all employees after creation
app.put('/api/books/:id', function(req, res) {
	// create mongose method to update an existing record into collection
    console.log(req.body);

	let id = req.params.id;
	var data = {
		title : req.body.title,
		//author : req.body.author,
		//price : req.body.price,
		//isbn : req.body.isbn
	}

	// save the user
	Book.findByIdAndUpdate(id, data, function(err, book) {
	if (err) throw err;
	
	res.send('Successfully! Book updated - '+book.title);
	});
});

// delete a Book by id
app.delete('/api/books/:id', function(req, res) {
	console.log(req.params.id);
	let id = req.params.id;
	Book.remove({
		_id : id
	}, function(err) {
		if (err)
			res.send(err);
		else
			res.send('Successfully! Book has been Deleted.');	
	});
});

app.listen(port);
console.log("App listening on port : " + port);
