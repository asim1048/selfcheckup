import mongoose from 'mongoose'

const answerSchema=mongoose.Schema({
    user:{
        type:String,
    },
    questionId:{
        type:String,
    },
    answer:{
        type:String,

    },
    
});

const answer = mongoose.model('answer',answerSchema); //creating a  collection(table) by checking with UserSchema

export default answer;