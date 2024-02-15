const { Schema, model } = require("mongoose");

const tweetSchema = new Schema({
   content: {
      type: String,
      required: true,
   },
   tweetBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
   },
});
const Tweet = model("Tweet", tweetSchema);
module.exports = Tweet;
