const mongoose = require("mongoose");

const voiceSchema = new mongoose.Schema({

    Name: {
        type: String,
        required: true,
        unqiue: true
    }, 
    Description: {
        type: String,
    }, 
    VoiceId: {
        type: String,
        required: true,
        unqiue: true
    },
    Provider: {
        type: String,
        required: true,
    },



})

module.exports = mongoose.model("Voice", voiceSchema);