import mongoose from 'mongoose'

const videosSchema = mongoose.Schema({
    title: {
        type: String,
    },
    visible: {
        type: Boolean,
        default:true
    },
    thumbnail: {
        type: String,

    },
    type:{
        type:String,
    },
    video: {
        type: String,
    },
   
}, {
    timestamps: true
});

const videos = mongoose.model('videos', videosSchema); //creating a  collection(table) by checking with UserSchema

export default videos;