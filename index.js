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

elserver.use(cors({
    origin: ['http://localhost:5173', 'https://tech-x-front-end-mern.vercel.app'], // Allow both local & Vercel
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// parse the data-- returns middleware to parse the data

elserver.use(express.json())

// create port

const PORT=4000 || process.env.PORT

// listen

elserver.use(router)


elserver.listen(PORT,()=>{
    console.log(`elserver is running successfully in port number ${PORT}`);
    
})



// elserver.delete('/',(req,res)=>{
//     res.send('delete request recieved')
// })
