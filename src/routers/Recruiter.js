require('../db/mongooseConnection')
const Recruiter = require('../models/recruiter')
const express = require('express')
const app = new express.Router()

//Get recruiter
app.get('/recruiter', async (req, res)=> {
    try {
        const recruiter = await Recruiter.find(req.body)
        res.status(201).send(recruiter)
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
})

//Create recruiter
app.post('/recruiter', async (req, res) => {
    const recruiter = new Recruiter(req.body)
    try {
        await recruiter.save()
        console.log(recruiter)
        res.status(201).send(recruiter)
    }catch(e) {
        console.log(e)
        res.status(500).send(e)
    }
})

//Update recruiter
app.patch('/recruiter', async (req, res) => {
    updatesNotAllowed = ['phone', '_id']
    recruiter = await Recruiter.findOne({phone : req.body.phone});
    let updates = Object.keys(req.body)
    const isAllowed = updates.filter((value)=> !updatesNotAllowed.includes(value))
    if (!isAllowed)
        return res.status(400).send({error : 'Invalid fields'})
    try {
        updates.forEach((update) => {recruiter[update] = req.body[update]})
        await recruiter.save();
        res.send(recruiter)
    }catch(e) {
        console.log(e)
        res.status(400).send({error : 'Couldnt update recruiter', message : e})
    }    
})

//Delete recruiter
app.delete('/recruiter', async (req, res) => {
    try {
        const removeRecruiter = await Recruiter.findOne({phone : req.body.phone})
        await removeRecruiter.remove()
        res.send(removeRecruiter)
    }catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

module.exports = app