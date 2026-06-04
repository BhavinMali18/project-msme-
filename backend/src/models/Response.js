const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment"
    },

    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question"
    },

    answer: mongoose.Schema.Types.Mixed,

    answerLanguage: {
      type: String,
      default: "en"
    },

    voiceTranscript: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Response",
  responseSchema
);