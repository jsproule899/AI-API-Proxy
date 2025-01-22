const mongoose = require("mongoose");
const {ScenarioSchema} = require("./Scenario");
const Scenario = mongoose.model("Scenario", ScenarioSchema);

const TranscriptSchema = new mongoose.Schema(
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
        //TODO add user       

    }, { timestamps: true }
);


module.exports = mongoose.model("Transcript", TranscriptSchema);