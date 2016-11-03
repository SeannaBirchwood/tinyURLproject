
"Use Strict"

/********************************Page Setup**************************************/ 

const PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');
const password = globalUsers.user_id['password'];
const hashed_password = bcrypt.hashSync(password, 10);

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
  "00000001": [{
    shortURL: "b2xVn2",
    longURL: "http://www.lighthouselabs.ca"
  },
  {
    shortURL: "9sm5xK",
    longURL: "http://www.google.com"
  }]
}

let globalUsers = {

  "00000001": 
    {id: "00000001", 
    email: "hark@hark.com", 
    password: "hark"},

  "user2RandomID": 
    {id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"}
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
  let userURLs = urlDatabase;
  let userID = req.cookies['user_id'];
  let templateVars = {userURLs: userURLs,
                      user_id: userID}
  res.render('urls_home', templateVars);
});


app.get('/urls', (req, res) => {
  let userURLs = urlDatabase[req.cookies["user_id"]]
  let userID = globalUsers[req.cookies["user_id"]];
  let templateVars = {userURLs:userURLs,user_id:userID}
  res.render('urls_index', templateVars);
})

app.get("/urls/:id", (req, res) => {
  let shortURL = {
    shortURL: req.params.id,
    user_id: req.cookies["user_id"]
  };
  res.render("urls_show", shortURL);
});

app.get("/new", (req, res) => {
  let newUrl = {
    urlDatabase: uid,
    user_id: req.cookies["user_id"]
  };
  res.render("urls_new", newUrl);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = {
    shortURL: req.params.id,
    user_id: req.cookies["user_id"]
  };
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    user_id: req.cookies["user_id"]
  };
  console.log(templateVars, "Show me user object")
  res.render("urls_register", templateVars)
});

app.get("/login", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    user_id: req.cookies["user_id"]
  };
  res.render("urls_login", templateVars);
 });

/*******************************************************************************/

/***********************************Post Requests*******************************/

app.post("/urls", (req, res) => {
  let url = {}
  let userid = req.cookies['user_id']
  url.shortURL = generateRandomString();
  url.longURL = req.body['longURL'];
  if (!urlDatabase[userid]){ //value
     urlDatabase[userid] = [url] //value = something
   } else {urlDatabase[userid].push(url);
  //add something to value
  }
  console.log(urlDatabase, "This should be the url dict");
  res.redirect("/");
});

app.post("/register", (req, res) => {
  let user = {'id': uid};
  user.email = req.body["email"];
  user.password = req.body["password"];
  globalUsers[uid] = user;
  res.redirect("/");
});

app.post("/urls/:id/delete", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    user_id: req.cookies["user_id"]
  };
  delete urlDatabase[templateVars.shortURL];
  res.redirect("/");
});

app.post('/urls/:id/update', (req, res) => {
  if(urlDatabase[req.params.id]) {
    urlDatabase[req.params.id] = req.body.longURL;
  }
  res.redirect('/')
});

app.post("/login", (req, res) => {
  //Object.keys creates an array of all the values so we can
  //forEach, which we pass a new name for the array (userID).
  Object.keys(globalUsers).forEach( (userID) => {
    let userValue = globalUsers[userID];
    if(req.body.username === userValue.email && req.body.password === userValue.password) {
      res.cookie('user_id', userValue.id);
      res.redirect('/');
    } else {
      res.status(403).send("You need to check yourself")
    }

  })
  
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/');
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

let uid = generateUserID();
let randomURL = generateRandomString();