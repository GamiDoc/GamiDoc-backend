require("dotenv").config();
const { Paper, Review } = require("../models/paper.js")
const { User, Review } = require("../models/paper.js")
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
    Author: user.email
  })
  try {
    await Paper.save();
    const profile = await User.findOne({ user: user._id });
    profile.papers.push(paper);
    await profile.save();
    return res.status(201).json(paper);
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
})
// get paper list by user_id 
paperRoutes.get('/:_id', async (req, res) => {
  const user = await User.findOne({
    email: req.auth[process.env.SERVICE_SITE]
  })
  if (user._id.toString() !== res.project.owner.toString()) { return res.status(403).json({ message: 'Forbidden' }) }

  return res.status(200).json(res.project)
})

// paginated research of papers  

// post review of a paper ( user_id and paper_id needed ) -->!this is a patch of a an already created review notice (there is a fan-out in the paper creation) 

// Get your reviews by user_id 

// Get all the reviews of a paper



module.exports = paperRoutes 
