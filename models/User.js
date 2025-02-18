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
    AcademicYear:{
        type: String 
    },
    Roles: {
        type: [String],
        enum: ["admin", "staff", "student"]
    },
    RefreshToken: {
        type: [String],
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