const mongoose = require("mongoose");

const ScenarioSchema = new mongoose.Schema(
    {
        Theme: {
            type: String
        },
        Context: {
            type: String
        },
        Name: {
            type: String
        },
        Self: {
            type: Boolean
        },
        Other_Person: {
            Name: {
                type: String
            },
            Age: {
                type: String
            },
            Gender: {
                type: String
            },
            Relationship: {
                type: String
            }
        },
        Age: {
            type: String
        },
        Gender: {
            type: String
        },
        Medicines: {
            type: String
        },
        AdditionalMeds: {
            type: String
        },
        History: {
            type: String
        },
        Symptoms: {
            type: String
        },
        Allergies: {
            type: String
        },
        Time: {
            type: String
        },
        Emotion:  {
            type: String
        },
        AdditionalInfo:  {
            type: String
        },
        Outcome: {
            type: String
        },
        AI: {
            type: String
        },
        Model: {
            type: String
        },
        TTS: {
            type: String
        },
        Voice: {
            type: String
        },
        Avatar: {
            type: String
        }
    }, { timestamps: true }
);


module.exports = mongoose.model("Scenario", ScenarioSchema);