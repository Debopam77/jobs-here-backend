require('../db/mongooseConnection')
const express = require('express')
const app = new express.Router()

app.get('/recruiter', async (req, res)=> {
    try {
        console.log('Happy')
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = app