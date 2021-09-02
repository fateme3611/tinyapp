const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const generateRandomString = require('./utils/randomGenerator');
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const url = req.body.longURL;
  const tinyUrl = generateRandomString(6);
  urlDatabase[tinyUrl] = url;
  res.redirect("/urls/" + tinyUrl);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
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