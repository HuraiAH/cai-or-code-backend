const { getChannelStats } = require("../controllers/dashboard.controller");
const { verifyJwt } = require("../middlewares/auth.middleware");

const router = require("express").Router();

router.route("/dashboard/:channelId").get(verifyJwt, getChannelStats);

module.exports = router;
