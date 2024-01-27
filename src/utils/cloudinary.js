const { v2 } = require("cloudinary");
const fs = require("fs");
cloudinary.config({
   cloud_name: process.env.cloud_name,
   api_key: process.env.api_key,
   api_secret: process.env.api_secret,
});

// create cloudinary file upload method
const uploadCloudinary = async (localFilePath) => {
   try {
      if (!localFilePathocalFilePath) return null;
      let uploadResponse = await v2.uploader.upload(localFilePath, {
         resource_type: "auto",
      });
      console.log(`file uploaded successfully ${uploadResponse.url}`);
      return uploadResponse;
   } catch (error) {
      fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the file upload got failed
      return null;
   }
};
module.exports = uploadCloudinary;
