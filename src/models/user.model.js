const { Schema, model, mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
// define user schema
let userSchema = new Schema(
   {
      userName: {
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
         required: [true, "Email is required!"],
         unique: true,
         lowercase: true,
         trim: true,
         match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      },

      avatar: {
         type: String, // cloudinary  url
         required: [true, "avatar is required!"],
      },
      coverImage: {
         type: String, //cloudinary  url
      },
      password: {
         type: String,
         required: [true, "password is required!"],
      },
      refreshToken: {
         type: String,
      },
      // watchHistory: [
      //    {
      //       type: mongoose.Schema.Types.ObjectId,
      //       ref: "Video",
      //    },
      // ],
   },
   { timestamps: true }
);
// password pre save middleware
userSchema.pre("save", async function (next) {
   if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 8);
   }
   next();
});
// Add a method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
   try {
      return await bcrypt.compare(candidatePassword, this.password);
   } catch (error) {
      throw error;
   }
};
// generate access token
userSchema.methods.generateAccessToken = function () {
   return JWT.sign(
      {
         _id: this._id,
         UserName: this.UserName,
         email: this.email,
      },
      process.env.Access_token_secret_key,
      { expiresIn: process.env.Access_token_expiry }
   );
};
// generate refresh token
userSchema.methods.generateRefreshToken = function () {
   return JWT.sign(
      {
         _id: this._id,
      },
      process.env.Refresh_token_secret_key,
      { expiresIn: process.env.Refresh_token_expiry }
   );
};

// create new model
const User = model("User", userSchema);
// export model
module.exports = User;
