const mongoose = require("mongoose");

const TranscriptSchema = new mongoose.Schema(
    {

        Filename: {
            type: String
        }
        
        
        
    }, {timestamps:true}
);


module.exports = mongoose.model("Transcript", TranscriptSchema);