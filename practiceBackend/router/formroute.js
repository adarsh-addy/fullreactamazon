// make router with express.Router()
// filename of router and the router name keep it same;
const express = require('express');
const Loginrouter = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt')

// creatpool is used for application grade connectivity in mysql
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database:"form1"//databasename
})




// make routes of router;
// making a post to database while taking inputs from frontend.
Loginrouter.post('/user', async(req, res) => {
    const f_n = req.body.firstname;
    const l_n = req.body.lastname;
    const dob =req.body.dob;
    const email=req.body.email;
    const m_n=req.body.mobilenumber;
    const c_n=req.body.collegename;
    const y_o_p=req.body.yearofpassout;
    const encryptc_n=await bcrypt.hash(c_n,10)


    // callback or getconnection is type of promise return type of callback.
    db.getConnection(async(err, connection) => {
        if (err) throw (err);

        // whenever this is called , we will search in database;
        // ? = this is placeholder
        const sqlSearch = "SELECT*FROM form_db WHERE email=?"
        const search_query = mysql.format(sqlSearch, [email]);
        // whenever this is called we want to insert something to database;

        const sqlInsert = "INSERT INTO form_db(firstname,lastname,dob,email,mobilenumber,collegename,yearofpassout) VALUES(?,?,?,?,?,?,?)";
        const insert_query = mysql.format(sqlInsert, [f_n,l_n,dob,email,m_n,encryptc_n,y_o_p]);

        // now asking the connection for sql database for the given email;
        await connection.query(search_query, async(err, result) => {
            if (err) throw (err);
            console.log("------>searching for result");
            console.log(result.length)
            if (result.length != 0) {
                // releasing the connection with database;
                connection.release();
                console.log("Record already exists")
                res.json({
                    message:"Record already exists"
                })
            } else {
                await connection.query(insert_query, (err, result) => {
                    if (err) throw (err);
                    console.log("Record inserted");
                    res.json({
                        message: "Record inserted successfully",
                        result:result
                    })
                    connection.release()
                })
            }
           
        })
        
    })
    
})


// export the router and import in your main file => index.js

module.exports = Loginrouter;