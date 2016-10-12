"Use Strict"
//express_server.js
//load the things we need

var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

//set the view engine to ejs

app.set("view engine", "ejs");

//this relates to the body-parser package we installed
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//use res.render to load up an ejs view file

//index page

app.get('/', function(req, res) {
    res.render('pages/index');
});

// about page 
app.get('/about', function(req, res) {
    res.render('pages/about');
});



var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", function(req, res) {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.render("urls_show", templateVars);
});

app.get("/urls/new", (req, res) => {
	res.render("urls_new");
});

app.post("/urls", (req, res) => {
	console.log(req.body); //debug statement to see POST parameters
	res.send("OK"); //respond with 'OK' (we will replace this)
});

//instructions saywe receive POST request "/urls/create"
//which whould generate our shortURL? we can add the new
//pairs to our database?
//so I added this code, and put the previous POST info
//inside it, b/c I don't understand.
app.post("/urls/create", (req, res) => {
	console.log(req.body);
	res.send("OK")
})

//placeholder function for something in the next excercise
// function generateRandomString() {
// 	console.log("I am here. But where is here?")
// }
// console.log(generateRandomString());



app.get("/u/:shortURL", (req, res) => {
	let longURL = req.param.id('something that was about to break');
	res.redirect(302, "/urls:id", longURL);
});




//shortURL


//eventual problem
// <!DOCTYPE html>
// <html lang="en">
// <body>
//     <!-- Write EJS code here to display shortened links -->
// </body>
// </html>
