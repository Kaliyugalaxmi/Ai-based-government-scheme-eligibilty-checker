const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema(
  {
    schemeId: {
      type: Number,
      default: null,
    },
    schemeName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: null,
    },
    minAge: {
      type: Number,
      default: null,
    },
    maxAge: {
      type: Number,
      default: null,
    },
    incomeLimit: {
      type: Number,
      default: null,
    },
    caste: {
      type: String,
      default: "All",
    },
    gender: {
      type: String,
      default: "All",
    },
    state: {
      type: String,
      default: "All",
    },
    benefit: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scheme", schemeSchema);