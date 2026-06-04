const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },

  code: String,

  type: {
    type: String,
    enum: [
      "text",
      "textarea",
      "scale",
      "singleSelect",
      "multiSelect",
      "voice",
      "file"
    ],
    required: true
  },

  question: {
    en: String,
    hi: String,
    gu: String
  },

  options: [
    {
      value: String,
      label: String
    }
  ],

  required: {
    type: Boolean,
    default: true
  },

  active: {
    type: Boolean,
    default: true
  },

  order: Number
},
{
  timestamps: true
});

module.exports =
mongoose.model(
  "Question",
  questionSchema
);