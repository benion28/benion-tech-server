const path = require("path");
const express = require("express");
const router = express.Router();
const { ensureAuthentication } = require("../config/auth");

// Chat Home
router.get("/", ensureAuthentication, (request, response) => {
    response.render("main/chatHome", {
        user: request.user
    });
    response.status(304);
});

// Chat Room
router.get("/benion-chat-room", ensureAuthentication, (request, response) => {
    response.sendFile(path.resolve(__dirname, "chat", "public", "chat.html"));
    response.status(200);
});

module.exports = router;