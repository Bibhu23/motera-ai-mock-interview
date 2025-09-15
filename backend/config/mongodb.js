import mongoose from "mongoose";

const connectDB=async()=>{
    try{
        console.log("connecting to mongoDB");
        mongoose.connection.on("connected",()=>{
            console.log("MongoDB connected successfully");
        })
        mongoose.connection.on("error",(err)=>{
            console.log("Error in mongoDB connection",err.message);
        })
        mongoose.connect(process.env.MONGODB_URL)
        
    }catch(err){
        console.log("Error in connecting to mongoDB",err.message);
        process.exit(1);
        
    }
}

export default connectDB;
