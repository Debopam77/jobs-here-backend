const mongoose = require('mongoose')
const validator = require('validator')

const jobListingSchema = new mongoose.Schema({
    companyName : {
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    email: {
        type: String,
        required: false,
        trim: true,
        lowercase: true,
        validate: (value) => {
            if (!validator.isEmail(value))
                throw new Error('Invalid email entered..');
        }
    },
    experience : {
        type : Number,
        trim : true
    },
    skills : [{
        type : String,
        trim : true
    }],
    location : {
        type : String,
        trim : true
    }
})

//Getting job listing details
jobListingSchema.methods.toJSON = function () {
    const job = this;

    return {
        companyName : job.companyName,
        email : job.email,
        experience : job.experience,
        skills : job.skills,
        location : job.location
    }
}

const jobListing = mongoose.model('JobListings', jobListingSchema)

module.exports = jobListing