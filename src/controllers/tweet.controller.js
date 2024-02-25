const Tweet = require("../models/tweet.model.js");
const { isValidObjectId } = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

exports.createTweet = asyncHandler(async (req, res) => {
   const { content } = req.body;
   const { userId } = req?.user._id;

   if (!isValidObjectId(userId)) {
      throw new ApiError(405, "invalid user");
   }

   const tweet = await Tweet.create({ content: content, tweetBy: userId });
   res.status(200).json(
      new ApiResponse(200, tweet, "tweet created successfully")
   );
});

exports.getUserTweets = asyncHandler(async (req, res) => {
   const userId = req?.user._id;
   if (!isValidObjectId(userId)) {
      throw new ApiError(405, "invalid user");
   }
   // Query tweets for the specified user
   const userTweets = await Tweet.find({ tweetBy: userId })
      .sort({ createdAt: -1 }) // Sort by creation time in descending order (latest first)
      .exec();
   res.status(200).json(
      new ApiResponse(200, userTweets, "this user tweet fetched")
   );
});

exports.updateTweet = asyncHandler(async (req, res) => {
   const { tweetId } = req.params;
   const content = req.body;
   if (!isValidObjectId(tweetId)) {
      throw new ApiError(405, "invalid tweetId");
   }

   const updatedTweet = await Tweet.findByIdAndUpdate(
      tweetId,
      {
         $set: {
            content: content,
         },
      },
      { new: true }
   ).select("-tweetBy");
   res.status(200).json(
      new ApiResponse(200, updatedTweet, "tweet update successfully")
   );
});

exports.deleteTweet = asyncHandler(async (req, res) => {
   const { tweetId } = req.params;
   const content = req.body;
   if (!isValidObjectId(tweetId)) {
      throw new ApiError(405, "invalid tweetId");
   }
   await Tweet.findByIdAndDelete(tweetId);
   res.status(200).json(new ApiResponse(200, null, "tweet  successfully"));
});
