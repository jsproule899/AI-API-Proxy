const mongoose = require('mongoose')
const { userSchema } = require("./User");
const User = mongoose.model("User", userSchema);

const resetTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true,
        ref: User,
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 30
    }
});

module.exports = mongoose.model("ResetToken", resetTokenSchema);