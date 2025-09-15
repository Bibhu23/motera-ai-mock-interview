import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import userRouter from "./route/User.route.js";
const port=process.env.PORT || 4000;
const app=express();
app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true,               
}));
app.use(express.json());
await connectDB();
app.use("/user/api/v1",userRouter);
app.listen(port,()=>{
   console.log(`server Running at the localhost:${port}`);
   
}) 

