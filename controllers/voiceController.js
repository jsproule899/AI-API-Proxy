const Voice = require('../models/Voice')


const find = async (req, res) => {

    Voice.find().then(issues => {
        res.json(issues)
    }).catch(err => res.status(500).json(err.message))

}

const findById = async (req, res) => {
    const { id } = req.params;
    Voice.findById(id).then(Voice => {
        res.json(Voice)
    }).catch(err => res.status(500).json(err.message))

}

const create = async (req, res) => {

    const SaveVoice = new Voice({ ... req.body})
    SaveVoice.save().then(savedVoice => {
        res.status(201).json(savedVoice)
    }).catch(err => res.status(500).json(err.message))

}

const update = async (req, res) => {
    const { id } = req.params;
    Voice.findByIdAndUpdate(id, req.body).then(
        res.status(202).json({ Message: "Success" })
    ).catch(err => res.status(500).json(err.message))
}

const remove = async (req, res) => {
    const { id } = req.params;
    Voice.findByIdAndDelete(id).then(
        res.status(204).json({ Message: "Success" })
    ).catch(err => res.status(500).json(err.message))
}

module.exports = { create, find, findById, remove, update }