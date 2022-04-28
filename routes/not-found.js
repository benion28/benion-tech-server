const express = require("express");
const router = express.Router();

router.get("/", (request, response, next) => {
    response.status(404);
    next();
});

module.exports = router;