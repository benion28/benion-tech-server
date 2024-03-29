const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
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
    town: {
        type: String,
        required: true
    },
    email: {
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
    date: {
        type: Date,
        default: Date.now
    },
    birthday: {
        type: Date,
        default: Date.now
    },
    resetToken: {
        type: String
    },
    role: {
        type: String,
        default: "guest",
        enum: ["admin", "guest"]
    },
    amountBalance: {
        type: Number,
        default: 0
    },
    profile: {
        type: String,
        default: ""
    },
    job: {
        type: String,
        default: "Student"
    }
})

const User = mongoose.model("User", UserSchema)
module.exports = User
