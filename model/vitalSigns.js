import mongoose from 'mongoose'

const userScheme=mongoose.Schema({
    number:{
        type:String,
    },
    bloodPressure:{
        type:String,
    },
    sugarLevel:{
        type:String,

    },
    pulse:{
        type:String,

    },
    temperature:{
        type:String,

    },
}, {
    timestamps: true
});

const vitalSigns = mongoose.model('vitalSigns',userScheme); //creating a  collection(table) by checking with UserSchema

export default vitalSigns;