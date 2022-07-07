const {User,Profile} = require("../models/paper.js")
const express = require("express")

const userRoutes = express.Router()

const management = new ManagementClient({
  grant_type: 'client_credentials',
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  domain: process.env.AUTH0_DOMAIN
})


// FirstConfig di 1 user 

module.exports = userRoutes
