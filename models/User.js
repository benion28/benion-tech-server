const mongoose = require("mongoose");

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
    city: {
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
    date: {
        type: Date,
        default: Date.now
    },
    resetToken: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        default: "guest",
        enum: ["admin", "guest"]
    },
    amountBalance: {
        type: Number,
        default: 0
    }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;