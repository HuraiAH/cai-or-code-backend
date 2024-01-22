const dotenv = require("dotenv");
dotenv.config();
const connectionDB = require("../src/db/db_connect.js");

// connect mongodb atlas database
connectionDB();
