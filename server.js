const express = require("express");
const mysql = require("mysql");
const path = require("path");
const database = require("./database/config");
const cookieParser = require("cookie-parser");


const app = express();

//Define Public Use File
const publicD = path.join(__dirname, "./public");
app.use(express.static(publicD));

//Parse URL-encoded bodies (as sent by HTMl Forms)
app.use(express.urlencoded({ extended: false}));

//Parse JSON bosies (as sent by HTML Form)
app.use(express.json());
app.use(cookieParser());

//View Engine 
app.set('view engine', 'hbs');

//Define Router
app.use("/", require("./routes/controller"));
app.use("/auth", require("./routes/auth"));

app.listen(3000, () => {
    console.log("Server Stated on Port 3000");
})
