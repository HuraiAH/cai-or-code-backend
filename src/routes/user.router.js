const router = require("express").Router();
const upload = require("../middelwares//multer.middleware.js");
const {
   registerUser,
   getCurrentUser,
   loginUser,
   updateUserName,
   logoutUser,
   changeCurrentPassword,
   updateUserAvatar,
   refreshAccessToken,
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
router.route("/getUser").get(getCurrentUser);
router.route("/change-password").post(verifyJwt, changeCurrentPassword);
router.route("/change-avatar").post(verifyJwt, updateUserAvatar);

// secret route
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refreshAccessToken").post(refreshAccessToken);

module.exports = router;
