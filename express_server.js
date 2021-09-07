const cookieParser = require('cookie-parser')
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const generateRandomString = require('./utils/randomGenerator');

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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


function findUserByEmail(email) {
  for (let userId in users) {
    let user = users[userId];
    if (user.email == email) {
      return user;
    }
  }
  return null;
}
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { urls: urlDatabase, user: user };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const url = req.body.longURL;
  const tinyUrl = generateRandomString(6);
  urlDatabase[tinyUrl] = url;
  res.redirect("/urls/" + tinyUrl);
});

app.get("/urls/new", (req, res) => {
  const user = users[req.cookies["user_id"]];
  res.render("urls_new", { user: user });
});

app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { user: user, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.newUrl;
  console.log(req.body);  // Log the POST request body to the console
  res.redirect('/urls');        // Respond with 'Ok' (we will replace this)
});
app.get("/u/:shortURL", (req, res) => {
  const key = req.params.shortURL;
  const longURL = urlDatabase[key];
  res.redirect(longURL);
});
app.post("/urls/:shortURL/delete", (req, res) => {
  const key = req.params.shortURL;
  delete urlDatabase[key];
  res.redirect('/urls');
});

app.post("/login", (req, res) => {

  const user = findUserByEmail(req.body.username);

  if (user && user.id) {
    res.cookie("user_id", user.id);
    res.redirect('/urls');
  }

  res.send('invalid user');
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

  const user = findUserByEmail(req.body.email);

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
  console.log(users);
});