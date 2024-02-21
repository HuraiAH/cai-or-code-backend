const PlayList = require("../models//playList.model");
const { isValidObjectId } = require("mongoose");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

exports.CreatePlaylist = asyncHandler(async (req, res) => {
   const { name, description } = req.body;

   // find owner id req.user._id
   const owner = req.user?._id;
   if (!owner) {
      throw new ApiError(401, "invalid request ");
   }

   const playList = await PlayList.create({ name, description, owner });

   res.status(200).json(
      new ApiResponse(200, playList, "playlist created successfully")
   );
});

exports.getUserPlayList = asyncHandler(async (req, res) => {
   const { userId } = req.params;

   // Validate if the provided userId is a valid ObjectId
   if (!isValidObjectId(userId)) {
      const errorMessage = "Invalid user ID";
      return res.status(400).json(new ApiError(errorMessage));
   }

   // Find playlists owned by the specified user
   const playlists = await PlayList.find({ owner: userId }).populate(
      "videos",
      "-__v"
   );

   if (!playlists) {
      new ApiError(403, "playlist not found");
   }
   res.status(200).json(
      new ApiResponse(200, playlists, "playlist fetched success! ")
   );
});
exports.getPlaylistById = asyncHandler(async (req, res) => {
   const { playlistId } = req.params;
   const playList = await PlayList.findById(playlistId);
   if (!playList) {
      throw new ApiError(406, "playlist dose not exist ");
   }
   res.status(200).json(
      new ApiResponse(200, playList, "playlist fetched in playlist id")
   );
});

exports.addVideoToPlaylist = asyncHandler(async (req, res) => {
   // get playlistId and videoId in req.params
   // check videoId and playlistId in exist
   // find playlist in req.params playlistId
   // push video id in playlists.video fields
   // save updated playlist in database
   const { playlistId, videoId } = req.params;

   if (!playlistId && !videoId) {
      throw new ApiError(406, "Invalid playlist ID or video ID");
   }
   const playList = await PlayList.findById(playlistId);
   if (!playList) {
      throw new ApiError(406, "playlist dose not exist ");
   }

   playList.videos.push(videoId);

   await playList.save();

   res.status(200).json(
      new ApiResponse(200, {}, "new video added in this playlist")
   );
});
exports.removeVideoFromPlaylist = asyncHandler(async (req, res) => {
   const { playlistId, videoId } = req.params;
   if (!playlistId && !videoId) {
      throw new ApiError(406, "Invalid playlist ID or video ID");
   }
   const playlist = await PlayList.findById(playlistId);
   playlist.videos = playlist.videos.filter(
      (vid) => vid.toString() !== videoId
   );

   await playlist.save();

   res.status(200).json(
      new ApiResponse(200, {}, " this video deleted in playlist")
   );
});

exports.deletePlaylist = asyncHandler(async (req, res) => {
   const { playlistId } = req.params;
   if (!isValidObjectId(playlistId)) {
      throw new ApiError(403, "this playlist is missing");
   }

   await PlayList.findByIdAndDelete(playlistId);

   res.status(200).json(
      new ApiResponse(200, {}, "playlist deleted successfully")
   );
});

exports.updatePlaylist = asyncHandler(async (req, res) => {
   // get playlistId in req.params
   // find playlist  in playlist ID
   // get updated value in req.body
   // then update this play list

   const { playlistId } = req.params;
   const { name, description } = req.body;

   const updatedPlayList = await PlayList.findByIdAndUpdate(
      playlistId,
      { $set: { name, description } },
      { new: true }
   );

   if (!isValidObjectId(updatedPlayList)) {
      throw new ApiError(403, "this playlist is missing");
   }
   res.status(200).json(
      new ApiResponse(200, updatedPlayList, "playlist updated successfully")
   );
});
