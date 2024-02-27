const asyncHandler = require("../utils/asyncHandler.js");
const apiError = require("../utils/apiError.js");
const { verify } = require("jsonwebtoken");
const User = require("../models/user.model.js");

exports.verifyJwt = asyncHandler(async (req, res, next) => {
   try {
      // find access token from cookies or req header
      const token =
         req.cookies?.accessToken ||
         req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
         throw new apiError(500, "unauthorized user request!");
      }
      // verify this cookies
      const decodeToken = verify(token, process.env.Access_token_secret_key);
      // find user form access token
      const user = await User.findById(decodeToken?._id).select(
         "-password -refreshToken"
      );
      if (!user) {
         throw new apiError(402, "invalid access token!");
      }
      req.user = user;
      next();
   } catch (error) {
      throw new apiError(402, "invalid access token !");
   }
});
