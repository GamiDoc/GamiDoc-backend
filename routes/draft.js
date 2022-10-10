const { User, Profile } = require("../models/user")
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
    let draft
    console.log(req.body)
    // console.log("BOOL: ", Boolean(req.body.draftId))
    console.log(req.body)
    if (!Boolean(req.body.draftId)) {
      draft = new Draft({
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
      await draft.save()
      await Profile.updateOne({ User: user._id }, { $push: { Drafts: draft._id } })
      console.log("Ok new draft")
    } else {
      draft = await Draft.findById(req.body.draftId)
      console.log("SERVER: ", draft)
      draft.Title = req.body.title
      draft.Description = req.body.description
      draft.Behavior = req.body.behavior
      draft.Domain = req.body.domain
      draft.Aim = req.body.aim
      draft.TargetAge = req.body.targetAge
      draft.TargetUser = req.body.targetUser
      draft.Device = req.body.device
      draft.Modality = req.body.modality
      draft.Dynamics = req.body.dynamics
      draft.Personalization = req.body.personalization
      draft.Context = req.body.context
      draft.ContextDescription = req.body.contextDescription
      draft.Timing = req.body.timing
      draft.TimingDescription = req.body.timingDescription
      draft.GameAction = req.body.gameAction
      draft.Condition = req.body.condition
      draft.Affordances = req.body.affordances
      draft.Rules = req.body.rules
      draft.Aesthetics = req.body.aesthetics
      await draft.save()
      console.log("Ok already created draft used a new ")
    }
    return res.status(200).json({ draft: draft })
  } catch (err) {
    console.log("draft" + err)
    return res.status(500).json({ error: err })
  }
})
// Get user drafts 
draftRoutes.get("/me", async (req, res) => {
  try {
    const user = await User.findOne({
      Email: req.auth[process.env.SERVICE_SITE]
    })
    const profile = await Profile.findOne({ User: user._id })
    await profile.populate("Drafts")
    const drafts = profile.Drafts
    console.log(drafts)
    let resDrafts = []
    if (drafts)
      drafts.forEach(element => {
        resDrafts.push(element.restricted)
      })
    console.log("Raggiunto")
    return res.status(200).json({ msg: "your Drafts", Drafts: resDrafts })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: err })
  }
})

// Get drafts by userid
draftRoutes.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findOne({
      Email: req.params.id
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
    return res.status(500).json({ error: err })
  }
})

// return draft based on id  
draftRoutes.get("/:id", async (req, res) => {
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

// patch a draft based on its id  
draftRoutes.patch("/:id", async (req, res) => {
  try {
    console.log("Id:", req.params.id)
    console.log("Request: ", req.body)
    let draft = await Draft.findById(req.params.id)
    console.log("SERVER: ", draft)
    draft.Title = req.body.title
    draft.Description = req.body.description
    draft.Behavior = req.body.behavior
    draft.Domain = req.body.domain
    draft.Aim = req.body.aim
    draft.TargetAge = req.body.targetAge
    draft.TargetUser = req.body.targetUser
    draft.Device = req.body.device
    draft.Modality = req.body.modality
    draft.Dynamics = req.body.dynamics
    draft.Personalization = req.body.personalization
    draft.Context = req.body.context
    draft.ContextDescription = req.body.contextDescription
    draft.Timing = req.body.timing
    draft.TimingDescription = req.body.timingDescription
    draft.GameAction = req.body.gameAction
    draft.Condition = req.body.condition
    draft.Affordances = req.body.affordances
    draft.Rules = req.body.rules
    draft.Aesthetics = req.body.aesthetics
    await draft.save()
    console.log("Ok")

    return res.status(200).json({ data: "PATCH call:", draft: draft })

  } catch (err) {
    console.log("draft" + err)
    return res.status(500).json({ error: err })
  }
})

module.exports = draftRoutes
