const express=require('express');
const app=express();
const cors=require('cors');

app.listen(4000,()=>{
    console.log("Server is running on port 4000");
})