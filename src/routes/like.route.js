const { verifyJwt } = require("../middlewares/auth.middleware");
const router = require("express").Router();
const {
   toggleLike,
   getLikedVideos,
} = require("../controllers/like.controller");

router.route("/l/:type/l/:itemId").post(verifyJwt, toggleLike);
router.route("/likes").get(verifyJwt, getLikedVideos);

module.exports = router;
