import mongoose from 'mongoose';

const addressSchema = mongoose.Schema({
    street: {
        type: String,
        default: ''
    },
    apartmentNumber: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    state: {
        type: String,
        default: ''
    },
    zipCode: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: 'USA'
    }
});

const personalInfoSchema = mongoose.Schema({
    user: {
        type: String,
    },
    // personal
    dob: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        default: ''
    },
    address: {
        type: addressSchema,
        default: {}
    },
    defaultCountryCode:{
        type: String,
        default: ''
    },
    number:{
        type: String,
        default: ''
    },
    email:{
        type: String,
        default: ''
    },

    // medicare
    medicare_medicaid: {
        type: String,
        default: ''
    },
    medicare_ID: {
        type: String,
        default: ''
    },
    insurance_company: {
        type: String,
        default: ''
    },
    insurance_ID: {
        type: String,
        default: ''
    },

    // doctorInfo
   doctorsInfo:Array

}, {
    timestamps: true
});

const personalinfo = mongoose.model('personalInfo', personalInfoSchema);

export default personalinfo;
