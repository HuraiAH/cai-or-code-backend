// create asyncHandler utility function
exports.asyncHandler = (responseHandler) => {
   (req, res, next) => {
      Promise.resolve(responseHandler(req, res, next)).catch((err) =>
         next(err)
      );
   };
};
