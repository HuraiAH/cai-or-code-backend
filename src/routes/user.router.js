const router = require("express").Router();
const upload = require("../middelwares//multer.middleware.js");
const {
   registerUser,
   findUsers,
   loginUser,
   updateUserName,
} = require("../controllers/user.controller.js");
// user register router
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
//user login router
router.route("/login").post(loginUser);
router.route("/").put(updateUserName);

module.exports = router;
