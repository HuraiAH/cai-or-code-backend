const router = require("express").Router();
const { verifyJwt } = require("../middlewares/auth.middleware.js");
const { subscription } = require("../controllers/subscription.controller.js");

router.route("/subscription").post(verifyJwt, subscription);

module.exports = router;
