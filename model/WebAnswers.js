import mongoose from 'mongoose'

const answerSchema=mongoose.Schema({
    type:{
        type:String,
    },
    userId:{
        type:String,
    },
    userName:{
        type:String,
    },
    title:{
        type:String,
    },
    description:{
        type:String,
    },
    
}, {
    timestamps: true
});

const webAnswer = mongoose.model('webAnswer',answerSchema); //creating a  collection(table) by checking with UserSchema

export default webAnswer;