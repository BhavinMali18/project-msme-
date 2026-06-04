const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true
    },

    title: {
      en: String,
      hi: String,
      gu: String
    },

    order: Number,

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Department",
  departmentSchema
);