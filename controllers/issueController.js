const Issue = require('../models/Issue')


const find = async (req, res) => {

    Issue.find().populate('Scenario').then(issues => {
        res.json(issues)
    }).catch(err => res.status(500).json(err.message))

}

const findById = async (req, res) => {
    const { id } = req.params;
    Issue.findById(id).then(Issue => {
        res.json(Issue)
    }).catch(err => res.status(500).json(err.message))

}

const create = async (req, res) => {

    const SaveIssue = new Issue({ ... req.body, Status:"NEW" })
    SaveIssue.save().then(savedIssue => {
        res.status(201).json(savedIssue)
    }).catch(err => res.status(500).json(err.message))

}

const update = async (req, res) => {
    const { id } = req.params;
    Issue.findByIdAndUpdate(id, req.body).then(
        res.status(202).json({ Message: "Success" })
    ).catch(err => res.status(500).json(err.message))
}

const remove = async (req, res) => {
    const { id } = req.params;
    Issue.findByIdAndDelete(id).then(
        res.status(204).json({ Message: "Success" })
    ).catch(err => res.status(500).json(err.message))
}

module.exports = { create, find, findById, remove, update }