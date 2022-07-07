const mongoose  = require("mongoose")
const {Profile,User} = require("./user.js")


const reviewSchema = new mongoose.Schema({
  Author:{ type: Schema.Types.ObjectId ,required: true,ref: "User"},
  Paper:{ type: Schema.Types.ObjectId ,required: true,ref: "Paper"},
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
  // Transforma in enum quelli che dovrebbero essere enum fratm 
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

// i controlli sulle variabili sarebbe meglio metterli qui come schemas, tipo controllo sul nome o sui contenuti dei campi 

const paper =  mongoose.model("Paper",paperSchema)
const review =  mongoose.model("Review",reviewSchema)

module.exports = {
  Paper: paper,
  Review: review 
}

