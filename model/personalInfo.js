import mongoose from 'mongoose'

const personalInfoSchema = mongoose.Schema({
    user: {
        type: String,
    },
    //personal
    dob: {
        type: String,
        default:""
    },
    gender: {
        type: String,
        default:""

    },
    address: {
        type: String,
        default:""
    },
  
    //medicare
    medicare_medicaid: {
        type: String,
        default:""
    },
    medicare_ID: {
        type: String,
        default:""
    },
    insurance_company: {
        type: String,
        default:""
    },
    insurance_ID: {
        type: String,
        default:""
    },

    //doctorInfo
    doctorFName: {
        type: String,
        default:""
    },
    doctorLName: {
        type: String,
        default:""
    },
    doctorPhone: {
        type: String,
        default:""
    },
    
    
}, {
    timestamps: true
});

const personalinfo = mongoose.model('personalInfo', personalInfoSchema); //creating a  collection(table) by checking with UserSchema

export default personalinfo;