const { isValidObjectId } = require("mongoose");
const Like = require("../models/like.model.js");
const ApiResponse = require("../utils/apiResponse.js");
const ApiError = require("../utils/apiError.js");
const asyncHandler = require("../utils/asyncHandler.js");

exports.toggleLike = asyncHandler(async (req, res) => {
   const { type, itemId } = req.params;

   // Validate if itemId is a valid ObjectId
   if (!isValidObjectId(itemId)) {
      throw new ApiError(400, "Invalid item ID");
   }

   try {
      let likeableItem;
      let likedBy;

      switch (type) {
         case "video":
            likeableItem = "Video";
            likedBy = "User";
            break;
         case "comment":
            likeableItem = "Comment";
            likedBy = "User";
            break;
         case "tweet":
            likeableItem = "Tweet";
            likedBy = "User";
            break;
         default:
            throw new ApiError(400, "Invalid likeable type");
      }

      // Check if the user has already liked the item
      const existingLike = await Like.findOne({
         [type]: itemId,
         likedBy: req.user._id,
      });

      if (existingLike) {
         // User already liked the item, so unlike it
         await existingLike.remove();
         return res
            .status(200)
            .json(
               new ApiResponse(200, null, `${likeableItem} unlike successfully`)
            );
      }

      // User has not liked the item, so create a new like
      const newLike = new Like({
         [type]: itemId,
         likedBy: req.user._id,
      });

      await newLike.save();
      res.status(200).json(
         new ApiResponse(200, null, `${likeableItem} liked successfully`)
      );
   } catch (error) {
      console.error(error);
      throw new ApiError(500, "Internal Server Error");
   }
});

exports.toggleTweetLike = asyncHandler(async (req, res) => {
   const { tweetId } = req.params;
   // Validate if tweetId is a valid ObjectId
   if (!isValidObjectId(tweetId)) {
      throw new ApiError(400, "Invalid tweet ID");
   }
   //Check if the user has already liked the tweet
   const exitingLike = await Like.findOne({ tweetId, likedBy: req.user?._id });
   if (exitingLike) {
      await exitingLike.remove();
      return res
         .status(200)
         .json(new ApiResponse(200, null, "Video unliked successfully"));
   }
   const newLike = new Like({ tweetId, likedBy: req.user?._id });
   await newLike.save();
   return res
      .status(200)
      .json(new ApiResponse(200, null, "Video liked successfully"));
});

exports.toggleVideoLike = asyncHandler(async (req, res) => {
   const { videoId } = req.params;
   // Validate if videoId is a valid ObjectId
   if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid tweet ID");
   }
   //Check if the user has already liked the tweet
   const exitingLike = await Like.findOne({ videoId, likedBy: req.user?._id });
   if (exitingLike) {
      await exitingLike.remove();
      return res
         .status(200)
         .json(new ApiResponse(200, null, "Video unliked successfully"));
   }
   const newLike = new Like({ videoId, likedBy: req.user?._id });
   await newLike.save();
   return res
      .status(200)
      .json(new ApiResponse(200, null, "Video liked successfully"));
});

exports.getLikedVideos = asyncHandler(async (req, res) => {
   try {
      // Find all likes by the user
      const userLikes = await Like.find({ likedBy: req.user._id })
         .populate("video")
         .exec();

      // Extract the details of the liked videos
      const likedVideos = userLikes.map((like) => like.video);

      res.status(200).json(
         new ApiResponse(200, likedVideos, "fetched all likedVideos ")
      );
   } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
   }
});
