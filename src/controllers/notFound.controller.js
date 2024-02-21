const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

exports.notFound = asyncHandler(async (req, res) => {
   res.status(404).json(new ApiResponse(404, "", "404 not found!"));
});
