const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Connecting to database
mongoose.connect('mongodb://localhost/nodeknowledgebase');
let db = mongoose.connection;

//Check for DB connection
db.once('open', function(){
	console.log('Connected to MongoDB');
})

//Check for DB error
db.on('error', function(err){
	console.log(err);
});

// Init App
const app = express();

//Bring in articles from DB
let Article = require('./models/article');  


// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body parser Middleware
// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
// parse app/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public'))); 


// Home Route
app.get('/', function(req, res){
	Article.find({},function(err, articles){
		if(err){
			console.log(err);
		}
		else{
			res.render('index', {
			title: 'Articles',
			articles: articles
		});
	  }
	});
});

// Single Article Route
app.get('/article/:id', function(req, res){
	Article.findById(req.params.id, function(err, article){
		res.render('article', {
			article: article
		});
	});
});

// Add Route
app.get('/articles/add', function(req, res){
	res.render('articles_add', {
		title: 'Add Articles'
	});
});

//Add article submit POST route
app.post('/articles/add', function(req, res){
	
	let article = new Article();
	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.body;

	article.save(function(err){
		if(err){
			console.log(err);
		}
		else{
			res.redirect('/');
		}
	});
});

// Edit Article Form Route
app.get('/article/edit/:id', function(req, res){
	Article.findById(req.params.id, function(err, article){
		res.render('article_edit', {
			title: 'Edit Article',
			article: article
		});
	});
});

//Edit article submit POST route
app.post('/articles/edit/:id', function(req, res){
	
	let article = {};
	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.body;

	let query = {_id:req.params.id}

	Article.update(query, article, function(err){
		if(err){
			console.log(err);
		}
		else{
			res.redirect('/');
		}
	});
});

// Delete article route
app.delete('/article/:id', function(req, res){
	let query = {_id:req.params.id}

	Article.remove(query, function(err){
		if(err){
			console.log(err);
		}
		else{
			res.send('Deleted Successfully')
		}
	});
}); 

// Starting Server
app.listen(3000, function(){
	console.log('Server started listening on Port 3000... ')
});