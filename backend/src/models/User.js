const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    companyName: String,

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    contactPerson: String,

    email: {
      type: String,
      unique: true,
    },

    companyEmail: String,
    companyPhone: String,
    phone: String,

    password: String,

    street: String,
    city: String,
    state: String,
    country: String,
    pinCode: String,
    name: String, // individual's name (e.g. employee or company admin)

    role: {
      type: String,
      enum: ["company", "participant"],
      default: "company",
    },

    category: {
      type: String,
      enum: ["student", "university", "startup_individual"],
    },
    institutionName: String,
    teamName: String,
    teamSize: Number,
    projectTitle: String,
    projectDescription: String,
    stage: String,
    coordinatorName: String,
    pitchDeckUrl: String,
    githubUrl: String,
    demoVideoUrl: String,

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    language: {
      type: String,
      default: "en",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "User",
  userSchema
);