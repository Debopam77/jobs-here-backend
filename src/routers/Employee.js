require('../db/mongooseConnection')
const Employee = require('../models/employee')
const express = require('express')
const nodemailer = require('nodemailer')
const app = new express.Router()

//Mailer function
const transporter = nodemailer.createTransport({
    service : "hotmail",
    auth : {
        user : "jobs-here-365@outlook.com",
        pass : "Asdfg@12345"
    }
})

//Get all employees
app.get('/employee', async (req, res)=> {
    try {
        const employee = await Employee.find(req.body)
        console.log(employee)
        res.send(employee)
    }catch(e){
        res.status(500).send(e)
    }
})

//Employee Login
app.post('/employee/login', async(req, res)=> {
    console.log(req.body)
    const employee = await Employee.findOne({phone : req.body.phone, password : req.body.password})
    if (!employee){
        res.status(400).send({error : "Wrong phone number or password"})
        return
    }
    console.log(employee)
    res.status(201).send(employee)
})

//Create employee
app.post('/employee', async (req, res) => {
    const employee = new Employee(req.body)
    try {
        const email = req.body.email
        
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

        //Saving employee to DB
        await employee.save()

        res.status(201).send(employee)
    }catch(e) {
        console.log(e)
        res.status(500).send(e)
    }
})

//Update employee
app.patch('/employee', async (req, res) => {
    updatesNotAllowed = ['phone', '_id']
    employee = await Employee.findOne({phone : req.body.phone});
    let updates = Object.keys(req.body)
    const isAllowed = updates.filter((value)=> !updatesNotAllowed.includes(value))
    if (!isAllowed)
        return res.status(400).send({error : 'Invalid fields'})
    try {
        updates.forEach((update) => {employee[update] = req.body[update]})
        await employee.save();
        res.send(employee)
    }catch(e) {
        console.log(e)
        res.status(400).send({error : 'Couldnt update employee', message : e})
    }    
})

//Delete employee
app.delete('/employee', async (req, res) => {
    try {
        const removeEmployee = await Employee.findOne({phone : req.body.phone})
        await removeEmployee.remove()
        res.send(removeEmployee)
    }catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

//Forgot password - send otp to email
app.patch('/employee/forgotPassword', async (req, res) => {
    otp_string = 'otp'
    employee = await Employee.findOne({email : req.body.email});
    try {

        if(!employee) {
            res.status(404).send({ error : 'No user exists with said Email'})
            return
        }
        //Generate random OTP
        otp_value = Math.floor(((Math.random()*1000000)%1000000))

        //Send Email with OTP
        const options = {
            from : "jobs-here-365@outlook.com",
            to : req.body.email,
            subject : "Your OTP for Jobs-here-365",
            text : `Hi ${employee.name.firstName}, ${otp_value} is your otp for reseting your password
            Do not share this with anyone!`
        }
        transporter.sendMail(options, (err, info) => {
            if(err) {
                console.log(err)
                return
            }
            console.log("Sent: "+info.response)
        })
        
        console.log("OTP : "+otp_value)
        employee[otp_string] = otp_value
        await employee.save();
        res.send(employee)
    }catch(e) {
        console.log(e)
        res.status(400).send({error : 'Couldnt update employee', message : e})
    }    
})

//OTP validate and Change password
app.patch('/employee/forgotPassword/otpValidate', async (req, res) => {
    employee = await Employee.findOne({email : req.body.email});
    try {
        if (employee.otp !== req.body.otp) {
            res.status(400).send({error: 'Incorrect OTP'})
            return
        }
        //If otp is matched then update password
        employee['password'] = req.body.password
        await employee.save();
        res.send(employee)
    }catch(e) {
        console.log(e)
        res.status(400).send({error : 'Couldnt update employee', message : e})
    }    
})
module.exports = app