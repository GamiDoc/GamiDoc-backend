require("dotenv").config()
const { User, Profile } = require("../models/paper.js")
const escapeStringRegexp = import("escape-string-regexp")
const express = require("express")

const userRoutes = express.Router()



// FirstConfig di 1 user 

// Ottieni il tuo profilo 
userRoutes.get('/me', getUser, async (req, res) => {
  // Con populate carichiamo la tabella di user dentro il profilo,
  // a seconda di come viene fatta la pagina potrebbe essere usato anche per i paper e le review  
  const profile = await Profile.findOne({ user: req.user._id })
    .populate('User')
  if (profile == null) return res.status(404).json({ error: "There is no Profile!" })
  return res.status(200).json(profile);
})

// Ricerca profili paginata 
userRoutes.get('/search', async (req, res) => {
  try {
    let user
    let n = 10
    let page = req.body.pageN
    if (req.body.keyWord) {
      const $regex = escapeStringRegexp(req.body.keyWord)
      papers = await User.find({
        title: { $regex, $options: 'i' }
      })
        .skip((n * page) - n)
        .limit(n)
    } else {
      user = await User.find().skip((n * page) - n).limit(n)
    }
    if (!papers) {
      return res.status(404).json({ message: 'no public papers' })
    }
    return res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


// Client auth0 
const management = new ManagementClient({
  grant_type: 'client_credentials',
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  domain: process.env.AUTH0_DOMAIN
})
// Middleware
const getUser = async (req, res, next) => {
  try {
    res.user = await User.findOne(req.auth0[process.env.SERVICE_SITE])
    if (res.paper = null) return res.status(404).json({ message: "Can't find the project" })
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
  next()
}

module.exports = userRoutes
