const Subscription = require("../models/subscription.model");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

exports.subscription = asyncHandler(async (req, res) => {
   const subData = await Subscription.create({
      subscriber: req.user?._id,
      channel: req.user?._id,
   });
   res.status(200).json(
      new ApiResponse(200, subData, "Subscription document saved successfully")
   );
});
