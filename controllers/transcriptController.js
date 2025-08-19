const Transcript = require('../models/Transcript')


const find = async (req, res) => {
    const { page=0, limit=0 } = req.query;
    Transcript.find().limit(limit).skip(page * limit).populate('Scenario').then(Transcripts => {
        res.json(Transcripts)
    }).catch(err => res.status(500).json(err.message))

}

const findById = async (req, res) => {
    const { id } = req.params;
    Transcript.findById(id).populate('Scenario').then(Transcript => {
        res.json(Transcript)
    }).catch(err => res.status(500).json(err.message))

}

const findByStudent = async (req, res) => {
    const { studentNo } = req.params;
    Transcript.find({ StudentNo: studentNo }).populate('Scenario').then(Transcript => {
        res.json(Transcript)
    }).catch(err => res.status(500).json(err.message))

}

const create = async (req, res) => {
    const SaveTranscript = new Transcript(req.body)
    SaveTranscript.save().then(savedTranscript => {
        res.status(201).json(savedTranscript)
    }).catch(err => res.status(500).json(err.message))

}

const update = async (req, res) => {
    const { id } = req.params;
    Transcript.findByIdAndUpdate(id, req.body).then(
        res.status(202).json({ Message: "Success" })
    ).catch(err => res.status(500).json(err.message))
}

const remove = async (req, res) => {
    const { id } = req.params;
    Transcript.findByIdAndDelete(id).then(
        res.status(204).json({ Message: "Success" })
    ).catch(err => res.status(500).json(err.message))
}

module.exports = { create, find, findById, findByStudent, remove, update }