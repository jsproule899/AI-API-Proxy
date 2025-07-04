const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema({

    Name: {
        type: String,
        required: true,
        unqiue: true
    }, 
    Description: {
        type: String,
    }, 
    ModelId: {
        type: String,
        required: true,
        unqiue: true
    },
    Provider: {
        type: String,
        required: true,
    },



})

module.exports = mongoose.model("Model", modelSchema);