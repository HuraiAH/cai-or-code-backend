const router = require("express").Router();
const { registerUser, findUser } = require("../controllers/user.controller.js");
router.route("/register").post(registerUser).get(findUser);
module.exports = router;
