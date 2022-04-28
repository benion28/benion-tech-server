const express = require("express");
const router = express.Router();

// About Us Page
router.get("/", (request, response) => {
    response.render("main/aboutPage", {
        user: request.user
    });
    response.status(304);
});

module.exports = router;