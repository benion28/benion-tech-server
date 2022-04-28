const express = require("express");
const router = express.Router();
const { handleHomepage } = require("../users-passport/controllers/news");

// User Homepage
router.get("/", handleHomepage);

module.exports = router;