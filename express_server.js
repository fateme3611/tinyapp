const cookieParser = require('cookie-parser')
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const generateRandomString = require('./utils/randomGenerator');
const findUserByEmail = require('./utils/findUserByEmail');
const urlsForUser = require('./utils/urlsForUser');


app.set("view engine", "ejs");

const urlDatabase = {
  // "9sm5xK": "http://www.google.com"
  //b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
};
const users = {
  // "userRandomID": {
  //   id: "userRandomID", 
  //   email: "user@example.com", 
  //   password: "purple-monkey-dinosaur"
  // },
};

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());




app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const user = users[req.cookies["user_id"]];
  if (!user) {
    res.redirect('/login');
    return;
  }
  const userUrl = urlsForUser(user.id, urlDatabase);
  const templateVars = { urls: userUrl, user: user };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const url = req.body.longURL;
  const tinyUrl = generateRandomString(6);
  const user = users[req.cookies["user_id"]];
  urlDatabase[tinyUrl] = { longURL: url, userID: user.id };
  res.redirect("/urls/" + tinyUrl);
});

app.get("/urls/new", (req, res) => {
  const user = users[req.cookies["user_id"]];
  if (user) {
    res.render("urls_new", { user: user });
  } else {
    res.redirect('/login');
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.cookies["user_id"]];
  if (!user) {
    res.redirect('/login');
    return;
  }
  const templateVars = { user: user, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL };
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/urls/:shortURL", (req, res) => {
  const user = users[req.cookies["user_id"]];
  if (!user) {
    res.redirect('/login');
    return;
  }

  urlDatabase[req.params.shortURL].longURL = req.body.newUrl;
  res.redirect('/urls');        // Respond with 'Ok' (we will replace this)
});

app.get("/u/:shortURL", (req, res) => {
  const key = req.params.shortURL;
  const longURL = urlDatabase[key].longURL;
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const user = users[req.cookies["user_id"]];
  if (!user) {
    res.redirect('/login');
    return;
  }
  const key = req.params.shortURL;
  delete urlDatabase[key];
  res.redirect('/urls');
});

app.post("/login", (req, res) => {

  const user = findUserByEmail(req.body.username, users);

  if (user && user.id && user.password == req.body.password) {
    res.cookie("user_id", user.id);
    res.redirect('/urls');
    return;
  }

  res.sendStatus(403);
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id")
    .redirect('/urls');
});

app.get('/register', (req, res) => {
  const user = users[req.cookies["user_id"]];
  res.render('register_index', { user: user });
});

app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.sendStatus(400);
    return;
  }

  const user = findUserByEmail(req.body.email, users);


  if (user) {
    res.sendStatus(400);
    return;
  }

  const userId = generateRandomString(6);
  const newUser = {
    id: userId,
    email: req.body.email,
    password: req.body.password
  };
  users[userId] = newUser;
  res.cookie("user_id", userId);
  res.redirect('/urls');
});

app.get("/login", (req, res) => {
  const user = users[req.cookies["user_id"]];
  res.render('urls_login', { user: user });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});