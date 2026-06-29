const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
      unique: true
    },
    projectName: String,
    problemStatement: String,
    solution: String,
    themeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theme"
    },
    trlLevel: Number, // Technology Readiness Level 1-9
    startupStage: String,
    revenue: Number,
    customers: Number,
    patents: Number,
    fundingScore: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
