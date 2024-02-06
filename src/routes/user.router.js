const router = require("express").Router();
const upload = require("../middelwares//multer.middleware.js");
const {
   registerUser,
   findUsers,
   loginUser,
   updateUserName,
} = require("../controllers/user.controller.js");
// user register router
router.route("/register").post(
   upload.fields([
      { name: "coverImage", maxCount: 1 },
      { name: "avatar", maxCount: 1 },
   ]),
   registerUser
);
//user login router
router.route("/login").post(loginUser);
router.route("/:id").put(updateUserName);
router.route("/").get(findUsers);

module.exports = router;
