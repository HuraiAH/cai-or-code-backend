const { Schema, model, mongoose } = require("mongoose");
// define user schema
let userSchema = new Schema({
   UserName: {
      type: String,
      required: [true, "UserName is required!"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
   },
   fullName: {
      type: String,
      required: true,
      trim: true,
   },
   email: {
      type: String,
      required: [true, "email is required!"],
      unique: true,
      lowercase: true,
      trim: true,
   },
   avatar: {
      type: String, // cloudinary  url
      required: [true, "avatar is required!"],
   },
   coverImage: {
      type: String, // cloudinary  url
   },
   password: {
      type: String,
      required: [true, "password is required!"],
   },
   refreshToken: {
      type: String,
   },
   watchHistory: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Video",
      },
   ],
});
// create new model
const User = model("User", userSchema);
// export model
module.exports = User;
