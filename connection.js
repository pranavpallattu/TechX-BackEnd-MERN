// import mongoose

const mongoose=require('mongoose')

connectionString=process.env.DATABASE
mongoose.connect(connectionString).then((res)=>{
    console.log("mongodb connected successfully");
    
}).catch((error)=>{
    console.log(`mongodb connection failed ${error}`);
    
})