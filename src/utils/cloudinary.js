const { v2 } = require("cloudinary");
const fs = require("fs");
v2.config({
   cloud_name: process.env.cloud_name,
   api_key: process.env.api_key,
   api_secret: process.env.api_secret,
});

// create cloudinary file upload method
const uploadOnCloudinary = async (localFilePath) => {
   try {
      if (!localFilePath) return null;
      //upload the file on cloudinary
      const response = await v2.uploader.upload(localFilePath, {
         resource_type: "auto",
      });
      // file has been uploaded successfull
      //console.log("file is uploaded on cloudinary ", response.url);
      fs.unlinkSync(localFilePath);
      return response;
   } catch (error) {
      fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the file upload got failed
      return null;
   }
};
module.exports = uploadOnCloudinary;
