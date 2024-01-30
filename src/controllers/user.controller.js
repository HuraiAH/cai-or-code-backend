const asyncHandler = require("../utils/asyncHandler.js");
const User = require("../models/user.model.js");

// register new user
exports.registerUser = asyncHandler(async (req, res) => {
   try {
      let {
         UserName,
         fullName,
         email,
         avatar,
         coverImage,
         password,
         refreshToken,
         watchHistory,
      } = req.body;

      const userData = await new User({
         UserName,
         fullName,
         email,
         avatar,
         coverImage,
         password,
         refreshToken,
         watchHistory,
      });
      userData.save();
      console.log(userData);
      res.status(201).json(userData);
   } catch (error) {
      console.log("user dose not save in database", error.massage);
   }
});
exports.findUser = async (req, res) => {
   try {
      let user = await User.find();
      console.log(user);
      res.status(200).json(user);
   } catch (error) {
      console.log(`user not found ${error.massage}`);
   }
};
