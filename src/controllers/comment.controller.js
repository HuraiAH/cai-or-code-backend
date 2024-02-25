const asyncHandler = require("../utils/asyncHandler");
const Video = require("../models/video.model");
const Comment = require("../models/comment.model");
const ApiResponse = require("../utils/apiResponse");
const { isValidObjectId } = require("mongoose");
const ApiError = require("../utils/apiError");

exports.addComment = asyncHandler(async (req, res) => {
   // extract video id from req.params
   // find video from video id
   // create new document in content , video id and user id
   // and save this document in database

   const { videoId } = req.params;
   const { content } = req.body;
   if (!isValidObjectId(videoId)) {
      throw new ApiError(405, "invalid video id");
   }

   //    const video = await Video.findById(videoId);
   //    console.log(video._id);
   //    throw new Error("stop");

   const comment = await Comment.create({
      content,
      video: videoId,
      owner: req.user?._id,
   });
   res.status(200).json(
      new ApiResponse(200, comment, "new comment added successfully")
   );
});
exports.updateComment = asyncHandler(async (req, res) => {
   const { commentId } = req.params;
   const { content } = req.body;

   if (!isValidObjectId(commentId)) {
      throw new ApiError(405, "invalid comment id");
   }
   const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $set: { content } },
      { new: true }
   );

   res.status(200).json(
      new ApiResponse(200, updatedComment, "comment updated successfully")
   );
});
exports.deleteComment = asyncHandler(async (req, res) => {
   // TODO: delete a comment
   const { commentId } = req.params;
   if (!isValidObjectId(commentId)) {
      throw new ApiError(405, "invalid comment id");
   }
   await Comment.findByIdAndDelete(commentId);
   res.status(200).json(
      new ApiResponse(200, null, "comment deleted successfully")
   );
});
exports.getVideoComments = asyncHandler(async (req, res) => {
   const { videoId } = req.params;
   const { page = 1, limit = 10 } = req.query;

   try {
      // Validate if videoId is a valid ObjectId
      if (!isValidObjectId(videoId)) {
         return res.status(400).json({ error: "Invalid video ID" });
      }

      // Query comments for the specified video
      const comments = await Comment.find({ video: videoId })
         .populate("owner", "userName") // Assuming a 'user' field in Comment model representing the commenter
         .sort({ createdAt: -1 }) // Sort by creation time in descending order
         .skip((page - 1) * limit)
         .limit(Number(limit))
         .exec();

      res.status(200).json(
         new ApiResponse(200, comments, "this video comment fetched")
      );
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
   }
});
