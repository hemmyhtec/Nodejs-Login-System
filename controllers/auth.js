const mysql = require("mysql");
// const data =  require("../database/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");


const data = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE 
});

exports.login = async (req, res) => {
    try{
        const { email, password } = req.body;

        if( !email || !password) {
            return res.status(400).render("login", {
                message: "Please provide an Email and Password"
            })
        }
        data.query("SELECT * FROM login WHERE email = ?" , [email], async (error, results) => {
            console.log(results);
            if( !results || !(await bcrypt.compare(password, results[0].password) )){
                res.status(401).render("login", {
                    message: "Email and Password is Incorrect"
                })
            } else {
                const id = results[0].id;

                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                console.log("The token is: " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie("jwt", token, cookieOptions);
                res.status(200).redirect("/");
            }
        })
    } catch (error) {
        console.log(error);
    }
}

exports.register = (req, res) => {
    console.log(req.body);

//This line of code is the same a the below
    // const name = req.body.name;
    // const email = req.body.email; 
    // const password = req.body.password;
    // const passwordConfrim = req.body.passwordConfrim;

// The is just a recontructed code passwordConfirm
    const { name, email, password, passwordConfirm} = req.body;
    
    data.query("SELECT email FROM login WHERE email = ?", [email], async (error, results) => {
        if(error){
            console.log(error);
        }
         if( results.length > 0 ) {
            return res.render("register", {
                message: "Email Already Registered By Another User"
            })
        } else if( password !== passwordConfirm ){
            return res.render("register", {
                message: "Your Password does not Match"
            });    
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        data.query("INSERT INTO login SET ?", {name: name, email: email, password: hashedPassword}, (error) => {
            if(error) {
                console.log(error);
            } else{
                console.log(results);
                return res.render("register", {
                    message: "User Registered"
                });   
            }
        })


    });

}