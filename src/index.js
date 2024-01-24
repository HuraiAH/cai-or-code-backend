const dotenv = require("dotenv");
dotenv.config();
const connectionDB = require("../src/db/db_connect.js");
const app = require("./app.js");

// connect mongodb atlas database
connectionDB()
   .then(() => {
      app.listen(process.env.PORT || 4000, () => {
         console.log(`server is running on port: ${process.env.PORT}`);
      });
   })
   .catch((err) => {
      console.log(`database connection failed !`, err);
   });
