const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ["draft", "active", "completed"],
      default: "draft"
    },
    workflowStages: [{
      stageName: String,
      order: Number,
      isActive: Boolean
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
