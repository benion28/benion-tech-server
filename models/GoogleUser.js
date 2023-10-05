const mongoose = require("mongoose")

const GoogleUserSchema = mongoose.Schema({
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
    googleId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: "guest"
    },
    image: {
        type: String,
        default: ""
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

const GoogleUser = mongoose.model("GoogleUser", GoogleUserSchema)
module.exports = GoogleUser
