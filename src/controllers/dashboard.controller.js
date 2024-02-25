const asyncHandler = require("../utils/asyncHandler.js");
const Video = require("../models/video.model.js");
const Subscriber = require("../models/subscription.model.js");
const Like = require("../models/like.model.js");
const Comment = require("../models/comment.model.js");
const User = require("../models/user.model.js");
const { isValidObjectId } = require("mongoose");
const ApiResponse = require("../utils/apiResponse.js");

exports.getChannelStats = asyncHandler(async (req, res) => {
   // Retrieve channel ID from the request (assuming it's stored in req.params.channelId)
   const { channelId } = req.params;

   // Validate if channelId is a valid ObjectId
   if (!isValidObjectId(channelId)) {
      return res.status(400).json({ error: "Invalid channel ID" });
   }

   // Get channel information
   const channel = await User.findById(channelId);

   if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
   }

   // Get total video views
   const totalVideoViews = await Video.aggregate([
      { $match: { channel: channel._id } },
      { $group: { _id: null, totalViews: { $sum: "$viewer" } } },
   ]);

   // Get total subscribers
   const totalSubscribers = await Subscriber.countDocuments({
      channel: channel._id,
   });

   // Get total videos
   const totalVideos = await Video.countDocuments({ owner: channel._id });

   // Get total likes
   const totalLikes = await Like.countDocuments({
      video: { $in: channel.videos },
   });

   // Get total comments
   const totalComments = await Comment.countDocuments({
      video: { $in: channel.videos },
   });

   // Respond with the channel stats
   res.status(200).json(
      new ApiResponse(
         200,
         {
            totalVideoViews:
               totalVideoViews.length > 0 ? totalVideoViews[0].totalViews : 0,
            totalSubscribers,
            totalVideos,
            totalLikes,
            totalComments,
         },
         "Channel stats fetched successfully"
      )
   );
});
