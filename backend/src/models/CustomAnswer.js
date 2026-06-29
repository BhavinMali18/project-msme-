const mongoose = require("mongoose");

const customAnswerSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
    },
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
    answer: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

// One answer per user per question
customAnswerSchema.index({ questionId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("CustomAnswer", customAnswerSchema);
