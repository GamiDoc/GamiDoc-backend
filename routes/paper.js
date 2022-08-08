require("dotenv").config();
const { Paper, Review } = require("../models/paper.js")
const { Profile, User } = require("../models/user.js")
const escapeStringRegexp = import('escape-string-regexp')
const express = require("express")

const paperRoutes = express.Router()

// create a paper ( user_id needed ) with eventual fan-out 
paperRoutes.post("/new", async (req, res) => {
  const user = await user.findOne({
    email: req.auth[process.env.SERVICE_SITE]
  });
  const paper = new Paper({
    title: req.title,
    Reviews: req.review,
    Aesteics: req.aestetics,
    Context: req.context,
    Affordances: req.affordances,
    Device: req.device,
    Modality: req.modality,
    Feedback: req.feedback,
    Rules: req.rules,
    Author: user._id
  })
  try {
    await paper.save();
    const profile = await User.findOne({ User: user._id });
    profile.papers.push(paper);
    await profile.save();
    return res.status(201).json(paper);
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
})

// get paper by  paper_id 
paperRoutes.get('/:_id', getPaper, async (req, res) => {
  const user = await User.findOne({
    Email: req.auth[process.env.SERVICE_SITE]
  })
  if (user._id.toString() !== res.paper.Author.toString()) { return res.status(403).json({ message: 'Forbidden' }) }

  return res.status(200).json(res.paper)
})

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

// post review of a paper ( user_id and paper_id needed ) -->!this is a patch of a an already created review notice (there is a fan-out in the paper creation) 
paperRoutes.post('/reviews/new', async (req, res) => {
  const user = await User.findOne({
    Email: req.auth[process.env.SERVICE_SITE]
  })
  try {
    // crea review e la salva  
    let review = new Review({
      Author: user._id,
      Paper: req.body.paper,
      Comment: req.body.comment,
    })
    await review.save()

    // inserisci la review dentro lo schema del profilo e dell paper
    let profile = await Profile.findOne({ User: user._id })
    profile.PaperReviews.push(review)
    await profile.save()
    let paper = await Paper.findOne({ paper: req.body.paper })
    paper.Reviews.push(review)
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

//------------------------------------------------------------------------------------
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

module.exports = paperRoutes 
