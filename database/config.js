const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env"});

//Database Defined with .env 
const data = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE 
});

//Database Connection
data.connect( (error) =>{
    if(error) {
        console.log(error)
    } else{
        console.log ('Database Connected Succesfully...')
    }
})
