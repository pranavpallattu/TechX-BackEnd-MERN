// import dotenv

require('dotenv').config()

// import connection

require('./connection')

// import express

const express=require('express')

// import cors

const cors=require('cors')

// import path

const path=require('path')

// import router

const router=require('./router')

// create server

const elserver=express()

// server using cors

elserver.use(cors())

// parse the data-- returns middleware to parse the data

elserver.use(express.json())

// exporting upload folder

elserver.use("/uploads", express.static(path.join(__dirname, "uploads")));
// create port

const PORT=4000 || process.env.PORT

// listen

elserver.listen(PORT,()=>{
    console.log(`elserver is running successfully in port number ${PORT}`);
    
})





elserver.use(router)





// elserver.delete('/',(req,res)=>{
//     res.send('delete request recieved')
// })
