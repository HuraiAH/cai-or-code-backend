const router = require("express").Router();
const upload = require("../middlewares/multer.middleware.js");
const {
   registerUser,
   getCurrentUser,
   loginUser,
   updateUserName,
   logoutUser,
   changeCurrentPassword,
   updateUserAvatar,
   refreshAccessToken,
   getUserChannelProfile,
} = require("../controllers/user.controller.js");
const { verifyJwt } = require("../middlewares/auth.middleware.js");

router.route("/register").post(
   upload.fields([
      { name: "coverImage", maxCount: 1 },
      { name: "avatar", maxCount: 1 },
   ]),
   registerUser
);
router.route("/login").post(loginUser);
router.route("/u/:id").patch(verifyJwt, updateUserName);
router.route("/getUser").get(verifyJwt, getCurrentUser);
router.route("/change-password").post(verifyJwt, changeCurrentPassword);
router
   .route("/change-avatar")
   .patch(verifyJwt, upload.single("avatar"), updateUserAvatar);

router.route("/c/:userName").get(verifyJwt, getUserChannelProfile);

// secret route
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refreshAccessToken").post(refreshAccessToken);

module.exports = router;
