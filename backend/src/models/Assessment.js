const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    language: {
      type: String,
      default: "en"
    },

    selectedDepartments: [String],

    progress: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      default: "draft"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Assessment",
  assessmentSchema
);