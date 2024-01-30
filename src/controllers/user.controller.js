const asyncHandler = require("../utils/asyncHandler.js");
const User = require("../models/user.model.js");
const apiError = require("../utils/apiError.js");
const uploadCloudinary = require("../utils/cloudinary.js");
const apiResponse = require("../utils/apiResponce.js");

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
      $or: [{ userName, email }],
   });
   if (existedUser) {
      throw new apiError(403, "this user already existed!");
   }
   // check for image , check for avatar
   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path;
   if (!avatarLocalPath) {
      throw new apiError(307, "profile image is must be required");
   }
   // upload them cloudinary avtar
   const avatar = await uploadCloudinary(avatarLocalPath);
   const coverImage = await uploadCloudinary(coverImageLocalPath);
   if (!avatar) {
      throw new apiError(307, "profile image is must be required");
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

   try {
   } catch (error) {
      console.log("please debug your code!");
   }
});
