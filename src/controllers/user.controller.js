const asyncHandler = require("../utils/asyncHandler.js");
const User = require("../models/user.model.js");
const apiError = require("../utils/apiError.js");
const apiResponse = require("../utils/apiResponse.js");
const { v2 } = require("cloudinary");
const { verify } = require("jsonwebtoken");
const {
   uploadOnCloudinary,
   deleteFromCloudinary,
} = require("../utils/cloudinary.js");
//generate Access And Refresh Tokens function
const generateAccessAndRefreshTokens = async function (userId) {
   try {
      const user = await User.findById(userId);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
   } catch (error) {
      throw new apiError(
         500,
         "Something went wrong while generating refresh and access token"
      );
   }
};

// user register controller
exports.registerUser = asyncHandler(async (req, res) => {
   // get user details on postman
   // validation check - (not empty)
   // check if user already exist - (userName,email)
   // check for image , check for avatar
   // upload them cloudinary avatar
   // create user object , entry in database
   // remove password and refresh token filed from response
   // check for user creation
   // return final response

   // get user data from postman
   const { userName, fullName, email, password } = req.body;
   // validation check filed empty
   if (
      [userName, fullName, email, password].some(
         (filed) => filed?.trim() === ""
      )
   ) {
      throw new apiError(401, "please provide all information");
   }
   // check if user already exist - (userName,email)
   const existedUser = await User.findOne({
      $or: [{ userName }, { email }],
   });
   if (existedUser) {
      throw new apiError(403, "this user already existed!");
   }
   // check for image , check for avatar
   let avatarLocalPath;
   if (
      req.files &&
      Array.isArray(req.files.avatar) &&
      req.files.avatar.length > 0
   ) {
      avatarLocalPath = req.files.avatar[0].path;
   }

   // console.log(req.files);
   // const coverImageLocalPath = req.files?.coverImage[0]?.path;
   // alternative
   let coverImageLocalPath;
   if (
      req.files &&
      Array.isArray(req.files.coverImage) &&
      req.files.coverImage.length > 0
   ) {
      coverImageLocalPath = req.files.coverImage[0].path;
   }

   if (!avatarLocalPath) {
      throw new apiError(307, "profile image is must be required");
   }
   // upload them cloudinary avatar
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);
   if (!avatar) {
      throw new apiError(307, "cloud profile image is must be required");
   }
   // create user object , entry in database
   const user = await User.create({
      userName: userName.toLowerCase(),
      fullName,
      email,
      password,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
   });
   // remove password and refresh token filed from response
   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   );
   // check for user creation
   if (!createdUser) {
      throw new apiError(503, "something went wrong in user registration");
   }
   //
   res.status(200).json(
      new apiResponse(200, createdUser, "user register successfully!")
   );
});
// // user login controller
exports.loginUser = asyncHandler(async (req, res) => {
   // req body -> data
   // username or email
   // find the user
   // password check
   // access and referesh token
   // send cookie

   const { email, userName, password } = req.body;

   if (!userName || !email) {
      throw new apiError(400, "username or email is required ");
   }

   // Here is an alternative of above code based on logic discussed in video:
   // if (!(username || email)) {
   //     throw new ApiError(400, "username or email is required")

   // }

   const user = await User.findOne({
      $or: [{ userName }, { email }],
   });
   // console.log(user);
   // throw new apiError("", "error found bujla");
   if (!user) {
      throw new apiError(404, "User does not exist");
   }

   // const isPasswordValid = await user.isPasswordCorrect(password);
   const isPasswordCorrect = await user.isPasswordCorrect(password);

   if (!isPasswordCorrect) {
      throw new apiError(401, "Invalid user password");
   }
   //access and referesh token
   const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
      user._id
   );
   // const accessToken = user.generateAccessToken();
   // const refreshToken = user.generateRefreshToken();

   // user.refreshToken = refreshToken;
   // await user.save({ validateBeforeSave: false });

   await User.findById(user._id);

   const options = {
      httpOnly: true,
      secure: true,
   };

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new apiResponse(200, "User logged In Successfully"));
});
exports.updateUserName = asyncHandler(async (req, res) => {
   try {
      // Destructure data from the request body
      const { userName, email, fullName } = req.body;
      let { id } = req.params;
      // // find user from full name
      // const { Name } = await User.findOne({ fullName });
      // Update user's username
      const UpdatedUser = await User.findByIdAndUpdate(
         { _id: id },
         { $set: { userName, email, fullName } },
         { new: true }
      ).select("-password");

      if (!UpdatedUser) {
         // Handle the case when the user with the given userId is not found
         return res
            .status(404)
            .json(new apiResponse("User not found", null, "User not found"));
      }

      // Send a successful response
      res.status(200).json(
         new apiResponse(UpdatedUser, "Username updated successfully")
      );
   } catch (error) {
      // Handle errors
      new apiError(500, "user update not successfully!");
   }
});
// log out controller
exports.logoutUser = asyncHandler(async (req, res) => {
   await User.findByIdAndUpdate(
      req.user?._id,
      {
         $unset: {
            refreshToken: 1,
         },
      },
      { new: true }
   );

   const options = {
      httpOnly: true,
      secure: true,
   };
   res.status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new apiResponse(200, "user log out successfully!"));
});
exports.getCurrentUser = asyncHandler(async (req, res) => {
   res.status(200).json(
      new apiResponse(200, req.user, "successfully finding current user")
   );
});
exports.changeCurrentPassword = asyncHandler(async (req, res) => {
   const { oldPassword, newPassword } = req.body;

   const user = await User.findById(req.user?._id);
   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

   if (!isPasswordCorrect) {
      throw new apiError(400, "Invalid old password");
   }

   user.password = newPassword;
   await user.save({ validateBeforeSave: false });

   return res
      .status(200)
      .json(new apiResponse(200, {}, "Password changed successfully"));
});
exports.updateUserAvatar = asyncHandler(async (req, res) => {
   const avatarLocalPath = req.file?.path;
   if (!avatarLocalPath) {
      throw new apiError(400, "Avatar file is missing");
   }

   // Retrieve the old avatar URL before updating
   const userToUpdate = await User.findById(req.user?._id);
   const oldAvatarUrl = userToUpdate.avatar;

   // Delete the old avatar image
   if (oldAvatarUrl) {
      const publicId = v2.url(oldAvatarUrl).public_id;
      await deleteFromCloudinary(publicId);
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath);

   if (!avatar.url) {
      throw new apiError(400, "Error while uploading the avatar");
   }

   const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set: {
            avatar: avatar.url,
         },
      },
      { new: true }
   ).select("-password");

   return res
      .status(200)
      .json(new apiResponse(200, user, "Avatar image updated successfully"));
});
exports.refreshAccessToken = asyncHandler(async (req, res) => {
   //incomingRefreshToken  from req.cookies
   // decodedToken in incomingRefreshToken
   //find user form decodedToken
   // generate  new access and refresh token

   const incomingRefreshToken =
      req.cookies?.refreshToken || req.body.refreshToken;
   if (!incomingRefreshToken) {
      throw (new apiError(403), "unauthorized request");
   }

   const decodedToken = verify(
      incomingRefreshToken,
      process.env.Refresh_token_secret_key
   );
   const user = await User.findById(decodedToken?._id);
   if (!user) {
      throw (new apiError(403), "invalid refresh token");
   }
   const options = {
      httpOnly: true,
      secure: true,
   };
   const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
      user._id
   );
   res.status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(new apiResponse(200, {}, "regenerate access and refresh token"));
});

exports.getUserChannelProfile = asyncHandler(async (req, res) => {
   /*
   const channel = await User.aggregate([
      {
         $match: {
            username: username?.toLowerCase(),
         },
      },
      {
         $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "channel",
            as: "subscribers",
         },
      },
      {
         $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "subscriber",
            as: "subscribedTo",
         },
      },
      {
         $addFields: {
            subscribersCount: {
               $size: "$subscribers",
            },
            channelsSubscribedToCount: {
               $size: "$subscribedTo",
            },
            isSubscribed: {
               $cond: {
                  if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                  then: true,
                  else: false,
               },
            },
         },
      },
      {
         $project: {
            fullName: 1,
            username: 1,
            subscribersCount: 1,
            channelsSubscribedToCount: 1,
            isSubscribed: 1,
            avatar: 1,
            coverImage: 1,
            email: 1,
         },
      },
   ]);


            fullName: 1,
            username: 1,
            subscribersCount: 1,
            channelsSubscribedToCount: 1,
            isSubscribed: 1,
            avatar: 1,
            coverImage: 1,
            email: 1,
  */

   const { userName } = req.params;

   if (!userName?.trim()) {
      throw new apiError(400, "username is missing");
   }
   const channel = await User.aggregate([
      {
         $match: {
            userName: userName?.toLowerCase(),
         },
      },
      {
         $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "channel",
            as: "subscribers",
         },
      },
      {
         $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "subscriber",
            as: "subscribedTo",
         },
      },
      {
         $addFields: {
            subscribersCount: {
               $size: "$subscribers",
            },
            channelsSubscribedToCount: {
               $size: "$subscribedTo",
            },
            isSubscribed: {
               $cond: {
                  if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                  then: true,
                  else: false,
               },
            },
         },
      },
      {
         $project: {
            avatar: 1,
            fullName: 1,
            userName: 1,
            coverImage: 1,
            isSubscribed: 1,
            watchHistory: 1,
            subscribersCount: 1,
            channelsSubscribedToCount: 1,
         },
      },
   ]);

   if (!channel?.length) {
      throw new apiError(404, "channel does not exists");
   }

   return res
      .status(200)
      .json(
         new apiResponse(200, channel[0], "User channel fetched successfully")
      );
});
