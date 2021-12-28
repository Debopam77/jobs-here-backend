const express = require("express")
const recruiterRouter = require('./routers/Recruiter')
const employeeRouter = require('./routers/Employee')
const port = process.env.PORT || 5000;
const cors = require('cors')
const helmet = require('helmet')

const app = express()
app.use(helmet())
app.use(cors())

//Accept JSON request body
app.use(express.json({limit: '50mb', extended: true}))
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}))

app.listen(port, ()=> console.log('Server is up on port '+port))
app.use(recruiterRouter)
app.use(employeeRouter)