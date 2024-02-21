const {
   toggleLike,
   getLikedVideos,
} = require("../controllers/like.controller");
const { verifyJwt } = require("../middlewares/auth.middleware");

const router = require("express").Router();

router.route("/l/:type/l/:itemId").post(verifyJwt, toggleLike);
router.route("/likes").get(verifyJwt, getLikedVideos);

module.exports = router;
