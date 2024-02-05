const { Schema, model, mongoose } = require("mongoose");
const { compare, hash } = require("bcrypt");
const { sign } = require("jsonwebtoken");

const userSchema = new Schema(
   {
      userName: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
         trim: true,
         index: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
         lowecase: true,
         trim: true,
      },
      fullName: {
         type: String,
         required: true,
         trim: true,
         index: true,
      },
      avatar: {
         type: String, // cloudinary url
         required: true,
      },
      coverImage: {
         type: String, // cloudinary url
      },
      watchHistory: [
         {
            type: Schema.Types.ObjectId,
            ref: "Video",
         },
      ],
      password: {
         type: String,
         required: [true, "Password is required"],
      },
      refreshToken: {
         type: String,
      },
   },
   {
      timestamps: true,
   }
);
userSchema.methods.isPasswordCorrect = async function (password) {
   return await compare(password, this.password);
};
userSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next();

   this.password = await hash(this.password, 10);
   next();
});
userSchema.methods.generateAccessToken = function () {
   return sign(
      {
         _id: this._id,
         email: this.email,
         userName: this.userName,
         fullName: this.fullName,
      },
      process.env.Access_token_secret_key,
      {
         expiresIn: process.env.Access_token_expiry,
      }
   );
};
userSchema.methods.generateRefreshToken = function () {
   return sign(
      {
         _id: this._id,
      },
      process.env.Refresh_token_secret_key,
      {
         expiresIn: process.env.Refresh_token_expiry,
      }
   );
};

// create new model
const User = model("User", userSchema);
// export model
module.exports = User;
