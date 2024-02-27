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
         isPublish: true,
      });

      const videoDetails = await video.save();
      return res.json(
         new apiResponse(200, videoDetails, "video upload successfully")
      );
   } catch (error) {
      throw new apiError(500, "Internal Server Error", error.message);
   }
});

exports.getVideo = asyncHandler(async (req, res) => {
   // Extract videoId from request parameters
   const { videoId } = req.params;

   // Extract userId from the authenticated user (if available)
   const userId = req.user?._id;

   // Validate if videoId is a valid ObjectId
   if (!isValidObjectId(videoId)) {
      throw new apiError(402, "Invalid userId and videoId");
   }

   // Find the video by ID
   const video = await Video.findById(videoId);

   // Check if the video exists
   if (!video) {
      throw new apiError(406, "Video does not exist");
   }

   // Increment the views count for the video
   video.views += 1;
   await video.save();

   // Respond with the video details
   res.status(200).json(new apiResponse(200, video, "Video fetched"));

   // Update user's watch history by adding the videoId to the watchHistory array If a video is viewed once, this video ID will be added
   const watchHistory = await User.findByIdAndUpdate(userId, {
      $addToSet: {
         watchHistory: videoId,
      },
   });
   // Save the changes to the user's watch history
   await watchHistory.save();
});
