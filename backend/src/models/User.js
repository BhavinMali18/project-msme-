const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    companyName: String,

    contactPerson: String,

    email: {
      type: String,
      unique: true,
    },

    phone: String,

    password: String,

    role: {
      type: String,
      default: "company",
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