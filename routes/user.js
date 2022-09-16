// require("dotenv").config()
const express = require("express")
// const escapeStringRegexp = await import("escape-string-regexp")
const escapeStringRegexp = require("escape-string-regexp")

// const { managementClient } = require("auth0")
const ManagementClient = require("auth0").ManagementClient

const { User, Profile } = require("../models/user")

// import { } from 'dotenv/config'
// import { User, Profile } from "../models/paper.js"
// import { ManagementClient } from "auth0"
// import escapeStringRegexp from "escape-string-regexp"
// import express from "express"

// Client auth0 
const management = new ManagementClient({
  grant_type: 'client_credentials',
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  domain: process.env.AUTH0_DOMAIN,
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
const userRoutes = express.Router()

userRoutes.get('/checkProfile', (req, res) => {
  management.getUser({ id: req.auth.sub }, (err, user) => {
    if (err) return res.status(500).json({ error: "broken connection with auth0", data: err })
    if (user.user_metadata?.first_config) return res.status(200).json({ status: true });
    return res.status(200).json({ status: false })
  })
})

// FirstConfig di uno user 
userRoutes.post('/firstConfig', async (req, res, next) => {
  try {
    let user = await User.findOneAndUpdate({
      Email: req.auth[process.env.SERVICE_SITE]
    }, {
      $set: { Username: req.body.username }
    })
    if (!user) {
      user = await User.create({
        Email: req.auth[process.env.SERVICE_SITE],
        Username: req.body.username
      })
      await user.save()
    }
    let profile = await Profile.findOneAndUpdate(
      { user: user._id },
      { $set: { Description: req.body.description } },
      { Reviewer: true }
    )
    if (!profile) {
      profile = await Profile.create({
        User: user._id,
        Description: req.body.Description,
        Papers: [],
        PaperReviews: [],
        Reviewer: true
      })
    }
    management.updateUserMetadata({ id: req.auth.sub }, { first_config: true }, (err, user) => {
      if (err) {
        console.log(err)
        return res.status(500).json({ error: "auth0 connection failed!" })
      }
      console.log(user)
      return res.status(200).json({ status: 'ok' })
    })
  } catch (err) {
    next(err)
  }
})

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


module.exports = userRoutes
