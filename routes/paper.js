// require("dotenv").config() const { Paper, Review } = require("../models/paper")
const { Profile, User } = require("../models/user")
const { Paper, Review } = require("../models/paper")
const escapeStringRegexp = require('escape-string-regexp')
const express = require("express")

// import { } from "dotenv/config"
// import { Paper, Review } from "../models/paper.js"
// import { Profile, User } from "../models/user.js"
// import escapeStringRegexp from 'escape-string-regexp'
// import express from "express"

const paperRoutes = express.Router()

// Middleware
async function getPaper(req, res, next) {
  try {
    res.paper = await Paper.findById(req.params._id)
    if (res.paper == null) {
      return res.status(404).json({ message: 'Cannot find project ' })
    }
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
  next()
}
// create a paper ( user_id needed ) 
paperRoutes.post("/new", async (req, res) => {
  const user = await User.findOne({
    email: req.auth[process.env.SERVICE_SITE]
  });
  console.log(req.body)
  const paper = new Paper({
    Author: user._id,
    Title: req.body.title,
    Description: req.body.description,

    Behavior: req.body.behavior,
    Domain: req.body.domain,
    Aim: req.body.aim,
    Device: req.body.device,
    Modality: req.body.modality,
    Dynamics: req.body.dynamics,
    Personalization: req.body.personalization,
    Timing: req.body.timing,
    Context: req.body.context,
    Affordances: req.body.affordances,
    Rules: req.body.rules,
    Aestheics: req.body.aesthetics,
    // Pdf: req.pdf
  })
  try {
    await paper.save().catch(err => console.log(err));
    // const profile = await Profile.findOne({ User: user._id });
    // profile.papers.push(paper);
    // await profile.save().catch(err => console.log(err));;
    Profile.updateOne({ User: user._id }, { $push: { papers: paper._id } })
    console.log("ok")
    return res.status(201).json(paper);
  } catch (err) {
    console.log("error")
    return res.status(400).json({ message: err.message })
  }
})

// OK non ha molto senso, da rifare 
// get paper by  paper_id 
// paperRoutes.get('/:_id', getPaper, async (req, res) => {
//   const user = await User.findOne({ Email: req.auth[process.env.SERVICE_SITE]
//   })
//   if (user._id.toString() !== res.paper.Author.toString()) { return res.status(403).json({ message: 'Forbidden' }) }
//   return res.status(200).json(res.paper)
// })

// get all paper of a user  
paperRoutes.get('/allPapers', async (req, res) => {
  const user = await User.findOne({
    Email: req.auth[process.env.SERVICE_SITE]
  })
  try {
    let profile = await Profile.findOne({ User: User._id })
    let papers = profile.papers
    return res.status(200).json(papers)
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
})

// Get feed of the last 10 reviewable papers 
paperRoutes.get("/feed", async (req, res) => {
  try {
    let reviewable = Paper.find({ Approved: false }).sort({ _id: 1 }).limit(10)
    return res.status(200).json(reviewable)
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
})

// paginated research of papers  
paperRoutes.get('/search/', async (req, res) => {
  try {
    let papers
    let n = 10
    let page = req.body.pageN
    if (req.body.keyWord) {
      const $regex = escapeStringRegexp(req.body.keyWord)
      papers = await Paper.find({
        title: { $regex, $options: 'i' }
      })
        .skip((n * page) - n)
        .limit(n)
    } else {
      papers = await Paper.find().skip((n * page) - n).limit(n)
    }
    if (!papers) {
      return res.status(404).json({ message: 'no public papers' })
    }
    return res.status(200).json(papers)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// post review of a paper ( user_id and paper_id needed ) 
paperRoutes.post('/reviews/new', async (req, res) => {
  const user = await User.findOne({
    Email: req.auth[process.env.SERVICE_SITE]
  })
  try {
    // controlla che l'utente sia un reviewer 
    let profile = await Profile.findOne({ User: user._id })
    if (profile.Reviewer == false) return res.status(400).json({ message: "l'utente non è un reviewer" })

    // controlla che la review non sia stata approvata nel frattempo 
    let paper = await Paper.findOne({ paper: req.body.paper }).populate("Reviews")
    if (paper.Approved == true) return res.status(401).json({ message: "The paper has already been approved " })
    if (paper.Author == user._id) return res.status(401).json({ message: " Cant leave a review to your own paper" })

    // crea review e la salva  
    let review = new Review({
      Author: user._id,
      Paper: req.body.paper,
      Approved: req.body.approved,
      Comment: req.body.comment,
    })
    await review.save()

    // inserisci la review dentro lo schema del profilo 
    profile.PaperReviews.push(review)
    await profile.save()

    // inserisci la review dentro lo schema del paper e controlla se paper è da approvare 
    paper.Reviews.push(review)
    let plenght = paper.Reviews.lenght
    if (plenght >= 3) {
      let vote;
      for (let i = 0; i < plenght; i++) {
        if (paper.reviews[i].Approved == true) vote++
      }
      if (vote > (plenght / 2)) paper.Approved = true
    }
    await paper.save()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get your reviews by user_id 
paperRoutes.get('/reviews/user', async (req, res) => {
  const user = await User.findOne({
    Email: req.auth[process.env.SERVICE_SITE]
  })
  try {
    let profile = await Profile.findOne({ User: user._id })
    let reviews = profile.reviews
    return res.status(200).json(reviews)
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
})

// Get all the reviews of a paper
paperRoutes.get('/reviews/paper', getPaper, async (req, res) => {
  const user = await User.findOne({
    Email: req.auth[process.env.SERVICE_SITE]
  })
  if (user._id.toString() !== res.paper.Author.toString()) { return res.status(403).json({ message: 'Forbidden' }) }
  return res.status(200).json(res.paper.Reviews)
})



module.exports = paperRoutes 
