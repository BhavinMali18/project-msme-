const mongoose = require("mongoose");

const customQuestionSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    // null = question is for ALL dept heads of this company; set to specific userId for targeted
    deptHeadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "yesno", "scale", "multiline"],
      default: "text",
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomQuestion", customQuestionSchema);
