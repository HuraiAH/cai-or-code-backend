const { Schema, model, mongoose } = require("mongoose");

const videoSchema = new Schema(
   {
      videoFile: {
         type: String, // cloudinary url
         required: [true, "video must be required!"],
         // unique: true,
      },
      thumbnail: {
         type: String, // cloudinary url
         required: true,
      },
      title: {
         type: String,
         required: [true, "title is required"],
      },

      description: {
         type: String,
      },
      duration: {
         type: Number,
      },
      viewer: [{ type: Schema.Types.ObjectId, ref: "User" }],

      isPublish: {
         type: Boolean,
         default: false,
      },
      owner: {
         type: mongoose.Types.ObjectId,
         ref: "User",
      },
   },
   { timestamps: true }
);

const Video = model("Video", videoSchema);
module.exports = Video;
