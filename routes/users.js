const express = require("express");
const router = express.Router();
const { ensureAdminAuthorization, ensureAuthorization, ensureAuthenticated, ensureAdminAuthenticated } = require("../config/auth");
const {
    getUsers,
    deleteUser,
    deleteAllUsers,
    activatePage,
    activateUser,
    passwordChange,
    updatePassword,
    resetPasswordPage,
    registerUser,
    registerUserActivate,
    forgetPassword,
    updateUser,
    addUser,
    handleLogin,
    handleLogOut,
    depositAmount,
    userAuthenticate,
    userContact,
    deleteContactMessage,
    getContactMessages, 
    getImages, 
    addImage, 
    editImage, 
    deleteImage
} = require("../controllers/users")

// Users Dashboard
router.get("/dashboard", ensureAuthenticated)

// Change Password
router.route("/api/change-password/:token")
.put(passwordChange)

// Update Password
// router.put("/api/update-password", ensureAdminAuthenticated, updatePassword)
router.put("/api/update-password", updatePassword)

// Activate A User
// router.post("/api/activate-email", ensureAdminAuthenticated, activateUser)
router.post("/api/activate-email", activateUser)

// Register A User Without Activation
router.route("/api/register")
.post(registerUser)

// Register A User
router.route("/api/register-activate")
.post(registerUserActivate)

// Contact Message
router.route("/api/contact-us")
.post(userContact)

// Forget Password
router.route("/api/forget-password")
.put(forgetPassword)

// Deposit For User
// router.put("/api/deposit-for-user", ensureAdminAuthenticated, depositAmount)
router.put("/api/deposit-for-user", depositAmount)

// Get All Users
// router.get("/api/users", ensureAdminAuthenticated, getUsers)
router.get("/api/users", getUsers)

// Get All Contact Messages
// router.get("/api/contact-messages", ensureAdminAuthenticated, getContactMessages)
router.get("/api/contact-messages", getContactMessages)

// Check User's Authentication
router.get("/api/authenticate", userAuthenticate)

// Delete A User
// router.delete("/api/delete-user/:id", ensureAdminAuthenticated, deleteUser)
router.delete("/api/delete-user/:id", deleteUser)

// Delete A Contact Message
// router.delete("/api/delete-contact-message/:key", ensureAdminAuthenticated, deleteContactMessage)
router.delete("/api/delete-contact-message/:key", deleteContactMessage)

// Delete All Users
// router.delete("/api/delete-all-user", ensureAdminAuthenticated, deleteAllUsers)
router.delete("/api/delete-all-user", deleteAllUsers)

// Update A User
// router.put("/api/edit-user/:id", ensureAdminAuthenticated, updateUser)
router.put("/api/edit-user/:id", updateUser)

// Add User
// router.post("/api/add-user", ensureAdminAuthenticated, addUser)
router.post("/api/add-user", addUser)

// Authentication
router.get("/api/authentication", ensureAuthenticated)
router.get("/api/admin-authentication", ensureAdminAuthenticated)

// Authorization
router.get("/api/authorization", ensureAuthorization)
router.get("/api/admin-authorization", ensureAdminAuthorization)

// Handle User Login
router.route("/api/login").
post(handleLogin)

// Handle User Logout
router.route("/api/logout").
get(handleLogOut)

// Activate Login User Page
router.get("/activate-email-link/:token", activatePage)

// Reset Login User Page
router.get("/reset-password-link/:token", resetPasswordPage)

// Handle Change Password
router.put("/change-password/:token", passwordChange)

// Get All Images
// router.get("/api/all-images", ensureAdminAuthenticated, getImages)
router.get("/api/all-images", getImages)

// Update An Image
// router.put("/api/edit-image/:key", ensureAdminAuthenticated, editImage)
router.put("/api/edit-image/:key", editImage)

// Add An Image
router.route("/api/add-image")
.post(addImage)

// Delete An Image
// router.delete("/api/delete-image/:key", ensureAdminAuthenticated, deleteImage)
router.delete("/api/delete-image/:key", deleteImage)

module.exports = router