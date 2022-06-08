const mongoose = require("mongoose")

const CbtUserSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    school: {
        type: String,
        required: true
    },
    className: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
	category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    accessCode: {
        type: Number,
        required: true
    },
    creator: {
        type: Number,
        required: true
    },
    activeExam: {
        type: String
    },
    role: {
        type: String,
        default: "student",
        enum: ["admin", "student", "moderator"]
    },
    regType: {
        type: String,
        default: "self",
        enum: ["add", "self"]
    },
    examTime: {
        type: Number
    }
})

const CbtUser = mongoose.model("CbtUser", CbtUserSchema)
module.exports = CbtUser
