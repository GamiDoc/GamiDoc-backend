
const mongoose = require("mongoose")
var Schema = mongoose.Schema

const draftSchema = new Schema({
  Author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  Description: {
    type: String,
  },
  //  PARAMETRI PAPER 

  // CONTEXT  
  Behavior: {
    type: String,
  },
  Domain: {
    type: String,
  },
  Aim: {
    type: String,
  },
  TargetAge: {
    type: String,
  },
  TargetUser: {
    type: String,
  },

  // DEVICE 
  Device: {
    type: String,
  },

  // MODALITY 
  Modality: {
    type: String,
  },

  // DYNAMICS
  Dynamics: {
    type: String,
  },

  // PERSONALIZATION
  Personalization: {
    type: String,
  },

  // FEEDBACK
  Context: {
    type: String,
  },
  ContextDescription: {
    type: String,
  },
  Timing: {
    type: String,
  },
  TimingDescription: {
    type: String,
  },

  // AFFORDANCES
  GameAction: {
    type: String,
  },
  Condition: {
    type: String,
  },
  Affordances: {
    type: String,
  },

  // RULES 
  Rules: {
    type: String,
  },

  // AESTHETICS
  Aesthetics: {
    type: String,
  },
});

draftSchema.virtual("restricted").get(
  function() {
    return {
      Author: this.Author,
      Title: this.Title,
      Description: this.Description,

    }
  }
)
const draft = mongoose.model("Draft", draftSchema)
module.exports = {
  Draft: draft,
}

