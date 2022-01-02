const mongoose = require('mongoose')
const validator = require('validator')

const recruiterSchema = new mongoose.Schema({
    companyName : {
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        validate: (pass) => {
            if (pass.length > 6) {
                const easyPass = ['password', '1234'];
                const flag = easyPass.every((p) => {
                    if (pass.toLowerCase().includes(p)) {
                        return false;
                    } else
                        return true;
                });
                if (flag === false)
                    throw new Error('Choose an uncommon password');
            } else {
                throw new Error('Length must be greater than 6')
            }
        }
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
    phone : {
        type : String,
        unique : true,
        required : true,
        trim : true
    },
    dateOfEstablishment : {
        type : Date,
        required : false
    },
    headquarter : {
        type : String,
        required : true
    },
    locations : [{
        type : String,
        required : false
    }],
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }],
    isApproved: {
        type: Boolean,
        default : false,
        required: true,
        trim: true
    },
    otp: {
        type: Number,
        trim: true
    }
})

//Public details of recruiters
recruiterSchema.methods.toJSON = function () {
    const recruiter = this

    return {
        companyName : recruiter.companyName,
        email : recruiter.email,
        phone : recruiter.phone,
        dateOfEstablishment : recruiter.dateOfEstablishment,
        locations : recruiter.locations,
        headquarter : recruiter.headquarter,
        avatar : recruiter.avatar,
        createdAt: recruiter.createdAt,
        updatedAt: recruiter.updatedAt
    }
}

//Find recruiter by phone and password combo
recruiterSchema.statics.findByCredentials = async (phone, password) => {
    const recruiter = await Recruiters.findOne({ phone });
    if (!recruiter) {
        throw new Error('Wrong username or password');
    } else {
        const isMatch = await bcrypt.compare(password, recruiter.password);

        if (!isMatch) {
            throw new Error('Wrong username or password');
        }
        return recruiter;
    }
};

//Create new Recruiter collection
const Recruiter = mongoose.model('Recruiters', recruiterSchema)

module.exports = Recruiter