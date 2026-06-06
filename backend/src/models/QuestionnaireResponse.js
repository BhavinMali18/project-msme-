const mongoose = require("mongoose");

const questionnaireResponseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    answers: mongoose.Schema.Types.Mixed, // Stores structure: { operations: { Q1: 5, Q2: ["machine breakdown"], ... } }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("QuestionnaireResponse", questionnaireResponseSchema);
