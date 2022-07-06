require("dotenv").config();
const express = require("express")
const app = express()
const mongoose= require("mongoose")
const { auth } = require('express-openid-connect');

app.use(
  auth({
    // authRequired: false,
    issuerBaseURL: process.env.ISSUER_BASE_URL ,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    secret:  process.env.SECRET,
    idpLogout: true,
    auth0Logout: true,
  })
);

mongoose.connect(process.env.DATABASE,{useNewUrlParser: true})
const db = mongoose.connection;
db.on("error",(error)=> console.error(error));
db.once("open",()=> console.log("DB aperto!"));

// Use per il JSON middleware 
app.use(express.json())

const paperRoutes = require("./routes/paper")
app.use("/paper",paperRoutes)


const port = process.env.PORT ?? 3000 
app.listen(port,()=>console.log("Server aperto!"))
