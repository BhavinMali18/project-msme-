const mongoose = require("mongoose");

const GUJARAT_UNIVERSITIES = [
  "Gujarat Technological University",
  "Charotar University of Science and Technology",
  "Nirma University",
  "Ahmedabad University",
  "Gujarat University",
  "Sardar Patel University",
  "Veer Narmad South Gujarat University",
  "Hemchandracharya North Gujarat University",
  "Saurashtra University",
  "Marwadi University",
  "Parul University",
  "GLS University",
  "Pandit Deendayal Energy University",
  "Dr. Babasaheb Ambedkar Open University",
  "CEPT University",
  "Dhirubhai Ambani Institute of Information and Communication Technology",
  "Indian Institute of Technology Gandhinagar",
  "National Institute of Design",
  "NIFT Gandhinagar",
  "Institute of Infrastructure Technology Research and Management"
];

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    shortCode: {
      type: String,
      trim: true,
      uppercase: true
    },
    city: { type: String, required: true },
    state: { type: String, default: "Gujarat" },
    websiteUrl: String,
    contactEmail: {
      type: String,
      required: true
    },
    contactPhone: String,
    adminUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    isKnownUniversity: {
      type: Boolean,
      default: false
    },
    rejectionReason: String,
    totalStudents: { type: Number, default: 0 },
    totalTeams: { type: Number, default: 0 },
    totalMentors: { type: Number, default: 0 },
  },
  { timestamps: true }
);

universitySchema.statics.KNOWN_UNIVERSITIES = GUJARAT_UNIVERSITIES;

module.exports = mongoose.model("University", universitySchema);
