require('../db/mongooseConnection')
const Recruiter = require('../models/recruiter')
const express = require('express')
const app = new express.Router()
const nodemailer = require('nodemailer')

//Mailer function
const transporter = nodemailer.createTransport({
    service : "hotmail",
    auth : {
        user : "jobs-here-365@outlook.com",
        pass : "Asdfg@12345"
    }
})

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
        const email = req.body.email
        await recruiter.save()

        //Send welcome mail to user
        const options = {
            from : "jobs-here-365@outlook.com",
            to : email,
            subject : "Nothing but a world of possibilities!",
            text : "Welcome to Jobs-Here-365, we are glad to be of service"
        }
        transporter.sendMail(options, (err, info) => {
            if(err) {
                console.log(err)
                return
            }
            console.log("Sent: "+info.response)
        })

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
        await Recruiter.save();
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

//Recruiter Login
app.post('/recruiter/login', async(req, res)=> {

    const recruiter = await Recruiter.findOne({phone : req.body.phone, password : req.body.password})
    if (!recruiter){
        res.status(400).send({error : "Wrong phone number or password"})
        return
    }
    console.log(recruiter)
    res.status(201).send(recruiter)
})

//Forgot password - send otp to email
app.patch('/recruiter/forgotPassword', async (req, res) => {
    otp_string = 'otp'
    recruiter = await Recruiter.findOne({email : req.body.email});
    try {
        if(!recruiter) {
            res.status(404).send({ error : 'No user exists with said Email'})
            return
        }

        //Generate random OTP
        otp_value = Math.floor(((Math.random()*1000000)%1000000))

        console.log("OTP : "+otp_value)
        recruiter[otp_string] = otp_value
        await recruiter.save();

        //Send Email with OTP
        const options = {
            from : "jobs-here-365@outlook.com",
            to : req.body.email,
            subject : "Your OTP for Jobs-here-365",
            text : `Hi ${recruiter.companyName}, ${otp_value} is your otp for reseting your password
            Do not share this with anyone!`
        }

        transporter.sendMail(options, (err, info) => {
            if(err) {
                console.log(err)
                return
            }
            console.log("Sent: "+info.response)
        })
        
        res.send(recruiter)

    }catch(e) {
        console.log(e)
        res.status(400).send({error : 'Couldnt update recruiter', message : e})
    }    
})

//OTP validate and Change password
app.patch('/recruiter/forgotPassword/otpValidate', async (req, res) => {
    recruiter = await Recruiter.findOne({email : req.body.email});
    try {
        if (recruiter.otp !== req.body.otp) {
            res.status(400).send({error: 'Incorrect OTP'})
            return
        }
        //If otp is matched then update password
        recruiter['password'] = req.body.password
        await recruiter.save();
        res.send(recruiter)
    }catch(e) {
        console.log(e)
        res.status(400).send({error : 'Couldnt update recruiter', message : e})
    }    
})

module.exports = app