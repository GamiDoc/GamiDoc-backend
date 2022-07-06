const mongoose  = require("mongoose")
const {Profile,User} = require("./user.js")


const reviewSchema = new mongoose.Schema({
  Author:{ type: Schema.Types.ObjectId ,required: true,ref: "User"},
  Comment: {type: String, default: ""},
  Approved: {type: Boolean, required: true},
  ReviewDate: {type: Date, default: new Date()} 
}

const paperSchema = new mongoose.Schema({

  Author:{ type: Schema.Types.ObjectId ,required: true,ref: "User" },
  Title:{ type: String, required: true },
  // Approved: {type: Boolean, default: false },
  Reviews: [{ type: Schema.Types.ObjectId ,required: true,ref: "Review" }],
  // Parametri divisi uno per uno 
  Aestetics:{ type: String, required: true },
  Context:{ type: String, required: true },
  Affordances:{ type: String, required: true },
  Device:{ type: String, required: true },
  Modality:{ type: String,required: true },
  Feedback:{ type: String,required: true },
  Rules:{ type: String, required: true },
  Pdf: Buffer,
  // ultima modifica di un paper magari inutile perchè no patch dopo review, da vedere  
  // LastSave:{ type: Date, default: new Date() }
}) 

// paperSchema.virtual("tile_info").
// get(function(){
//   return { this.Title}
// })

const paper =  mongoose.model("Paper",paperSchema)
const review =  mongoose.model("Review",reviewSchema)

module.exports = {
  Paper: paper,
  Review: review 
}

