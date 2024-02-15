const { Schema, model, Types } = require("mongoose");
const commentSchema = new Schema({
   content: {
      type: String,
      required: true,
   },
   video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
   },
   owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
   },
});

const Comment = model("Comment", commentSchema);
module.exports = Comment;
