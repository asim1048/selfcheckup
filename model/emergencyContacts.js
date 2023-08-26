import mongoose from 'mongoose'

const userScheme=mongoose.Schema({
    user:{
        type:String,
    },
    fName:{
        type:String,
    },
    lName:{
        type:String,
    },
    number:{
        type:String,

    },
    relation:{
        type:String,

    },
}, {
    timestamps: true
});

const emergencyContacts = mongoose.model('emergencyContacts',userScheme); //creating a  collection(table) by checking with UserSchema

export default emergencyContacts;