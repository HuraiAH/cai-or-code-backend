const router = require("express").Router();
const upload = require("../middelwares//multer.middleware.js");
const {
   registerUser,
   findUsers,
} = require("../controllers/user.controller.js");
router
   .route("/register")
   .post(
      upload.fields([
         { name: "coverImage", maxCount: 1 },
         { name: "avatar", maxCount: 1 },
      ]),
      registerUser
   )
   .get(findUsers);

module.exports = router;
