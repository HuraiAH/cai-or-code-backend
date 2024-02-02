const asyncHandler = require("../utils/asyncHandler.js");
const User = require("../models/user.model.js");
const apiError = require("../utils/apiError.js");
const uploadCloudinary = require("../utils/cloudinary.js");
const apiResponse = require("../utils/apiResponse.js");
const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Add a method to compare passwords

// //generateAccessAndRefreshTokens function
// const generateAccessAndRefreshTokens = async (userId) => {
//    try {
//       const user = await User.findById(userId);
//       const accessToken = user.generateAccessToken();
//       const refreshToken = user.generateRefreshToken();

//       user.refreshToken = refreshToken;
//       await user.save({ validateBeforeSave: false });

//       return { accessToken, refreshToken };
//    } catch (error) {
//       throw new apiError(
//          500,
//          "Something went wrong while generating refresh and access token"
//       );
//    }
// };

// user register controller
exports.registerUser = asyncHandler(async (req, res) => {
   // get user details on postman
   // validation check - (not empty)
   // check if user already exist - (userName,email)
   // check for image , check for avatar
   // upload them cloudinary avtar
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
   const avatarLocalPath = req.files?.avatar[0]?.path;
   console.log(req.files);
   // const coverImageLocalPath = req.files?.coverImage[0]?.path;
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
   const avatar = await uploadCloudinary(avatarLocalPath);
   const coverImage = await uploadCloudinary(coverImageLocalPath);
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
   //find the user
   //password check
   //access and refresh token
   //send cookie

   // req body -> data
   const { userName, email, password } = req.body;

   // check  username or email exist
   const user = await User.find({
      $or: [{ userName }, { email }],
   });
   if (!user) {
      throw new apiError(401, "user dose not exist");
   }

   //password check
   const isPasswordValid = await user.isPasswordCorrect(password);

   if (!isPasswordValid) {
      throw new apiError(401, "please provide a correct password");
   }
   //access and refresh token
   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
   );
   const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
   );
   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
         new apiResponse(
            200,
            { user: loggedInUser, refreshToken, accessToken },
            "user login successfully"
         )
      );
});
exports.findUsers = asyncHandler(async (req, res) => {
   const user = await User.find();
   res.status(200).json(user);
});
