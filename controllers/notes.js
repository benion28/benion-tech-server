const Note = require("../models/Note");
const { formatDate, truncate, scriptTags } = require("./helpers");

// Handle New Note
const handleNewNote = async (request, response) => {
    try {
        request.body.user = request.user.id;
        await Note.create(request.body);
        request.flash("success_message", "New Note Added Successfully");
        response.redirect("/benion-library/benion-all-notes");
        response.status(200);
    } catch (error) {
        console.log(error);
        response.render("errors/500");
    }
};

// Handle Show All Notes
const handleShowAllNotes = async (request, response) => {
    try {
        const notes = await Note.find()
            .populate("user")
            .sort({ createdAt: "desc" })
            .lean();
        response.render("notes/allNotes", {
            layout: "notes/layout",
            truncate,
            scriptTags,
            notes
        });
    } catch (error) {
        console.log(error);
        response.render("errors/500");
    }
};

// Handle Show All User Notes
const handleShowAllUserNotes = async (request, response) => {
    try {
        const notes = await Note.find({ user: request.params.id })
            .populate("user")
            .sort({ createdAt: "desc" })
            .lean();
        response.render("notes/allNotes", {
            layout: "notes/layout",
            user: request.user,
            truncate,
            scriptTags,
            notes
        });
    } catch (error) {
        console.log(error);
        response.render("errors/500");
    }
};

// Handle Show All Forestry Notes
const handleShowAllForestryNotes = async (request, response) => {
    try {
        const notes = await Note.find({ category: "Forestry" })
            .populate("user")
            .sort({ createdAt: "desc" })
            .lean();
        response.render("notes/forestryNotes", {
            layout: "notes/layout",
            truncate,
            scriptTags,
            notes
        });
    } catch (error) {
        console.log(error);
        response.render("errors/500");
    }
};

// Handle Show All Mathematics Notes
const handleShowAllMathematicsNotes = async (request, response) => {
    try {
        const notes = await Note.find({ category: "Mathematics" })
            .populate("user")
            .sort({ createdAt: "desc" })
            .lean();
        response.render("notes/mathematicsNotes", {
            layout: "notes/layout",
            truncate,
            scriptTags,
            notes
        });
    } catch (error) {
        console.log(error);
        response.render("errors/500");
    }
};

// Handle Show All Others Notes
const handleShowAllOthersNotes = async (request, response) => {
    try {
        const notes = await Note.find({ category: "Others" })
            .populate("user")
            .sort({ createdAt: "desc" })
            .lean();
        response.render("notes/othersNotes", {
            layout: "notes/layout",
            truncate,
            scriptTags,
            notes
        });
    } catch (error) {
        console.log(error);
        response.render("errors/500");
    }
};

// Handle Show All Public Notes
const handleShowAllPublicNotes = async (request, response) => {
    try {
        const notes = await Note.find({ status: "Public" })
            .populate("user")
            .sort({ createdAt: "desc" })
            .lean();
        response.render("notes/publicNotes", {
            layout: "notes/layout",
            truncate,
            scriptTags,
            notes
        });
    } catch (error) {
        console.log(error);
        response.render("errors/500");
    }
};

// Handle Show All Private Notes
const handleShowAllPrivateNotes = async (request, response) => {
    try {
        const notes = await Note.find({ status: "Private" })
            .populate("user")
            .sort({ createdAt: "desc" })
            .lean();
        response.render("notes/privateNotes", {
            layout: "notes/layout",
            truncate,
            scriptTags,
            notes
        });
    } catch (error) {
        console.log(error);
        response.render("errors/500");
    }
};

// Handle Show Single Admin Note
const handleShowSingleAdminNote = async (request, response) => {
    try {
        let note = await Note.findById(request.params.id)
            .populate("user")
            .lean();
        if (!note) {
            return response.render("errors/404");
        }
        response.render("note/readAdminNotes", {
            layout: "notes/layout",
            user: request.user,
            formatDate,
            note
        });
    } catch (error) {
        console.log(error);
        response.render("errors/404");
    }
};

// Handle Show Single Note
const handleShowSingleNote = async (request, response) => {
    try {
        let note = await Note.findById(request.params.id)
            .populate("user")
            .lean();
        if (!note) {
            return response.render("errors/404");
        }
        response.render("note/readNotes", {
            layout: "notes/layout",
            formatDate,
            note
        });
    } catch (error) {
        console.log(error);
        response.render("errors/404");
    }
};

// Handle Edit Note Page
const handleShowEditNote = async (request, response) => {
    try {
        const note = await Note.findOne({ _id: request.params.id }).lean();
        if (!note) {
            return response.render("errors/404");
        }
        if (note.user != request.user.id) {
            response.redirect("/benion-library/benion-all-notes");
        } else {
            const categories = [ "Programming", "Forestry", "Mathematics", "Others" ];
            const statuses = [ "Private", "Public" ];
            response.render("notes/editNote", {
                layout: "notes/layout",
                statuses,
                categories,
                note
            });
        }
    } catch (error) {
        console.log(error);
        return response.render("errors/500");
    }
};

// Handle Edit Note
const handleEditNote = async (request, response) => {
    try {
        let note = await Note.findById(request.params.id).lean();
        if(!note) {
            return response.render("errors/404")
        }
        note = await Note.findOneAndUpdate({ _id: request.params.id }, request.body, {
            new: true,
            runValidators: true
        });
        request.flash("success_message", "Note Updated Successfully");
        response.redirect("/benion-library/benion-all-notes");
        response.status(200);
    } catch (error) {
        console.log(error);
        return response.render("errors/500");
    }
};

// Handle Delete Note
const handleDeleteNote = async (request, response) => {
    try {
        await Note.remove({ _id: request.params.id });
        request.flash("success_message", "Note Deleted Successfully");
        response.redirect("/benion-library/benion-all-notes");
        response.status(200);
    } catch (error) {
        console.log(error);
        return response.render("errors/500");
    }
};

module.exports = {
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
};