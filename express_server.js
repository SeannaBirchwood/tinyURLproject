"Use Strict"

/********************************Page Setup**************************************/ 

const PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const textArgs = process.argv.splice(2);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//this is just to make sure that the port is actually "listening".
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

/********************************************************************************/

/*********************************Notes******************************************/

//get is the handler for requests by the browser
//post is the handler for info from the browser
//The default port is 8080
//curl -Li http://localhost:8080/u/b2xVn2

/********************************************************************************/

/**********************************Get Requests**********************************/

//  app.get('/', function(req, res) {
//    res.render('urls_index');
// });

app.get('/about', function(req, res) {
  let urlsIndex = urlDatabase
  res.render('urls_show', urlsIndex);
 });

// app.get("/hello", (req, res) => {
//   res.end("<html><body>Hello <b>World</b></body></html>\n");   //Why is this here??? There's no corresponding page.
// });

app.get('/urls', (req, res) => {
  let templateVars = urlDatabase
  res.render('urls_index', templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.render("urls_show", templateVars);
});

app.get("/new", (req, res) => {
  let newShortUrl = generateRandomString(textArgs);
	res.render("urls_new", newShortUrl);
  urlDatabase.generateRandomString(req) = "req";
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = Object.keys(urlDatabase).forEach(function (key) {
    console.log(data[key]);
  })
  res.redirect(longURL);
});

/*******************************************************************************/

/***********************************Post Requests*******************************/

app.post("/new", (req, res) => {
  let newShortUrl = generateRandomString(textArgs);
  //newShortUrl.generateRandomString()
  res.redirect("urls_show");
  console.log(req);
  console.log(newShortUrl);
});

// app.post("/urls/create", (req, res) => {
// 	console.log(req.body);
// 	res.send("OK")
//   res.redirect("urls_new");
// })

/******************************************************************************/

/**********************************Functions***********************************/

function generateRandomString(textArgs) {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for(let i = 0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text
  
}
console.log(generateRandomString());



//req.body.longUrl

app.get("/u/:shortURL", (req, res) => {
                                             //pseudo: let longURL equal urlDatabase.key.obj
  for (let i = 0; i < urlDatabase.length; i++) {
	let longURL = urlDatabase[i][0];          //indexOf(urlDatabase)
  console.log(longURL);
  }                                           //if req.param.id equals urlDatabase.key
  //if (req.param.id == urlDatabase) {
                                             //if we want the input to redirect to longURL,
  //res.redirect(301, longURL);
});                                        //we shouldn't make the longURL redirect to the input...

