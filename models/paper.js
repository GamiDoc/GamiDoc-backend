const mongoose = require("mongoose")
var Schema = mongoose.Schema

const reviewSchema = new Schema({
  Author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  AuthorNickname: { type: String },
  Paper: { type: Schema.Types.ObjectId, required: true, ref: "Paper" },
  Comment: { type: String, default: "" },
  Approved: { type: Boolean, required: true },
  Params: [],
  ReviewDate: { type: Date, default: new Date() }
});

const paperSchema = new Schema({

  Author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  AuthorNickname: { type: String, required: true },
  Title: { type: String, required: true },

  Approved: { type: Boolean, default: false },
  Reviews: [{ type: Schema.Types.ObjectId, required: false, ref: "Review" }],
  Description: {
    type: String,
  },

  // Parametri divisi uno per uno 
  Behavior: {
    type: String,
  },
  Domain: {
    type: String,
  },
  Aim: {
    type: String,
  },
  Device: {
    type: String,
  },
  Modality: {
    type: String,
  },
  Dynamics: {
    type: String,
  },
  Personalization: {
    type: String,
  },
  Targets: {
    Age: { type: String },
    User: { type: String },
    Category: { type: String },
  },
  Timing: {
    type: String,
  },
  Context: {
    type: String,
  },
  Affordances: {
    type: String,
  },
  Rules: {
    type: String,
  },
  Aesthetics: {
    type: String,
  },
  Pdf: {
    type: Buffer,
    required: true
  },
})

// i controlli sulle variabili sarebbe meglio metterli qui come schemas, tipo controllo sul nome o sui contenuti dei campi 
paperSchema.virtual("pdfInfo").get(
  function() {
    return { data: this.Pdf.toString("base64") }
  }
)

paperSchema.virtual("restricted").get(
  function() {
    return {
      _id: this._id,
      Author: this.AuthorNickname,
      Title: this.Title,
      Description: this.Description
    }
  }
)

const paper = mongoose.model("Paper", paperSchema)
const review = mongoose.model("Review", reviewSchema)

module.exports = {
  Paper: paper,
  Review: review
}

