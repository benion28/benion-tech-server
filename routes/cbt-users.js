const express = require("express")
const router = express.Router()
const {
    getCbtUsers,
    deleteCbtUser,
    deleteAllCbtUsers,
    findCbtUsername,
    registerCbtUser,
    updateCbtUser,
    addCbtUser,
    handleCbtLogin,
    handleCbtLogOut,
    updateCbtUserPassword
} = require("../controllers/cbtUsers")

const { 
    getCbtExamData,
    addExamQuestion,
    editExamQuestion,
    deleteExamQuestion,
    getCbtExamQuestions
} = require("../controllers/cbtExam")

// Register A Cbt User
router.route("/api/register")
.post(registerCbtUser)

// Add A Cbt User
router.route("/api/add-user")
.post(addCbtUser)

// Delete A Cbt User
// router.delete("/api/delete-user/:id", ensureAdminAuthenticated, deleteCbtUser)
router.delete("/api/delete-user/:id", deleteCbtUser)

// Delete All Cbt Users
// router.delete("/api/delete-all-user", ensureAdminAuthenticated, deleteAllCbtUsers)
router.delete("/api/delete-all-user", deleteAllCbtUsers)

// Update A Cbt User
// router.put("/api/edit-user/:id", ensureAdminAuthenticated, updateCbtUser)
router.put("/api/edit-user/:id", updateCbtUser)

// Get All Cbt Users
// router.get("/api/users", ensureAdminAuthenticated, getCbtUsers)
router.get("/api/users", getCbtUsers)

// Get Cbt Usersname
// router.get("/api/find-username", ensureAdminAuthenticated, findCbtUsername)
router.get("/api/find-username", findCbtUsername)

// Handle Cbt User Logout
router.route("/api/logout").
get(handleCbtLogOut)

// Handle Cbt User Login
router.route("/api/login").
post(handleCbtLogin)

// Update A Cbt User Password
// router.put("/api/edit-user-password", ensureAdminAuthenticated, updateCbtUser)
router.put("/api/edit-user-password", updateCbtUserPassword)


// Get All Cbt Exam Data
// router.get("/api/cbt-exam-data", ensureAdminAuthenticated, getCbtExamData)
router.get("/api/cbt-exam-data", getCbtExamData)


// Get All Cbt Exam Question
// router.get("/api/cbt-exam-questions", ensureAdminAuthenticated, getCbtExamQuestions)
router.get("/api/cbt-exam-questions", getCbtExamQuestions)


// Update An Exam Question
// router.put("/api/edit-question/:key", ensureAdminAuthenticated, updateCbtUser)
router.put("/api/edit-question/:key", editExamQuestion)

// Add An Exam Question
router.route("/api/add-question")
.post(addExamQuestion)

// Delete An Exam Question
// router.delete("/api/delete-question/:key", ensureAdminAuthenticated, deleteExamQuestion)
router.delete("/api/delete-question/:key", deleteExamQuestion)

module.exports = router