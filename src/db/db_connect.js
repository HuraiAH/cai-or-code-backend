const mongoose = require("mongoose");
const DB_NAME = require("../constant");

const connectionDB = async () => {
   try {
      await mongoose.connect(`${process.env.DB_URI2}/${DB_NAME}`, {
         writeConcern: {
            w: "majority", // This specifies majority write concern
            j: true, // Journal acknowledgment
         },
      });
      console.log("database connected successfully");
   } catch (error) {
      console.log(`mongodb connection failed ${error}`);
      process.exit(1);
   }
};
module.exports = connectionDB;
