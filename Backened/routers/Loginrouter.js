// make router with express.Router()
// filename of router and the router name keep it same;
const express = require('express');
const Loginrouter = express.Router();
const mysql = require('mysql');
const bcrypt=require('bcrypt')

// creatpool is used for application grade connectivity in mysql
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database:"amazon"
})




// make routes of router;
// making a post to database while taking inputs from frontend.
Loginrouter.post('/save', async(req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const encryptpassword=await bcrypt.hash(password,8);

    // callback og getconnection is type of promise return type of callback.
    db.getConnection(async(err, connection) => {
        if (err) throw (err);

        // whenever this is called , we will search in database;
        // ? = this is placeholder
        const sqlSearch = "SELECT*FROM amazon_db WHERE email=?"
        const search_query = mysql.format(sqlSearch, [email]);
        // whenever this is called we want to insert something to database;

        const sqlInsert = "INSERT INTO amazon_db(email,password) VALUES(?,?)";
        const insert_query = mysql.format(sqlInsert, [email, encryptpassword]);

        // now asking the connection for sql database for the given email;
        await connection.query(search_query, async(err, result) => {
            if (err) throw (err);
            console.log("------>searching for result");
            console.log(result.length)
            if (result.length != 0) {
                // releasing the connection with database;
                connection.release();
                console.log("email already exists")
                res.json({
                    message:"email already exists"
                })
            } else {
                await connection.query(insert_query, (err, result) => {
                    if (err) throw (err);
                    console.log("data inserted");
                    res.json({
                        message: "data inserted successfully",
                        result:result
                    })
                    connection.release()
                })
            }
           
        })
        
    })
    
})

//user authentication => password
//decrypt =>comparison
Loginrouter.post("/userAuth",(req,res)=>{
    let email=req.body.email;
    let password=req.body.password;
    db.getConnection(async(err,connection)=>{
        if(err) throw (err);
        const sqlSearch="SELECT * FROM amazon_db WHERE email=?"
        const search_query = mysql.format(sqlSearch,[email])
        await connection.query(search_query,async(err,result)=>{
            if(err) throw(err)
            if(result.length==0){
                console.log("----> User does not exist");
                res.json({
                    message:"user does not exist"
                })

                //page redirect to login page
            }else{
                console.log('this is result',result);
                const hasedpassword=result[0].password;
                console.log(hasedpassword);
                if(await bcrypt.compare(password,hasedpassword)){
                    console.log("SignUp Successfull");
                    res.json({
                        message:"signup done"
                    })
                    //redirect to  frontend's homepage
                }else{
                    console.log("password incorrect");
                    res.json({
                        message:"incorrect password"
                    })
                }
            }
        })
    })
})


// export the router and import in your main file => index.js

module.exports = Loginrouter;