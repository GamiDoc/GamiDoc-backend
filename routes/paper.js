const {Paper,Review} = require("../models/paper.js")
const express = require("express")

const paperRoutes = express.Router()


// create a paper ( user_id needed ) with eventual fan-out 

// get paper list by user_id 

// paginated research of papers  

// post review of a paper ( user_id and paper_id needed ) -->!this is a patch of a an already created review notice (there is a fan-out in the paper creation) 

// Get your reviews by user_id 

// Get all the reviews of a paper



module.exports= paperRoutes 
