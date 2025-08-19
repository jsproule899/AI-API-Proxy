const mongoose = require("mongoose");
const {ScenarioSchema} = require("./Scenario");
const Scenario = mongoose.model("Scenario", ScenarioSchema);

const transcriptSchema = new mongoose.Schema(
    {
        Filename: {
            type: String
        },
        Data: {
            type: String
        },
        Scenario: {
            type: mongoose.ObjectId,
            ref: Scenario
        },
        StudentNo: {
            type: String,
        },
        Student: {
            type: String,
        },
             

    }, { timestamps: true }
);


module.exports = mongoose.model("Transcript", transcriptSchema);