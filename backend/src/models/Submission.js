const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    type: {
      type: String,
      enum: ["PPT", "PDF", "Demo Video", "Prototype", "Github", "Website", "Business Plan"]
    },
    fileUrl: { type: String, required: true },
    version: { type: Number, default: 1 },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
