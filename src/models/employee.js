const mongoose = require('mongoose')
const validator = require('validator')

const employeeSchema = new mongoose.Schema({
    name: {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        middleName: {
            type: String,
            required: false,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
    },
    aboutMe : {
        type : String,
        required : false,
        
    },
    bio : {
        type : String,
        required : false
    },
    password: {
        type: String,
        required: false,
        trim: true,
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
    dateOfBirth: {
        type: Date,
        required: false
    },
    phone : {
        type : String,
        unique : true,
        required : true,
        trim : true
    },
    experience : {
        type : Number,
        trim : true
    },
    skills : [{
        type : String,
        trim : true
    }],
    isAdmin: {
        type: Boolean,
        default : false,
        required: true,
        trim: true
    },
    isApproved: {
        type: Boolean,
        default : false,
        required: true,
        trim: true
    },
    prefferedLocations : [{
        type : String,
        trim : true
    }],
    certificates: [{
        type: String,
        required: false,
        trim: true
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
    otp : {
        type : Number,
        trim : true
    },
    isApproved: {
        type: Boolean,
        default : false,
        required: true,
        trim: true
    },
})

//Getting public employee details
employeeSchema.methods.toJSON = function() {
    const employee = this;
    return {
        name: {
            firstName : employee.name.firstName,
            middleName : employee.name.middleName,
            lastName: employee.name.lastName
        },
        aboutMe : employee.aboutMe,
        bio : employee.bio,
        isAdmin : employee.isAdmin,
        isApproved : employee.isApproved,
        dateOfBirth: (employee.dateOfBirth ? employee.dateOfBirth.toLocaleDateString('IST', dayOptions) : undefined),
        age : (employee.dateOfBirth ? 
            (new Date(Date.now()).getFullYear() - employee.dateOfBirth.getFullYear()) : undefined ),
        email: employee.email,
        phone: employee.phone,
        experience: employee.experience,
        certificates: employee.certificates,
        skills: employee.skills,
        avatar : employee.avatar,
        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt
    }
}

//Find employee by phone and password combo
employeeSchema.statics.findByCredentials = async (phone, password) => {
    const employee = await Employees.findOne({ phone });
    if (!employee) {
        throw new Error('Wrong username or password');
    } else {
        const isMatch = await bcrypt.compare(password, employee.password);

        if (!isMatch) {
            throw new Error('Wrong username or password');
        }
        return employee;
    }
};

//Create new Employee collection
const Employee = mongoose.model('Employees', employeeSchema)

module.exports = Employee