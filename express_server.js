//express_server.js
//load the things we need

var express = require("express");
var app = express();

//set the view engine to ejs

app.set("view engine", "ejs");

//use res.render to load up an ejs view file

//index page

app.get('/', function(req, res) {
    res.render('pages/index');
});

// about page 
app.get('/about', function(req, res) {
    res.render('pages/about');
});

var PORT = process.env.PORT || 8080; // default port 8080

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

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});




//eventual problem
// <!DOCTYPE html>
// <html lang="en">
// <body>
//     <!-- Write EJS code here to display shortened links -->
// </body>
// </html>
