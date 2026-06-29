const mongoose = require("mongoose");

const evaluationRubricSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },
    roundName: { type: String, required: true },
    criteria: [{
      name: { type: String, required: true }, // e.g., "Innovation", "Market Size"
      weight: { type: Number, required: true }, // e.g., 30 (for 30%)
      maxScore: { type: Number, default: 10 }
    }],
    totalWeight: { type: Number, default: 100 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("EvaluationRubric", evaluationRubricSchema);
