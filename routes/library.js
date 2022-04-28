const express = require("express");
const router = express.Router();
const { ensureAuthentication, ensureAdminAuthenticated } = require("../config/auth");
const {
    handleNewNote,
    handleShowAllNotes,
    handleShowAllUserNotes,
    handleShowAllForestryNotes,
    handleShowAllMathematicsNotes,
    handleShowAllOthersNotes,
    handleShowAllPublicNotes,
    handleShowAllPrivateNotes,
    handleShowSingleAdminNote,
    handleShowSingleNote,
    handleShowEditNote,
    handleEditNote,
    handleDeleteNote
} = require("../users-passport/controllers/notes");

// @desc Show Library Page
// @route GET /benion-library
router.get("/", (request, response) => {
    response.render("main/libraryPage", {
        user: request.user
    });
    response.status(304);
});

// @desc Show New Note PagePage
// @route GET /benion-library/benion-admin-new-note
router.get("/benion-admin-new-note", ensureAdminAuthenticated, (request, response) => {
    response.render("notes/addNote", {
        layout: "notes/layout"
    });
});

// @desc Process New Note Form
// @route POST /benion-library/benion-admin-new-note"
router.post("/benion-admin-new-note", ensureAdminAuthenticated, handleNewNote);

// @desc Show All Notes
// @route GET /benion-library/benion-all-notes
router.get("/benion-all-notes", ensureAdminAuthenticated, handleShowAllNotes);

// @desc Show All User Notes
// @route GET /benion-library/benion-user-notes/:id
router.get("/benion-user-notes/:id", ensureAdminAuthenticated, handleShowAllUserNotes);

// @desc Show All Forestry Notes
// @route GET /benion-library/benion-forestry-notes
router.get("/benion-forestry-notes", ensureAdminAuthenticated, handleShowAllForestryNotes);

// @desc Show All Mathematics Notes
// @route GET /benion-library/benion-mathematics-notes
router.get("/benion-mathematics-notes", ensureAdminAuthenticated, handleShowAllMathematicsNotes);

// @desc Show All Others Notes
// @route GET /benion-library/benion-others-notes
router.get("/benion-others-notes", ensureAdminAuthenticated, handleShowAllOthersNotes);

// @desc Show All Public Notes
// @route GET /benion-library/benion-library/benion-public-notes
router.get("/benion-public-notes", ensureAuthentication, handleShowAllPublicNotes);

// @desc Show All Private Notes
// @route GET /benion-library/benion-private-notes
router.get("/benion-private-notes", ensureAuthentication, handleShowAllPrivateNotes);

// @desc Show Single Admin Note
// @route GET /benion-library/benion-read-admin-notes/:id
router.get("/benion-read-admin-notes/:id", ensureAdminAuthenticated, handleShowSingleAdminNote);

// @desc Show Single Note
// @route GET /benion-library/benion-read-notes/:id
router.get("/benion-read-notes/:id", ensureAuthentication, handleShowSingleNote);

// @desc Show Edit Note Page
// @route GET /benion-library/benion-admin-edit-note/:id
router.get("/benion-admin-edit-note/:id", ensureAdminAuthenticated, handleShowEditNote);

// @desc Update Note
// @route PUT /benion-library/benion-admin-edit-note/:id
router.put("/benion-admin-edit-note/:id", ensureAdminAuthenticated, handleEditNote);

// @desc Delete A Note
// @route DELETE /benion-library/benion-admin-delete-note/:id
router.delete("/benion-admin-delete-note/:id", ensureAdminAuthenticated, handleDeleteNote);


module.exports = router;