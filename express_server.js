"Use Strict"

/********************************Page Setup**************************************/ 

const PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.set("view engine", "ejs");

//this is just to make sure that the port is actually "listening".
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

/********************************************************************************/

/*********************************Databases**************************************/

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

let globalUsers = {
  "userRandomID": {id: "userRandomID", email: "user@example.com", password: "purple-monkey-dinosaur"},
  "user2RandomID": {id: "user2RandomID", email: "user2@example.com", password: "dishwasher-funk"}
}

/********************************************************************************/

/*********************************Notes******************************************/

//get is the handler for requests by the browser
//post is the handler for info from the browser
//The default port is 8080
//curl -Li http://localhost:8080/u/b2xVn2

/********************************************************************************/

/**********************************Get Requests**********************************/

app.get('/', (req, res) => {
  let urlsIndex = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render('urls_home', urlsIndex);
});

app.get('/urls', (req, res) => {
  let urlsIndex = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render('urls_index', urlsIndex);
})

app.get("/urls/:id", (req, res) => {
  let shortURL = {
    shortURL: req.params.id,
    username: req.cookies["username"]
  };
  res.render("urls_show", shortURL);
});

app.get("/new", (req, res) => {
  let newShortUrl = {
    username: req.cookies["username"]
  };
  res.render("urls_new", newShortUrl);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = {
    shortURL: req.params.id,
    username: req.cookies["username"]
  };
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    username: req.cookies["username"],
  };
  res.render("urls_register", templateVars)
});

// app.get("/login", (req, res) => {

// });

/*******************************************************************************/

/***********************************Post Requests*******************************/

app.post("/urls", (req, res) => {
  urlDatabase[generateRandomString()] = req.body["longURL"];
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  let templateVars = {shortURL: req.params.id};
  delete urlDatabase[templateVars.shortURL];
  res.redirect("/urls");
});

app.post('/urls/:id/update', (req, res) => {
  if(urlDatabase[req.params.id]) {
    urlDatabase[req.params.id] = req.body.longURL;
  }
  res.redirect('/urls')
});

app.post("/login", (req, res) => {
  console.log('post login')
  Object.keys(globalUsers).forEach( (userID) => {
    let userValue = globalUsers[userID];
    if(req.body.username === userValue.email && req.body.password === userValue.password) {
      res.cookie('user_id', userValue.id);
      res.cookie('username', userValue.email);
      res.redirect('/');
    } else {
      res.status(403).send(403, "You need to check yourself")
    }

  })
  
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.clearCookie('username');
  res.redirect('/');
});

app.post("/register", (req, res) => {
  let id = generateUserID();
  let user = {'id': id};
  user.email = req.body["email"];
  user.password = req.body["password"];
  globalUsers[id] = user;
  console.log('in register',globalUsers)
  res.redirect("/");
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

function generateUserID() {
  let text = "";
  let possible = "0123456789";

  for(let i = 0; i < 8; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text
}