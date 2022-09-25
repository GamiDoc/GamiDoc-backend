const { Profile, User } = require("../models/user")
const { Paper, Review } = require("../models/paper")
const escapeStringRegexp = require('escape-string-regexp')
const express = require("express")
const paperRoutes = express.Router()

// Middleware
async function getPaper(req, res, next) {
  try {
    res.paper = await Paper.findById(req.params._id)
    if (res.paper == null) {
      return res.status(404).json({ message: 'Cannot find Paper' })
    }
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
  next()
}
// create a paper ( user_id needed ) 
paperRoutes.post("/new", async (req, res) => {
  try {
    const user = await User.findOne({
      Email: req.auth[process.env.SERVICE_SITE]
    })
    console.log(user)
    console.log(req.body)
    if (req.body.pdf == null) return;
    const paper = new Paper({
      Author: user._id,
      AuthorNickname: user.Username,
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
    })
    // Ritrasformiamo in binario prima di salvare perchè base64 occupa 1.33 volte lo spazio 
    paper.Pdf = new Buffer.from(req.body.pdf, "base64")
    await Profile.updateOne({ User: user._id }, { $push: { Papers: paper._id } })
    await paper.save()
    console.log("Ok")
    return res.status(201).json(paper);
  } catch (err) {
    console.log({ Error: err })
    return res.status(400).json({ message: err.message })
  }
})

// return paper based on id 
paperRoutes.get("/:_id", getPaper, async (req, res) => {
  const pdf = res.paper.pdfInfo
  const info = res.paper.restricted
  delete res.paper
  console.log("resPdf\n " + res.pdf)
  console.log("resInfo\n " + res.info)
  return res.status(200).json({ pdf: pdf, info: info })
})


// get all your papers 
paperRoutes.get('/all/me', async (req, res) => {
  try {
    const user = await User.findOne({
      Email: req.auth[process.env.SERVICE_SITE]
    })
    let profile = await Profile.findOne({ User: user._id })
    await profile.populate("Papers")

    let resInfo = []
    profile.Papers.forEach(element => {
      resInfo = [...resInfo, element.restricted]
    })
    return res.status(200).json({ data: resInfo })

  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: err.message })
  }
})

// get all the papers based on userid 
paperRoutes.get('/all/:_id', async (req, res) => {
  try {
    let profile = await Profile.findOne({ User: req.params._id })
    await profile.populate("Papers")
    let resInfo = []
    profile.Papers.forEach(element => {
      resInfo = [...resInfo, element.restricted]
    })
    return res.status(200).json({ data: resInfo })

  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
})

// Get feed of the last 10 reviewable papers 
paperRoutes.get("/feed", async (req, res) => {
  try {
    const user = await User.findOne({
      Email: req.auth[process.env.SERVICE_SITE]
    })

    let reviewable
    if (user)
      Paper.find({ Approved: false }).$where(() => { return this.Author != user._id })
        .sort({ _id: 1 })
        .limit(10).toArray(function(err, data) {
          if (err != null) {
            console.log(err)
            return
          }
          reviewable = data
        })
    else
      Paper.find({ Approved: false })
        .sort({ _id: 1 })
        .limit(10)
        .toArray(function(err, data) {
          if (err != null) {
            console.log(err)
            return
          }
          reviewable = data
        })

    let resReview = []
    reviewable.forEach(element => {
      resReview = [...resReview, element.restricted]
    });
    return res.status(200).json({ data: resReview })
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
})

// paginated research of papers  
paperRoutes.get('/search/:keyword/:pageN ', async (req, res) => {
  try {
    let papers
    let n = 10
    let page = req.params.pageN
    const $regex = escapeStringRegexp(req.params.keyWord)
    await Paper
      .find({ title: { $regex, $options: 'i' } })
      .skip((n * page) - n)
      .limit(n)
      .toArray((err, data) => {
        if (err != null) {
          console.log(err)
          return
        }
        papers = data
      })
    if (!papers) return res.status(404).json({ message: 'no public papers' })

    let resInfo = []
    papers.forEach(element => {
      resInfo = [...resInfo, element.restricted]
    })
    return res.status(200).json({ data: resInfo })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// post review of a paper ( paper_id needed ) 
paperRoutes.post('/reviews/new', async (req, res) => {
  const user = await User.findOne({
    Email: req.auth[process.env.SERVICE_SITE]
  })
  try {
    // controlla che l'utente sia un reviewer 
    let profile = await Profile.findOne({ User: user._id })
    if (profile.Reviewer == false) return res.status(400).json({ message: "l'utente non è un reviewer" })

    // controlla che la review non sia stata approvata nel frattempo 
    let paper = await Paper.findOne({ paper: req.body.paperID })
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

    // inserisci la review dentro lo schema del profilo che l'ha inviata 
    Profile.updateOne({ User: user._id }, { $push: { Reviews: review._id } })
    // Inserisci review nel suo relativo Paper
    Paper.updateOne({ _id: paper._id }, { $push: { Reviews: review._id } })

    // Controlla se paper è da approvare 
    let plenght = paper.Reviews.lenght // non so se legale, da provare
    if (plenght >= 3) {
      paper.populate("Reviews")
      let vote;
      for (let i = 0; i < plenght; i++) {
        if (paper.Reviews[i].Approved == true) vote++
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
  let profile = await Profile.findOne({ User: user._id })
  profile.populate("Reviews").then(() => {
    let reviews = profile.Reviews
    return res.status(200).json({ reviews: reviews })
  }).catch(err => {
    return res.status(400).json({ message: err.message })
  })
})

// Get all the reviews of a paper
paperRoutes.get('/reviews/paper/:_id', getPaper, async (req, res) => {
  const user = await User.findOne({
    Email: req.auth[process.env.SERVICE_SITE]
  })
  // Only the owner of the paper can see the reviews
  if (user._id.toString() !== res.paper.Author.toString()) { return res.status(403).json({ message: 'Forbidden' }) }
  res.paper.populate("Reviews").then(() => {
    return res.status(200).json({ reviews: res.paper.Reviews })
  }
  )
})


module.exports = paperRoutes 
