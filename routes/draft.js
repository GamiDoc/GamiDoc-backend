
const { User, Profile } = require("./user")
const { Draft } = require("../models/draft")
const express = require("express")
const { forEach } = require("underscore")
const draftRoutes = express.Router()

// post or update draft 
draftRoutes.post("/new", async (req, res) => {
  try {
    const user = await User.findOne({
      Email: req.auth[process.env.SERVICE_SITE]
    })
    const profile = await Profile.findOne({ User: user._id })
    const draft = new Draft({
      Author: user._id,
      Title: req.body.title,
      Description: req.body.description,

      Behavior: req.body.behavior,
      Domain: req.body.domain,
      Aim: req.body.aim,
      TargetAge: req.body.targetAge,
      TargetUser: req.body.targetUser,

      Device: req.body.device,

      Modality: req.body.modality,

      Dynamics: req.body.dynamics,

      Personalization: req.body.personalization,

      Context: req.body.context,
      ContextDescription: req.body.contextDescription,
      Timing: req.body.timing,
      TimingDescription: req.body.timingDescription,

      GameAction: req.body.gameAction,
      Condition: req.body.condition,
      Affordances: req.body.affordances,

      Rules: req.body.rules,
      Aesthetics: req.body.aesthetics,
    })
    await Profile.updateOne({ User: user._id }, { $push: { Drafts: draft._id } })
    await draft.save()
    console.log("Ok")
  } catch (err) {
    console.log("draft" + err)
    return res.status(500).json({ error: err })
  }
})

// get drafts by userid
draftRoutes.get("/", async (req, res) => {
  try {
    const user = await User.findOne({
      Email: req.auth[process.env.SERVICE_SITE]
    })
    const profile = await Profile.findOne({ User: user._id })
    await profile.populate("Drafts")
    const drafts = profile.Drafts
    drafts, forEach(element => {
      res.drafts.push(element.restricted)
    })
    return res.code(200)
  } catch (err) {
    console.log(err)
    return res.statsu(500).json({ error: err })
  }
})

// return draft based on id  
draftRoutes.get("/:id", async () => {
  try {
    const id = req.params.id
    const draft = await Draft.findOne({ _id: id })
    console.log("Ok")
    return res.status(200).json({ draft: draft })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ err: err })
  }
})

module.exports = draftRoutes
