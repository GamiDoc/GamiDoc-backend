require("dotenv").config();
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const { expressjwt } = require('express-jwt')
const jwks = require('jwks-rsa')
const { ManagementClient } = require('auth0')
const cors = require("cors")
const userRoutes = require("./routes/user")
const paperRoutes = require("./routes/paper")

// AUTH0 
const jwtCheck = expressjwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://' + process.env.AUTH0_DOMAIN + '/.well-known/jwks.json'
  }),
  audience: process.env.HEROKU_APP_NAME ? 'https://' + process.env.HEROKU_APP_NAME + '.herokuapp.com' : 'http://localhost:5000',
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
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true })
const db = mongoose.connection;
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

// accendi a porta 5000 
const port = process.env.PORT ?? 5000
const server = app.listen(port, () => console.log("Server aperto!"))

