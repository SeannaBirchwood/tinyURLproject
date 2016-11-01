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
    username: req.cookies["user_id"]
  };
  res.render('urls_home', urlsIndex);
});

app.get('/urls', (req, res) => {
  let urlsIndex = {
    urls: urlDatabase,
    username: req.cookies["user_id"]
  };
  res.render('urls_index', urlsIndex);
})

app.get("/urls/:id", (req, res) => {
  let shortURL = {
    shortURL: req.params.id,
    username: req.cookies["user_id"]
  };
  res.render("urls_show", shortURL);
});

app.get("/new", (req, res) => {
  let newShortUrl = {
    username: req.cookies["user_id"]
  };
  res.render("urls_new", newShortUrl);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = {
    shortURL: req.params.id,
    username: req.cookies["user_id"]
  };
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    username: req.cookies["user_id"],
  };
  res.render("urls_register", templateVars)
});

app.get("/login", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    username: req.cookies["user_id"],
  };
  res.render(urls_login);
});

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
  res.cookie('user_id', req.body.username);
  res.redirect('/');
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/');
});

app.post("/register", (req, res) => {
  let i = 0;
  for( let user in globalUsers ){
    if(globalUsers[user].email === req.body.email)
      {i = 1}
    console.log(globalUsers[user].email)
  }
    if(i === 0){
      let userInfo = {
        'id': randomID, 
        'email': req.body.email, 
        'password': req.body.password
      };
      res.redirect('/');
    } else {
      res.status(400);
      req.flash('loginMessage', 'Email already registered!!')
      res.redirect('/register');
    }
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

const randomID = generateUserID();