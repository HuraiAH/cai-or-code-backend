const { Schema, model, mongoose } = require("mongoose");
const mongooseAggregatePaginateV2 = require("mongoose-aggregate-paginate-v2");

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
         default: 0,
      },
      views: { type: Number, default: 0 },

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
videoSchema.plugin(mongooseAggregatePaginateV2);
const Video = model("Video", videoSchema);
module.exports = Video;
