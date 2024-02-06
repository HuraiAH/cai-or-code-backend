const router = require("express").Router();
const upload = require("../middelwares//multer.middleware.js");
const {
   registerUser,
   findUsers,
   loginUser,
   updateUserName,
   logoutUser,
} = require("../controllers/user.controller.js");
const { verifyJwt } = require("../middelwares/auth.middelware.js");

router.route("/register").post(
   upload.fields([
      { name: "coverImage", maxCount: 1 },
      { name: "avatar", maxCount: 1 },
   ]),
   registerUser
);
router.route("/login").post(loginUser);
router.route("/:id").put(updateUserName);
router.route("/").get(findUsers);

// secret route
router.route("/logout").post(verifyJwt, logoutUser);

module.exports = router;
