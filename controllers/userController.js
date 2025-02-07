const User = require('../models/User')

const find = async (req, res) => {

    User.find().then(users => {
        res.json(users)
    }).catch(err => res.status(500).json(err.message))

}

const findById = async (req, res) => {
    const { id } = req.params;
    User.findById(id).then(user => {
        if(!user) res.status(404).json("No user found")
        res.json(user)
    }).catch(err => res.status(500).json(err.message))

}

const findByEmail = async (req, res) => {
    const {email} = req.email;
    User.findOne(email).then(user=>{
        if(!user) res.status(404).json("No user found")
        res.json(user)
    }).catch(err=>{ res.satus(500).json(err.message)
    })
}

const create = async (req, res) => {
    const SaveUser = new User(req.body)
    SaveUser.save().then(savedUser => {
        res.status(201).json(savedUser)
    }).catch(err => res.status(500).json(err.message))

}

const update = async (req, res) => {
    const { id } = req.params;
    User.findByIdAndUpdate(id, req.body).then(
        res.status(202).json({ Message: "Success" })
    ).catch(err => res.status(500).json(err.message))
}

const remove = async (req, res) => {
    const { id } = req.params;
    User.findByIdAndDelete(id).then(
        res.status(204).json({ Message: "Success" })
    ).catch(err => res.status(500).json(err.message))
}

module.exports = { create, find, findById, findByEmail, remove, update }