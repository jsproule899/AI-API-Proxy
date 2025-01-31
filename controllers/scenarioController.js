const { default: mongoose } = require('mongoose')
const Scenario = require('../models/Scenario')


const find = async (req, res) => {
    const {page, limit} = req.query;
    Scenario.find().limit(limit).skip(page*limit).then(scenarios => {
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

    const SaveScenario = new Scenario({ ...req.body, Avatar: assignAvatar(req.body) })
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

    //TODO
    if (Gender === 'Male') {
        return "male_01"
    } else {
        return "female_01"
    }

}

module.exports = { create, find, findById, remove, update }