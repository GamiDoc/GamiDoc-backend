require("dotenv").config();
const express = require("express")
const app = express()
const mongoose= require("mongoose")

mongoose.connect(process.env.DATABASE,{useNewUrlParser: true})
const db = mongoose.connection;
db.on("error",(error)=> console.error(error));
db.once("open",()=> console.log("DB aperto!"));

// Use per il JSON middleware 
app.use(express.json())

const paperRoutes = require("./routes/paper")
app.use("/paper",paperRoutes)

app.listen(3000,()=>console.log("Server aperto!"))
