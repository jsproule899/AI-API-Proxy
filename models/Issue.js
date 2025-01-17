const mongoose = require("mongoose");
const {ScenarioSchema} = require("./Scenario");
const Scenario = mongoose.model("Scenario", ScenarioSchema);

const IssueSchema = new mongoose.Schema(
    {
       
        Category: {
            type: String
        },
        Details: {
            type: String
        },
        Scenario: {
            type: mongoose.ObjectId,
            ref: Scenario
        },
        Status: {
            type: String,
            enum: ['NEW', 'IN-PROGRESS', 'RESOLVED']
        },


    }, { timestamps: true }
);


module.exports = mongoose.model("Issue", IssueSchema);