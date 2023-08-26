import mongoose from 'mongoose'

const streamingSchhema=mongoose.Schema({
    admin:{
        type:String,
    },
    isLiveNow:{
        type:Boolean,
        default:false
    },
   
}, {
    timestamps: true
});

const streaming = mongoose.model('streamings',streamingSchhema); //creating a  collection(table) by checking with UserSchema

export default streaming;