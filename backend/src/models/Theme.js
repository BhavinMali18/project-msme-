const mongoose = require("mongoose");

const themeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    color: {
      type: String, // Hex code
      required: true,
      default: "#3B82F6"
    },
    description: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Theme", themeSchema);
