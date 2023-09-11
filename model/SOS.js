import mongoose from 'mongoose'

const SOSSchema=mongoose.Schema({
    user:{
        type:String,
    },    
}, {
    timestamps: true
});

const SOS = mongoose.model('SOS',SOSSchema); //creating a  collection(table) by checking with UserSchema

export default SOS;