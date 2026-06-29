const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: [{ type: String }] // e.g. ["VIEW_DASHBOARD", "APPROVE_TEAMS", "MANAGE_EVENTS"]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);
