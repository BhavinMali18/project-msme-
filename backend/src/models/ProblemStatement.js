const mongoose = require("mongoose");

const problemStatementSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    problemTitle: {
      type: String,
      required: true,
    },
    problemDescription: {
      type: String,
      required: true,
    },
    department: {
      type: String,
    },
    expectedSolution: {
      type: String,
    },
    expectedImpact: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProblemStatement", problemStatementSchema);
