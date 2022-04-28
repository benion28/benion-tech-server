const express = require("express");
const router = express.Router();
const { adminAuthorization } = require("../users-passport/controllers/adminUsers");
const { ensureAuthorization } = require("../config/auth");

router.get("/", ensureAuthorization, (request, response) => {
    response.status(304);
});

router.get("/admin-contacts", ensureAuthorization, (request, response) => {
    response.status(304);
});

router.get("/admin-users", ensureAuthorization, (request, response) => {
    response.status(304);
});

router.get("/admin-news", ensureAuthorization, (request, response) => {
    response.status(304);
});

router.get("/admin-image-gallery", ensureAuthorization, (request, response) => {
    response.status(304);
});

// Authorize Admin
router.route("/api")
.post(adminAuthorization);

module.exports = router;