const router = require("express").Router();

const {
   CreatePlaylist,
   getUserPlayList,
   removeVideoFromPlaylist,
   addVideoToPlaylist,
   getPlaylistById,
} = require("../controllers/playlist.controller");
const { verifyJwt } = require("../middlewares/auth.middleware");

router
   .route("/playlist")
   .post(verifyJwt, CreatePlaylist)
   .get(verifyJwt, getPlaylistById);

router.route("/p/:userId").get(verifyJwt, getUserPlayList);

router
   .route("/p/:playlistId/v/:videoId")
   .post(verifyJwt, addVideoToPlaylist)
   .delete(verifyJwt, removeVideoFromPlaylist);

module.exports = router;
