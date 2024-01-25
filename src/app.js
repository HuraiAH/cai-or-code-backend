const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
// uses express custom middleware

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

module.exports = app;
