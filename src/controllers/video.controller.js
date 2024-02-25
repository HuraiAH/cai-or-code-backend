const Video = require("../models/video.model.js");
const asyncHandler = require("../utils/asyncHandler.js");
const apiError = require("../utils/apiError.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const apiResponse = require("../utils/apiResponse.js");
const { isValidObjectId } = require("mongoose");
const User = require("../models/user.model.js");

exports.createVideo = asyncHandler(async (req, res) => {
   // extract user input data from req body
   const { title, description, duration } = req.body;

   // validate title and description
   if (!title || !description) {
      throw new apiError(401, "title and description must be required!");
   }

   // extract video file input req file
   let videoLocalPath;
   if (
      req.files &&
      Array.isArray(req.files.videoFile) &&
      req.files.videoFile.length > 0
   ) {
      videoLocalPath = req.files.videoFile[0].path;
   }

   // validate video file
   if (!videoLocalPath) {
      throw new apiError(401, "video file is missing");
   }
   try {
      // upload video local path cloudinary
      const videoPath = await uploadOnCloudinary(videoLocalPath);

      // create and save video details
      const video = new Video({
         title,
         duration,
         description,
         videoFile: videoPath?.url || "",
         thumbnail: videoPath?.url || "",
         owner: req.user?._id,
      });
      const videoDetails = await video.save();

      return res.json(
         new apiResponse(200, videoDetails, "video upload successfully")
      );
   } catch (error) {
      throw new apiError(500, "Internal Server Error", error.message);
   }
});
/*
exports.addViewerToVideo = asyncHandler(async (req, res) => {
   const { videoId } = req.params;
   const { userId } = req?.user._id;
   if (!isValidObjectId(videoId, userId)) {
      throw new apiError(402, "invalid userId and videoId");
   }

   const video = await Video.findById(videoId);
   if (!video) {
      throw new apiError(406, "video dose not exist ");
   }
   video.viewer.push(userId);

   await video.save();
   res.status(200).json(new apiResponse(200, "viewer added in this video"));
});
*/
exports.getVideo = asyncHandler(async (req, res) => {
   const { videoId } = req.params;
   const userId = req.user?._id;
   if (!isValidObjectId(videoId)) {
      throw new apiError(402, "invalid userId and videoId");
   }

   const video = await Video.findById(videoId);
   if (!video) {
      throw new apiError(406, "video dose not exist ");
   }

   res.status(200).json(new apiResponse(200, video, " video fetched"));

   video.viewer.push(userId);
   await video.save();

   const watchHistory = await User.findByIdAndUpdate(req.user?._id, {
      $push: {
         watchHistory: videoId,
      },
   });
   await watchHistory.save();
});
