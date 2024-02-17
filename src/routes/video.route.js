const router = require("express").Router();
const upload = require("../middlewares/multer.middleware.js");
const { createVideo } = require("../controllers/video.controller.js");
const { verifyJwt } = require("../middlewares/auth.middleware.js");

router
   .route("/uploadVideo")
   .post(
      verifyJwt,
      upload.fields([{ name: "videoFile", maxCount: 1 }]),
      createVideo
   );

module.exports = router;
