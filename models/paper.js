const mongoose = require("mongoose")
var Schema = mongoose.Schema
// import mongoose from "mongoose"
// import { Profile, User } from "./user.js";

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
    required: true
  },
  Domain: {
    type: String,
    required: true
  },
  Aim: {
    type: String,
    required: true
  },
  Device: {
    type: String,
    required: true
  },
  Modality: {
    type: String,
    required: true
  },
  Dynamics: {
    type: String,
    required: true
  },
  Personalization: {
    type: String,
    required: true
  },
  Timing: {
    type: String,
    required: true
  },
  Context: {
    type: String,
    required: true
  },
  Affordances: {
    type: String,
    required: true
  },
  Rules: {
    type: String,
    required: true
  },
  Aestetics: {
    type: String,
    required: true
  },
  Pdf: {
    BsonType: "binData"
  },
  // ultima modifica di un paper magari inutile perchè no patch dopo review, da vedere  
  // LastSave:{ type: Date, default: new Date() }
})


// i controlli sulle variabili sarebbe meglio metterli qui come schemas, tipo controllo sul nome o sui contenuti dei campi 

const paper = mongoose.model("Paper", paperSchema)
const review = mongoose.model("Review", reviewSchema)

module.exports = {
  Paper: paper,
  Review: review
}

