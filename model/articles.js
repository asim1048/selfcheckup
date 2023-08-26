import mongoose from 'mongoose'

const articlesSchema = mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String,

    },
    visible: {
        type: Boolean,
        default:true
    },
   
}, {
    timestamps: true
});

const articles = mongoose.model('articles', articlesSchema); //creating a  collection(table) by checking with UserSchema

export default articles;