require('../db/mongooseConnection')
const Employee = require('../models/employee')
const express = require('express')
const app = new express.Router()

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

//Create employee
app.post('/employee', async (req, res) => {
    const employee = new Employee(req.body)
    try {
        await employee.save()
        console.log(employee)
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

module.exports = app