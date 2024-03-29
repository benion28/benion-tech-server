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
    updateCbtUserPassword,
    promoteCbtUser
} = require("../controllers/cbtUsers")

const { 
    getCbtExamData,
    addExamQuestion,
    editExamQuestion,
    deleteExamQuestion,
    getCbtExamQuestions,
    addExamData,
    deleteExamData,
    editExamData,
    testArea,
    deleteScore,
    getScores,
    addScore,
    editScore
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

// Delete A Cbt Exam
// router.delete("/api/delete-exam/:key", ensureAdminAuthenticated, deleteExamData)
router.delete("/api/delete-exam/:key", deleteExamData)

// Delete All Cbt Users
// router.delete("/api/delete-all-user", ensureAdminAuthenticated, deleteAllCbtUsers)
router.delete("/api/delete-all-user", deleteAllCbtUsers)

// Update A Cbt User
// router.put("/api/edit-user/:id", ensureAdminAuthenticated, updateCbtUser)
router.put("/api/edit-user/:id", updateCbtUser)

// Promote Cbt Users
// router.put("/api/promote-users", ensureAdminAuthenticated, promoteCbtUser)
router.put("/api/promote-users", promoteCbtUser)

// Get All Cbt Users
// router.get("/api/users", ensureAdminAuthenticated, getCbtUsers)
router.get("/api/users", getCbtUsers)

// Handle Cbt User Logout
router.route("/api/logout").
get(handleCbtLogOut)

// Handle Cbt User Login
router.route("/api/login").
post(handleCbtLogin)

// Get Cbt Usersname
router.route("/api/find-username").
post(findCbtUsername)

// Update A Cbt User Password
// router.put("/api/edit-user-password", ensureAdminAuthenticated, updateCbtUser)
router.put("/api/edit-user-password", updateCbtUserPassword)

// Update An Exam Data
// router.put("/api/edit-exam", ensureAdminAuthenticated, editExamData)
router.put("/api/edit-exam/:key", editExamData)


// Get All Cbt Exam Data
// router.get("/api/cbt-exam-data", ensureAdminAuthenticated, getCbtExamData)
router.get("/api/cbt-exam-data", getCbtExamData)

// Test Area
router.route("/api/test-area")
.post(testArea)


// Get All Cbt Exam Question
// router.get("/api/cbt-exam-questions", ensureAdminAuthenticated, getCbtExamQuestions)
router.get("/api/cbt-exam-questions", getCbtExamQuestions)

// Get All Cbt Scores
// router.get("/api/cbt-scores", ensureAdminAuthenticated, getCbtExamQuestions)
router.get("/api/cbt-scores", getScores)

// Update An Exam Question
// router.put("/api/edit-question/:key", ensureAdminAuthenticated, updateCbtUser)
router.put("/api/edit-question/:key", editExamQuestion)

// Update A Cbt Score
// router.put("/api/edit-cbt-score/:key", ensureAdminAuthenticated, updateCbtUser)
router.put("/api/edit-cbt-score/:key", editScore)

// Add An Exam Question
router.route("/api/add-question")
.post(addExamQuestion)

// Add A Cbt Score
router.route("/api/add-cbt-score")
.post(addScore)

// Add An Exam Data
router.route("/api/add-exam")
.post(addExamData)

// Delete An Exam Question
// router.delete("/api/delete-question/:key", ensureAdminAuthenticated, deleteExamQuestion)
router.delete("/api/delete-question/:key", deleteExamQuestion)

// Delete A Cbt Score
// router.delete("/api/delete-cbt-score/:key", ensureAdminAuthenticated, deleteExamQuestion)
router.delete("/api/delete-cbt-score/:key", deleteScore)

module.exports = router