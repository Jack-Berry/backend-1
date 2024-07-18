require("dotenv").config();
const express = require("express");
const app = express();
const users = [];
// const trivia = require('./trivia.json');
// const { attachTrivia } = require("./middleware");

// app.use(attachTrivia);
// app.use("/trivia", require('./routes/trivia'));

function addUser(request, response, next) {
  request.users = users;
  next();
}

app.use(express.json());
app.use(addUser)
app.use("/user", require("./routes/user"));

const port = process.nextTick.PORT | 6001;
app.listen(port);