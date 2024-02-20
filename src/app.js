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

// import router
const userRouter = require("./routes/user.router.js");
const videoRouter = require("./routes/video.route.js");
const subscriptionRouter = require("./routes/Subscription.route.js");
const playlistRouter = require("./routes/playlist.route.js");

// use router
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/videos", subscriptionRouter);
app.use("/api/v1", playlistRouter);

module.exports = app;
