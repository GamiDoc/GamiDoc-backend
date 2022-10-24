const { User, Profile } = require("../models/user")
const { Draft } = require("../models/draft")
const express = require("express")
const { forEach } = require("underscore")
const draftRoutes = express.Router()

// post or update draft 
draftRoutes.post("/new", async (req, res) => {
  try {
    console.log("Im in")
    const user = await User.findOne({
      Email: req.auth[process.env.SERVICE_SITE]
    })
    let draft
    if (!Boolean(req.body.draftId)) {
      draft = new Draft({
        Author: user._id,
        Title: req.body.title,
        Description: req.body.description,

        Behavior: req.body.behavior,
        DiscBehavior: req.body.discBehavior,
        Domain: req.body.domain,
        DomainDescription: req.body.domainDescription,
        Aim: req.body.aim,
        AimDescription: req.body.aimDescription,
        TargetAge: req.body.targetAge,
        TargetUser: req.body.targetUser,
        TargetCategory: req.body.targetCategory,

        Device: req.body.device,
        DeviceDescription: req.body.deviceDescription,

        Modality: req.body.modality,

        Dynamics: req.body.dynamics,

        Personalization: req.body.personalization,
        Affordances: {},
        Context: req.body.context,
        ContextDescription: req.body.contextDescription,
        Timing: req.body.timing,
        // TimingDescription: req.body.timingDescription,

        // GameAction: req.body.gameAction,
        // Condition: req.body.condition,

        Rules: req.body.rules,
        Aesthetics: req.body.aesthetics,
      })
      console.log("Created")
      req.body.affordances.forEach((element) => {
        draft.Affordances.set(element.type, element.text)
      })
      console.log("Affordances: ", draft.Affordances)
      await draft.save()
      await Profile.updateOne({ User: user._id }, { $push: { Drafts: draft._id } })
    } else {
      draft = await Draft.findById(req.body.draftId)
      draft.Title = req.body.title
      draft.Description = req.body.description
      draft.Behavior = req.body.behavior
      draft.DiscBehavior = req.body.discBehavior
      draft.Domain = req.body.domain
      draft.DomainDescription = req.body.domainDescription
      draft.Aim = req.body.aim
      draft.AimDescription = req.body.aimDescription
      draft.TargetAge = req.body.targetAge
      draft.TargetUser = req.body.targetUser
      draft.TargetCategory = req.body.targetCategory
      draft.Device = req.body.device
      draft.DeviceDescription = req.body.deviceDescription
      draft.Modality = req.body.modality
      draft.Dynamics = req.body.dynamics
      draft.Personalization = req.body.personalization
      draft.Context = req.body.context
      draft.ContextDescription = req.body.contextDescription
      draft.Timing = req.body.timing
      // draft.Affordances = [...req.body.affordances]
      req.body.affordances.forEach((element) => {
        draft.Affordances.set(element.type, element.text)
      })
      console.log(draft.Affordances)
      draft.Rules = req.body.rules
      draft.Aesthetics = req.body.aesthetics

      await draft.save()
    }
    return res.status(200).json({ draft: draft })
  } catch (err) {
    console.log("ERR:", err)
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
    let resDrafts = []
    if (drafts)
      drafts.forEach(element => {
        resDrafts.push(element.restricted)
      })
    return res.status(200).json({ msg: "your Drafts", Drafts: resDrafts })
  } catch (err) {
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
    return res.status(500).json({ error: err })
  }
})

// return draft based on id  
draftRoutes.get("/:id", async (req, res) => {
  try {
    const id = req.params.id
    const draft = await Draft.findOne({ _id: id })
    return res.status(200).json({ draft: draft })
  } catch (err) {
    return res.status(500).json({ err: err })
  }
})

// patch a draft based on its id  
draftRoutes.patch("/:id", async (req, res) => {
  try {
    let draft = await Draft.findById(req.params.id)
    draft.Title = req.body.title
    draft.Description = req.body.description
    draft.Behavior = req.body.behavior
    draft.DiscBehavior = req.body.discBehavior
    draft.Domain = req.body.domain
    draft.DomainDescription = req.body.domainDescription
    draft.Aim = req.body.aim
    draft.AimDescription = req.body.aimDescription
    draft.TargetAge = req.body.targetAge
    draft.TargetUser = req.body.targetUser
    draft.TargetCategory = req.body.targetCategory
    draft.Device = req.body.device
    draft.DeviceDescription = req.body.deviceDescription
    draft.Modality = req.body.modality
    draft.Dynamics = req.body.dynamics
    draft.Personalization = req.body.personalization
    draft.Context = req.body.context
    draft.ContextDescription = req.body.contextDescription
    draft.Timing = req.body.timing
    req.body.affordances.forEach(element => {
      draft.Affordances.set(element.type, element.text)
    })
    console.log(draft.Affordances)
    draft.Rules = req.body.rules
    draft.Aesthetics = req.body.aesthetics
    await draft.save()
    return res.status(200).json({ data: "PATCH call:", draft: draft })

  } catch (err) {
    return res.status(500).json({ error: err })
  }
})

module.exports = draftRoutes
