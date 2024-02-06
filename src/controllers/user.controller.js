const asyncHandler = require("../utils/asyncHandler.js");
const User = require("../models/user.model.js");
const apiError = require("../utils/apiError.js");
const uploadCloudinary = require("../utils/cloudinary.js");
const apiResponse = require("../utils/apiResponse.js");
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

   const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
   );

   const options = {
      httpOnly: true,
      secure: true,
   };

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
         new apiResponse(
            200,
            {
               loggedInUser,
            },
            "User logged In Successfully"
         )
      );
});
exports.updateUserName = asyncHandler(async (req, res) => {
   try {
      // Destructure data from the request body
      const { userName, email } = req.body;
      let id = req.params;

      // Update user's username
      const user = await User.findByIdAndUpdate(
         { _id: id },
         { $set: { userName, email } },
         { new: true }
      ).select("-password");

      if (!user) {
         // Handle the case when the user with the given userId is not found
         return res
            .status(404)
            .json(new apiResponse("User not found", null, "User not found"));
      }

      // Send a successful response
      res.status(200).json(
         new apiResponse("", user, "Username updated successfully")
      );
   } catch (error) {
      // Handle errors
      console.error("Username update not successful:", error.message);
   }
});
exports.findUsers = asyncHandler(async (req, res) => {
   const user = await User.find();
   res.status(200).json(user);
});
