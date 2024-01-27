const router = require("express").Router();
const { registerUser, findUser } = require("../controllers/user.controller.js");
router.post("/register", registerUser);
router.get("/register", findUser);
module.exports = router;
