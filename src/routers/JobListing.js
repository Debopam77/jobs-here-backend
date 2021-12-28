require('../db/mongooseConnection')
const Listing = require('../models/jobListing')
const express = require('express')
const app = new express.Router()

//Get Listings
app.get('/listing', async (req, res) => {
    try {
        const listing = await Listing.find(req.body)
        res.status(201).send(listing)
    }catch(e) {
        console.log(e)
        res.status(500).send(e)
    }
})

//Create listing
app.post('/listing', async (req, res) => {
    const listing = new Listing(req.body)
    try {
        await listing.save()
        console.log(listing)
        res.status(201).send(listing)
    }catch(e) {
        console.log(e)
        res.status(500).send(e)
    }
})

// //Update listing
// app.patch('/listing', async (req, res) => {
//     updatesNotAllowed = ['companyName', '_id']
//     listing = await Listing.findOne({phone : req.body.phone});
//     let updates = Object.keys(req.body)
//     const isAllowed = updates.filter((value)=> !updatesNotAllowed.includes(value))
//     if (!isAllowed)
//         return res.status(400).send({error : 'Invalid fields'})
//     try {
//         updates.forEach((update) => {listing[update] = req.body[update]})
//         await listing.save();
//         res.send(listing)
//     }catch(e) {
//         console.log(e)
//         res.status(400).send({error : 'Couldnt update listing', message : e})
//     }    
// })

// //Delete listing
// app.delete('/listing', async (req, res) => {
//     try {
//         const removeListing = await Listing.findOne({companyName : req.body.companyName})
//         await removeListing.remove()
//         res.send(removeListing)
//     }catch (e) {
//         console.log(e)
//         res.status(500).send()
//     }
// })

module.exports = app