import mongoose from 'mongoose'

const answers=mongoose.Schema({
    user:{
        type:String,
    },
    isActionRequired:{
        type:Boolean,
        default:false
    },
    isActionTaken:{
        type:Boolean,
        default:false,
    },
    QnA:Array,
    
}, {
    timestamps: true
});

const DailyRoutineAnswers = mongoose.model('dailyRoutineAnswers',answers); //creating a  collection(table) by checking with UserSchema

export default DailyRoutineAnswers;