// app.js

const express = require('express');
const app = express();
const port = 3000;

const postsRouter = require("./routes/posts.js");
const commentsRouter = require("./routes/comments.js");

const connect = require('./routes/index.js')
connect()

app.use(express.json());

// localhost:3000/ => postsRouter, commentsRouter
app.use("/", [postsRouter, commentsRouter]);

app.listen(port, () => {
  console.log(port, '=> server open!');
});
