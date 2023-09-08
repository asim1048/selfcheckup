import mongoose from 'mongoose'

const adminSchema = mongoose.Schema({
    loginID: {
        type: String,
    },
    password: {
        type: String,
    },
    role:{
        type:String,
    }
}, {
    timestamps: true
});

const admin = mongoose.model('admin', adminSchema); //creating a  collection(table) by checking with UserSchema

export default admin;