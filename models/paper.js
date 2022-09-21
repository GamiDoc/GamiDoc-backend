const mongoose = require("mongoose")
var Schema = mongoose.Schema

const reviewSchema = new Schema({
  Author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  Paper: { type: Schema.Types.ObjectId, required: true, ref: "Paper" },
  Comment: { type: String, default: "" },
  Approved: { type: Boolean, required: true },
  ReviewDate: { type: Date, default: new Date() }
});

const paperSchema = new Schema({

  Author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
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
  () => {
    return `${this.Pdf.toString("base64")} `
  }
)

paperSchema.virtual("restricted").get(
  () => {
    return {
      _id: this._id,
      Author: this.Author,
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

