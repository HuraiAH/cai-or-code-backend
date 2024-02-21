const { notFound } = require("../controllers/notFound.controller");

const router = require("express").Router();

router.route("*").get(notFound);
module.exports = router;
