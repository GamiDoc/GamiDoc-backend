const mongoose = require("mongoose")
const draftSchema = new Schema({
  Author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  Title: {
    type: String,
  },
  Description: {
    type: String,
  },

  //  ----------PARAMETRI PAPER----------
  // CONTEXT  
  Behavior: {
    type: String,
  },
  DiscBehavior: {
    type: String,
  },
  Domain: {
    type: String,
  },
  DomainDescription: {
    type: String,
  },
  Aim: {
    type: String,
  },
  AimDescription: {
    type: String,
  },
  TargetAge: [{
    type: String,
  }],
  TargetUser: {
    type: String,
  },
  TargetCategory: {
    type: String,
  },

  // DEVICE 
  Device: {
    type: String,
  },
  DeviceDescription: {
    type: String,
  },

  // MODALITY 
  Modality: {
    type: String,
  },
  ModalityDescription: {
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
  Timing: {
    type: String,
  },
  Context: {
    type: String,
  },
  ContextDescription: {
    type: String,
  },

  // TimingDescription: {
  //   type: String,
  // },

  // AFFORDANCES
  // Affordances: [{
  //   Type: { type: String },
  //   Text: { type: String },
  // }],

  Affordances: {
    type: Map,
    of: String
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
      _id: this._id,
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

