import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const USERNAME=process.env.DB_USERNAME;
const PASSWORD=process.env.DB_PASSWORD;


const URL=`mongodb+srv://${USERNAME}:${PASSWORD}@selfcheckup.b7l9a1u.mongodb.net/?retryWrites=true&w=majority`;
const Connection=async()=>{
    try{
       await mongoose.connect(URL,{useUnifiedTopology:'true'}) //useUnifiedTopology means use mongoDB latest
       console.log("Database connected successfullly ")
    }catch(error){
        console.log("Error while connecting to databse: ",error.message)
    }
}

export default Connection;