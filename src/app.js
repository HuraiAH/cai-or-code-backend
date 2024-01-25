const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

// uses express custom middleware
app.use(
   cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
   })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

module.exports = app;
