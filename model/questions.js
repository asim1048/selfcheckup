import mongoose from 'mongoose'

const questionsScheme=mongoose.Schema({
    title:{
        type:String,
    },
    options:Array,
   
}, {
    timestamps: true
});

const question = mongoose.model('questions',questionsScheme); //creating a  collection(table) by checking with UserSchema

export default question;