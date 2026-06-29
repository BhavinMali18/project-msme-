const mongoose = require("mongoose");

const evaluationScoreSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    evaluatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    rubricId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EvaluationRubric",
      required: true
    },
    scores: [{
      criteriaName: String,
      score: Number, // Score out of maxScore defined in rubric
      weightedScore: Number // score * (weight / 100)
    }],
    totalWeightedScore: { type: Number, default: 0 },
    feedbackRemarks: String,
    improvementSuggestions: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("EvaluationScore", evaluationScoreSchema);
