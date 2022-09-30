const express = require("express")
const userRoutes = express.Router()
const escapeStringRegexp = require("escape-string-regexp")
const ManagementClient = require("auth0").ManagementClient
const { User, Profile } = require("../models/user")

// Client auth0 per m2m
const management = new ManagementClient({
  grant_type: 'client_credentials', // Tipo di grant, trovi gli altri in specifiche oauth2 !! 
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  domain: process.env.AUTH0_DOMAIN,
})

// Controllo se ho già settato i metadata per questo user, quindi se ho creato i metadati per lui 
userRoutes.get('/checkProfile', (req, res) => {
  management.getUser({ id: req.auth.sub }, (err, user) => {
    if (err) return res.status(500).json({ error: "broken connection with auth0", data: err })
    if (user.user_metadata?.first_config) return res.status(200).json({ status: true });
    // const profile = await Profile.findOne({ User: user._id });
    // profile.papers.push(paper);
    // await profile.save().catch(err => console.log(err));;
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
      { User: user._id },
      {
        $set: {
          Description: req.body.description, Reviewer: true
        }
      },
    )
    if (!profile) {
      profile = await Profile.create({
        User: user._id,
        Description: req.body.description,
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


userRoutes.get('/removeFirstConfig', async (req, res) => {
  management.updateUserMetadata({ id: req.auth.sub }, { first_config: null }, (err, user) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: "auth0 connection failed!" })
    }
    console.log(user)
    return res.status(200).json({ status: 'ok' })
  })
})




// Ottieni il tuo profilo 
userRoutes.get('/me', async (req, res) => {
  // Con populate carichiamo la tabella di user dentro il profilo, a seconda di come viene fatta la pagina potrebbe essere usato anche per i paper e le review  
  const profile = await Profile.findOne({ Email: req.auth[process.env.SERVICE_SITE] }).populate('User')
  if (profile == null) return res.status(404).json({ error: "There is no Profile with this id !" })
  return res.status(200).json(profile);
})

// Ricerca profili paginata 
userRoutes.get('/search', async (req, res) => {
  try {
    let user
    let n = 10
    let page = req.body.pageN
    if (req.body.keyWord) {
      const $regex = escapeStringRegexp(req.body.criteria)
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
