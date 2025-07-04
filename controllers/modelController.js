const Model = require('../models/AIModel')


const find = async (req, res) => {

    Model.find().then(issues => {
        res.json(issues)
    }).catch(err => res.status(500).json(err.message))

}

const findById = async (req, res) => {
    const { id } = req.params;
    Model.findById(id).then(Model => {
        res.json(Model)
    }).catch(err => res.status(500).json(err.message))

}

const create = async (req, res) => {

    const SaveModel = new Model({ ... req.body})
    SaveModel.save().then(savedModel => {
        res.status(201).json(savedModel)
    }).catch(err => res.status(500).json(err.message))

}

const update = async (req, res) => {
    const { id } = req.params;
    Model.findByIdAndUpdate(id, req.body).then(
        res.status(202).json({ Message: "Success" })
    ).catch(err => res.status(500).json(err.message))
}

const remove = async (req, res) => {
    const { id } = req.params;
    Model.findByIdAndDelete(id).then(
        res.status(204).json({ Message: "Success" })
    ).catch(err => res.status(500).json(err.message))
}

module.exports = { create, find, findById, remove, update }