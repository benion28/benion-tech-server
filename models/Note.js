const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "public",
        enum: ["public", "private"]
    },
    category: {
        type: String,
        default: "others",
        enum: ["mathematics", "forestry", "programming", "others"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AdminUser"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Note", NoteSchema);