require("dotenv").config();
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const { MongoClient, ServerApiVersion } = require('mongodb');
const { expressjwt } = require('express-jwt')
const jwks = require('jwks-rsa')

const ManagementClient = require("auth0").ManagementClient

const cors = require("cors")
const userRoutes = require("./routes/user")
const paperRoutes = require("./routes/paper")
// prova controllo errori 

const errController = (err, req, res, next) => {
  const error = { ...err }
  error.message = err.message
  console.log(error)
  if (error.code === '11000') {
    return res.status(400).json({ error: error.message })
  }
  return res.status(500).json({ error: error.message })
}

// AUTH0 
const jwtCheck = expressjwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://' + process.env.AUTH0_DOMAIN + '/.well-known/jwks.json'
  }),
  audience: process.env.AUDIENCE,
  issuer: 'https://' + process.env.AUTH0_DOMAIN + "/",
  algorithms: ['RS256']
})


const management = new ManagementClient({
  grant_type: 'client_credentials',
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  domain: process.env.AUTH0_DOMAIN
})

// DB 
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => console.error(err))
const db = mongoose.connection;
// const uri = process.env.DATABASE
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("DB aperto!"));

// Middleware 
app.use(express.json())
app.use(jwtCheck)
app.use(cors({
  origin: "*"
}))

// Routes
app.use("/paper", paperRoutes)
app.use("/user", userRoutes)
app.use(errController)

// accendi a porta 5000 
const port = process.env.PORT ?? 5000
const server = app.listen(port, () => console.log("Server aperto! Port = ", port))

