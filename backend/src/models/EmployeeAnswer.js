const mongoose = require("mongoose");

const employeeAnswerSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    departmentId: {
      type: String,
      required: true
    },
    questionId: {
      type: String,
      required: true
    },
    answer: {
      type: mongoose.Schema.Types.Mixed
    },
    submitted: {
      type: Boolean,
      default: false
    },
    submittedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

// Composite unique index: one answer per employee per question
employeeAnswerSchema.index(
  { employeeId: 1, questionId: 1 },
  { unique: true }
);

module.exports = mongoose.model("EmployeeAnswer", employeeAnswerSchema);
