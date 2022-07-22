const express = require('express');
const morgan =require("morgan")
// const helmet =require("helmet")
const app = express();


app.use(express.json());
// app.use(helmet());
app.use(morgan());

const Port = process.env.PORT || 3500;


app.get('/sample', (req, res, next) => {
    console.log(req.body)
    // res.send("server running on port 5000")
    res.json({
        message :" server is running"
    })

})


// we will import loginrouter here and use it.

const Loginrouter = require('./router/formroute');
// app.use => on particular route invoke the router and make 
// use of the router
app.use("/test",Loginrouter)


app.use('*', (req, res) => {
    
    res.status(404).send("route not found")
      // res.sendStatus(404)
  
  })
  
  
  app.listen(Port,() => {
      console.log("port running on 3500")
  })
  


