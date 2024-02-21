const router = require("express").Router();
const { verifyJwt } = require("../middlewares/auth.middleware");
const {
   CreatePlaylist,
   getUserPlayList,
   removeVideoFromPlaylist,
   addVideoToPlaylist,
   getPlaylistById,
   deletePlaylist,
   updatePlaylist,
} = require("../controllers/playlist.controller");

router.route("/playlist").post(verifyJwt, CreatePlaylist);

router.route("/p/:userId").get(verifyJwt, getUserPlayList);

router
   .route("/p/:playlistId/v/:videoId")
   .post(verifyJwt, addVideoToPlaylist)
   .patch(verifyJwt, removeVideoFromPlaylist);

router
   .route("/p/:playlistId")
   .delete(verifyJwt, deletePlaylist)
   .patch(verifyJwt, updatePlaylist)
   .get(verifyJwt, getPlaylistById);

module.exports = router;
