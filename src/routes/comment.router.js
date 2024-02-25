const router = require("express").Router();
const { verifyJwt } = require("../middlewares/auth.middleware");
const {
   addComment,
   updateComment,
   deleteComment,
   getVideoComments,
} = require("../controllers/comment.controller.js");

router
   .route("/comment/:videoId")
   .post(verifyJwt, addComment)
   .get(verifyJwt, getVideoComments);
router
   .route("/comment/:commentId")
   .patch(verifyJwt, updateComment)
   .delete(verifyJwt, deleteComment);

module.exports = router;
