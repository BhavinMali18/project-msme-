const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    street: String,
    city: String,
    state: String,
    country: String,
    pinCode: String,
    contactPerson: String,
    phone: String,
    industry: String,
    website: String,
    email: String,
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Company", companySchema);
