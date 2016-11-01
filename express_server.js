"Use Strict"

/********************************Page Setup**************************************/ 

const PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookie = require("cookie-parser");

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookie());
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

app.get('/', (req, res) => {
  let urlsIndex = {urls: urlDatabase};
  res.render('urls_home', urlsIndex);
});

app.get('/urls', (req, res) => {
  let urlsIndex = {urls: urlDatabase};
  res.render('urls_index', urlsIndex);
})

app.get("/urls/:id", (req, res) => {
  let shortURL = {shortURL: req.params.id};
  res.render("urls_show", shortURL);
});

app.get("/new", (req, res) => {
  let newShortUrl = 0
	res.render("urls_new", newShortUrl);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = req.params.id
  res.redirect(longURL);
});

/*******************************************************************************/

/***********************************Post Requests*******************************/

app.post("/urls", (req, res) => {
  urlDatabase[generateRandomString()] = req.body["longURL"];
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  let templateVars = {shortURL : req.params.id};
  delete urlDatabase[templateVars.shortURL];
  res.redirect("/urls");
});

app.post('/urls/:id/update', (req, res) => {
  let longURL = req.params.body;
  res.redirect("/urls");
});

/******************************************************************************/

/**********************************Functions***********************************/

function generateRandomString() {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for(let i = 0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text
}



//req.body.longUrl

// app.get("/u/:shortURL", (req, res) => {
//                                              //pseudo: let longURL equal urlDatabase.key.obj
//   for (let i = 0; i < urlDatabase.length; i++) {
// 	let longURL = urlDatabase[i][0];          //indexOf(urlDatabase)
//   console.log(longURL);
//   }                                           //if req.param.id equals urlDatabase.key
  //if (req.param.id == urlDatabase) {
                                             //if we want the input to redirect to longURL,
  //res.redirect(301, longURL);
//});                                        //we shouldn't make the longURL redirect to the input...

