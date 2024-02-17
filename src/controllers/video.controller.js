const Video = require("../models/video.model.js");
const User = require("../models/user.model.js");
const asyncHandler = require("../utils/asyncHandler.js");
const apiError = require("../utils/apiError.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const apiResponse = require("../utils/apiResponse.js");

exports.createVideo = asyncHandler(async (req, res) => {
   // extract user input data from req body
   const { title, description } = req.body;

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
