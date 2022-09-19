const mongoose = require("mongoose")
var Schema = mongoose.Schema

const userSchema = Schema({
  Email: { type: String, required: true, },
  Username: { type: String, required: true, },
  LastActivity: { type: Date, default: new Date() },
})


const profileSchema = Schema({
  User: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  Description: { type: String, default: "" },
  Papers: [{ type: Schema.Types.ObjectId, ref: "Paper" }], // Lista di paper pubblicati 
  PaperReviews: [{ type: Schema.Types.ObjectId, ref: "Paper" }], // Lista di paper alle quali è stata assegnata una review 
  Reviewer: { type: Boolean, default: false }
})

const user = mongoose.model("User", userSchema)
const profile = mongoose.model("Profile", profileSchema)

module.exports = {
  User: user,
  Profile: profile
}
