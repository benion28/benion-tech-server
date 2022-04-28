const express = require("express");
const router = express.Router();
const AdminUser = require("../users-passport/models/AdminUser");
const passport = require("passport");
const { ensureAdminAuthenticated } = require("../config/auth");
const {
    getAdminUsers,
    deleteAdminUser,
    handleRegisterAdminUser,
    adminUserPasswordChange,
    activateAdminUser,
    registerAdminUser,
    forgetAdminPassword,
    activateAdminPage,
    resetAdminPage,
    handleAdminChangePassword,
    handleAdminForget,
    editAdminPage,
    handleUpdateAdmin,
    updateAdminUser,
    handleAddAdminUser,
    addAdminUser,
    handleAdminDashboard,
    handleAdminLogin
} = require("../users-passport/controllers/adminUsers");
const { getAllNews } = require("../users-passport/controllers/news");

// Admin Homepage
router.get("/", (request, response) => {
    response.render("admin/adminWelcome", {
        user: request.user
    });
    response.status(304);
});

// Admin Dashboard
router.get("/benion-admin-dashboard", ensureAdminAuthenticated, handleAdminDashboard);

// Admin Login Page
router.get("/benion-admin-login", (request, response) => {
    response.render("admin/adminLogin", {
        user: request.user
    });
    response.status(304);
});

// Admin Register Page
router.get("/benion-admin-register", ensureAdminAuthenticated, (request, response) => {
    response.render("admin/adminRegister", {
        user: request.user
    });
    response.status(304);
});

// Add Admin User Page
router.get("/benion-admin-add-user", ensureAdminAuthenticated, (request, response) => {
    response.render("admin/adminAdd", {
        user: request.user
    });
    response.status(304);
});

// Forget Admin Password Page
router.get("/benion-admin-forget-password", ensureAdminAuthenticated, (request, response) => {
    response.render("admin/adminForget", {
        user: request.user
    });
    response.status(304);
});

// New Admin Password Page
router.get("/benion-admin-change-password/:token", (request, response) => {
    response.render("admin/adminReset", {
        user: request.user,
        token: request.params.token
    });
    response.status(304);
});

// Change Admin User Password
router.route("/api/benion-admin-change-password/:token")
.put(adminUserPasswordChange);

// Activate Admin User
router.route("/api/benion-admin-activate-email/:token")
.post(activateAdminUser);

// Register Admin User
router.route("/api/benion-admin-register")
.post(registerAdminUser);

// Forget Admin Password
router.route("/api/benion-admin-forget-password")
.put(forgetAdminPassword);

// Get All Admin Users
router.route("/api/benion-admin-users-lists")
.get(getAdminUsers);

// Delete An Admin User
router.route("/api/benion-admin-users-lists/:id")
.delete(deleteAdminUser);

// Update Admin User
router.route("/api/benion-admin-edit-user/:id")
.put(updateAdminUser);

// Add Admin User
router.route("/api/benion-admin-add-user")
.post(addAdminUser);

// Handle Admin User Login
router.route("/api/benion-admin-user-login")
.post(handleAdminLogin);

// Handle Admin Logout
router.get("/api/benion-admin-user-logout", (request, response, next) => {
    request.logout();
    response.status(200).json({
        success: true,
        message: "You Are Logged Out"
    });
    response.redirect("/home");
    next();
});

// Get All Admin Users Page
router.get("/benion-admin-users-lists", ensureAdminAuthenticated, async (request, response) => {
    const usersData = await AdminUser.find();
    response.render("admin/adminLists", {
        adminUsers: Object.values(usersData),
        user: request.user
    });
    response.status(304);
});

// Delete An Admin Page
router.get("/benion-admin-users-lists-delete/:id", ensureAdminAuthenticated, async (request, response) => {
    const adminUser = await AdminUser.findById(request.params.id);
    await adminUser.remove();
    request.flash("success_delete_message", "Admin User Deleted Successfully");
    response.redirect("/benion-admin-users/benion-admin-users-lists");
    response.status(307);
});

// Activate Admin User Page
router.get("/benion-admin-activate-email-link/:token", activateAdminPage);

// Reset Admin User Page
router.get("/benion-admin-reset-password-link/:token", resetAdminPage);

// Handle Admin Change Password
router.post("/benion-admin-change-password/:token", handleAdminChangePassword);

// Handle Admin Forget
router.post("/benion-admin-forget-password", handleAdminForget);

// Handle Admin Register
router.post("/benion-admin-register", handleRegisterAdminUser);

// Handle Add Admin User
router.post("/benion-admin-add-user", handleAddAdminUser);

// Edit Admin User Page
router.get("/benion-admin-edit-user/:id", ensureAdminAuthenticated, editAdminPage);

// Handle Update Admin User
router.post("/benion-admin-edit-user/:id", handleUpdateAdmin);

// Handle Log In
router.post("/benion-admin-login", (request, response, next) => {
    passport.authenticate("local", {
        successRedirect: "/benion-admin-users/benion-admin-dashboard",
        failureRedirect: "/benion-admin-users/benion-admin-login",
        failureFlash: true
    })(request, response, next);
});

// Handle Log Out
router.get("/benion-admin-logout", (request, response) => {
    request.logout();
    request.flash("success_message", "You Are Logged Out");
    response.redirect("/benion-admin-users");
});

module.exports = router;