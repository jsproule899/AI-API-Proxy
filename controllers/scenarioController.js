const { default: mongoose } = require('mongoose')
const Scenario = require('../models/Scenario')


const find = async (req, res) => {
    const { page=0, limit=0 } = req.query;
    Scenario.find().limit(limit).skip(page * limit).then(scenarios => {
        if(!scenarios || scenarios.length === 0) return res.status(204).json({});
        res.json(scenarios)
    }).catch(err => res.status(500).json(err.message))

}

const findById = async (req, res) => {
    const { id } = req.params;
    Scenario.findById(id).then(scenario => {
        res.json(scenario)
    }).catch(err => res.status(500).json(err.message))

}

const create = async (req, res) => {
    let { Avatar } = req.body;
    if (!Avatar) Avatar = assignAvatar(req.body)
    const SaveScenario = new Scenario({ ...req.body, Avatar })
    SaveScenario.save().then(savedscenario => {
        res.status(201).json(savedscenario)
    }).catch(err => res.status(500).json(err.message))

}

const update = async (req, res) => {
    const { id } = req.params;
    Scenario.findByIdAndUpdate(id, req.body).then(
        res.status(202).json({ Message: "Success" })
    ).catch(err => res.status(500).json(err.message))
}

const remove = async (req, res) => {
    const { id } = req.params;
    Scenario.findByIdAndDelete(id).then(
        res.status(204).json({ Message: "Success" })
    ).catch(err => res.status(500).json(err.message))
}

const assignAvatar = (body) => {
    const { Gender, Age } = body;

    if (Gender === 'Male') {
        return "male_01"
    } else if (Gender === "Female") {
        return "female_01"
    } else if (Gender === "Non-Binary") {
        return "nonbinary_01"
    }

}

module.exports = { create, find, findById, remove, update }