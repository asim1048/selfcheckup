import mongoose from 'mongoose'

const dailyRoutineUserPicsScheme = mongoose.Schema({
    user: {
        type: String,
    },
    image: {
        type: String,
    },
    
}, {
    timestamps: true
});

const dailyRoutineUserPics = mongoose.model('dailyRoutineUserPics', dailyRoutineUserPicsScheme); //creating a  collection(table) by checking with UserSchema

export default dailyRoutineUserPics;