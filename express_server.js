
"Use Strict"

/********************************Page Setup**************************************/ 

const PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.set("view engine", "ejs");

//this is just to make sure that the port is actually "listening".
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

/********************************************************************************/

/*********************************Databases**************************************/
// ***Below is what the data structure looks like***

// let urlDatabase = {
//   "00000001": [{
//     shortURL: "b2xVn2",
//     longURL: "http://www.lighthouselabs.ca"
//   },
//   {
//     shortURL: "9sm5xK",
//     longURL: "http://www.google.com"
//   }]
// }

// let globalUsers = {

//   "00000001": 
//     {id: "00000001", 
//     email: "hark@hark.com", 
//     password: "hark"},

//   "user2RandomID": 
//     {id: "user2RandomID", 
//     email: "user2@example.com", 
//     password: "dishwasher-funk"}
// }

// ***These are the actual consts we're working with***

const globalUsers = {}
const urlDatabase = {}

/********************************************************************************/

/*********************************Notes******************************************/

//get is the handler for requests by the browser
//post is the handler for info from the browser
//The default port is 8080
//curl -Li http://localhost:8080/u/b2xVn2

/********************************************************************************/

/**********************************Get Requests**********************************/

app.get('/', (req, res) => {
  console.log(req.session, "req.session on homepage load")
  console.log('mom i am home',req.session['user_id'])
  let userid = req.session['user_id'];
  console.log('in "/" globalUsers = ', globalUsers, ' urlDatabase = ', urlDatabase);
  res.render('urls_home', {userURLs: urlDatabase[userid],user_id: userid, database: urlDatabase});
});

app.get("/urls/:id", (req, res) => {
  // does this route work the way it should? - sally 
  // I think so, but I will test again - chelsea
  console.log('in the curious /urls/:id route. req.params = ', req.params)
  res.render("urls_show", {shortURL: req.params.id, user_id: req.session["user_id"]});
});

app.get("/u/:shortURL", (req, res) => {
  Object.keys(urlDatabase).forEach(user_id => {
    let userUrls = urlDatabase[user_id]
    userUrls.forEach(url => {
      if (req.params.shortURL === url.shortURL) {
        res.redirect(url.longURL);
      }
    }); 
  });
  
});

app.get("/new", (req, res) => {
  res.render("urls_new",{user_id:req.session["user_id"]});
});

app.get("/register", (req, res) => {
  res.render("urls_register", {user_id:req.session["user_id"]})
});

app.get("/login", (req, res) => {
  res.render("urls_login",{user_id:req.session["user_id"]});
 });

app.get("/logout", (req, res) => {
  res.render("urls_logout", {user_id:req.session["user_id"]})
});

/*******************************************************************************/

/***********************************Post Requests*******************************/

app.post("/urls", (req, res) => {
  let url = {}
  let userid = req.session['user_id']
  url.shortURL = generateRandomString();
  url.longURL = `http://${req.body['longURL']}`;
  if (!urlDatabase[userid]){ //value
     urlDatabase[userid] = [url] //value = something
   } else {urlDatabase[userid].push(url);
  //add something to value
  }
  res.redirect("/");
});

app.post("/register", (req, res) => {
  let new_id = generateUserID();
  let user = {'id': new_id};
  user.email = req.body["email"];
  user.password = bcrypt.hashSync(req.body["password"], 10);
  globalUsers[new_id] = user;
  res.redirect("/");
});

app.post("/urls/:id/delete", (req, res) => {
  let shortURL = req.params.id
  let currentUserUrls = urlDatabase[req.session["user_id"]];
  currentUserUrls.forEach(url=>{
    if (url.shortURL === shortURL ){
      currentUserUrls.splice(currentUserUrls.indexOf(url),1);
      res.redirect("/");
    }
  })
  res.status(404).send("How are you supposed to delete something that isn't there, son?")
  
});

app.post('/urls/:id/update', (req, res) => {
  let user_id = req.session['user_id'];
  let userURLS = urlDatabase[user_id];
  let shortURL = req.params.id;
  userURLS.forEach( (urlObj) => {
    if (shortURL === urlObj['shortURL']) {
      urlObj['longURL'] = req.body.longURL
    }
  });
  res.redirect('/')
});

app.post("/login", (req, res) => {
  req.session.user_id = 0;
  //Object.keys creates an array of all the values so we can
  //forEach, which we pass a new name for the array (userID).
  Object.keys(globalUsers).forEach( (userID) => {
    let userValue = globalUsers[userID];
    if(req.body.username === userValue.email && bcrypt.compareSync(req.body.password, userValue.password)) {
      req.session.user_id = userValue.id;
      return req.session.user_id
    }
  });
  if(req.session.user_id > 0) {
  res.redirect('/')
} else {
  res.status(403).send("You need to check yourself");
}
});

app.post("/logout", (req, res) => {
  req.session = null;
  console.log('post delete WHAT IS IT', req.session)
  res.redirect('/logout');
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