const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    Email: {
        type: String,
        required: true,
        unqiue: true
    },
    Password: {
        type: String
    },
    StudentNo: {
        type: String,
        unique: true
    },
    Roles: {
        type: [String],
        enum: ["superUser", "staff", "student"]
    },
    RefreshToken: {
        type: [String],
    },
    ResetToken: {
        type: String,
    },
    TempPassword: {
        type: Boolean
    },
    LoginAttempts: {
        type: Number,
        min: 0,
        max: 3
    }

})

module.exports = mongoose.model("User", userSchema);