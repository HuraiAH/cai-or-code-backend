const mongoose = require("mongoose");
const DB_NAME = require("../constant");

const connectionDB = async () => {
   try {
      await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`);
      console.log("database connected successfully");
   } catch (error) {
      console.log(`mongodb connection failed ${error}`);
      process.exit(1);
   }
};
module.exports = connectionDB;
