import mongoose from 'mongoose'

const heartAttac=mongoose.Schema({
    user:{
        type:String,
    },
    riskLevel:{
        type:String,
    },
    
}, {
    timestamps: true
});

const RiskLevel = mongoose.model('heartatackrislevel',heartAttac); //creating a  collection(table) by checking with UserSchema

export default RiskLevel;