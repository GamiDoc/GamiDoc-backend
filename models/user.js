const mongoose = require("mongoose")
const { Paper, Review } = require("./paper.js")

const userSchema = mongoose.Schema({
  Email:{ type: String, required: true,},
  Username:{ type: String, required: true,},
  LastActivity:{ type: Date, default: new Date()},
})

const profileSchema = mongoose.Schema({
  Profile: { type: Schema.Types.ObjectId, required: true, ref: "User"},
  Description: { type: String, default: ""},
  Papers: [{ type: Schema.Types.ObjectId, ref: "Paper"}], // Lista di paper pubblicati 

  PaperToReview: [{ type: Schema.Types.ObjectId, ref: "Paper"}], // Lista di paper alle quali è stata assegnata una review 
  Reviewer:{type: Boolean, default: false}
}

const user=  mongoose.model("User",userSchema)
const profile=  mongoose.model("Profile",profileSchema)

module.exports = {
  User: user,
  Profile: profile 
}

