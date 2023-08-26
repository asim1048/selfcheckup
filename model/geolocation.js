import mongoose from 'mongoose'

const geolocationSchema=mongoose.Schema({
    user:{
        type:String,
    },
    longitude:{
        type:String,
    },
    latitude:{
        type:String,
    },
}, {
    timestamps: true
});

const geolocation = mongoose.model('geolocations',geolocationSchema); //creating a  collection(table) by checking with UserSchema

export default geolocation;