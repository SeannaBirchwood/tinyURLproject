
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

// const password = globalUsers.user_id['password'];
// const hashed_password = bcrypt.hashSync(password, 10);

/********************************************************************************/

/*********************************Notes******************************************/

//get is the handler for requests by the browser
//post is the handler for info from the browser
//The default port is 8080
//curl -Li http://localhost:8080/u/b2xVn2

/********************************************************************************/

/**********************************Get Requests**********************************/

app.get('/', (req, res) => {
  console.log(req.session)
  console.log('mom i am home',req.session['user_id'])
  let userid = req.session['user_id'];
  let userURLs = urlDatabase[userid];
  let database = urlDatabase
  console.log(userURLs + " server userURLs")
  let templateVars = {userURLs: userURLs,
                      user_id: userid,
                      database: database}
  res.render('urls_home', templateVars);
});

app.get('/urls', (req, res) => {
  let userURLs = urlDatabase[req.session["user_id"]]
  let userID = globalUsers[req.session["user_id"]];
  let templateVars = {userURLs:userURLs,user_id:userID}
  res.render('urls_index', templateVars);
})

app.get("/urls/:id", (req, res) => {
  let shortURL = {
    shortURL: req.params.id,
    user_id: req.session["user_id"]
  };
  // let userURLs = urlDatabase;
  // let userID = req.session['user_id'];
  // let templateVars = {userURLs: userURLs,
  //                     user_id: userID}
  res.render("urls_show", shortURL);
});

app.get("/new", (req, res) => {
  
  res.render("urls_new",{user_id:req.session["user_id"]});
});

app.get("/u/:shortURL", (req, res) => {
  let userURLs = urlDatabase;
  Object.keys(userURLs).forEach(urls => {
    let userid = userURLs[urls]
    userid.forEach(url => {
      let shortURL = req.params.shortURL
      let longURL = url['longURL']
      if (shortURL === url['shortURL']) {
      res.redirect(url['longURL']);
      }
    }); 
  });
  
});

app.get("/register", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    user_id: req.session["user_id"]
  };
  res.render("urls_register", templateVars)
});

app.get("/login", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    user_id: req.session["user_id"]
  };
  res.render("urls_login", templateVars);
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
  var new_id = generateUserID();
  let user = {'id': new_id};
  user.email = req.body["email"];
  user.password = bcrypt.hashSync(req.body["password"], 10);
  globalUsers[new_id] = user;
  res.redirect("/");
});

app.post("/urls/:id/delete", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    user_id: req.session["user_id"]
  };
  delete urlDatabase[req.session["user_id"]];
  res.redirect("/");
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
  console.log(urlDatabase[req.session['user_id']])
  res.redirect('/')
});

app.post("/login", (req, res) => {
  //Object.keys creates an array of all the values so we can
  //forEach, which we pass a new name for the array (userID).
 console.log('i am the username in the request',req.body.username);
  Object.keys(globalUsers).forEach( (userID) => {
    let userValue = globalUsers[userID];
    console.log('i am a user value!',userValue)
    if(req.body.username === userValue.email) {
      //&& bcrypt.compareSync(req.body.password, userValue.password)
      console.log('i matched!!!!',userValue.id)
      req.session.user_id = userValue.id;
      console.log('set a cookie',req.session.user_id)
      res.redirect('/');
    } else {
      res.status(403).send("You need to check yourself")
    }

  });
  
});

app.post("/logout", (req, res) => {
  req.session["user_id"] = null;
  console.log('post delete WHAT IS IT ',req.session['user_id'])
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


let randomURL = generateRandomString();