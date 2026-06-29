require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./src/config/db");

// Models
const Role = require("./src/models/Role");
const User = require("./src/models/User");
const Event = require("./src/models/Event");
const Team = require("./src/models/Team");
const Project = require("./src/models/Project");
const Submission = require("./src/models/Submission");
const AuditLog = require("./src/models/AuditLog");
const Company = require("./src/models/Company");
const QuestionnaireResponse = require("./src/models/QuestionnaireResponse");

const seedDatabase = async () => {
  await connectDB();
  console.log("Connected to MongoDB for Seeding...");

  try {
    // 1. Wipe all collections
    await Role.deleteMany({});
    await User.deleteMany({});
    await Event.deleteMany({});
    await Team.deleteMany({});
    await Project.deleteMany({});
    await Submission.deleteMany({});
    await AuditLog.deleteMany({});
    await Company.deleteMany({});
    await QuestionnaireResponse.deleteMany({});
    console.log("Database wiped clean.");

    // 2. Create Roles
    const adminRole = await Role.create({ name: "admin", permissions: ["ALL_ACCESS"] });
    const participantRole = await Role.create({ name: "participant", permissions: ["SUBMIT_PROJECT"] });
    const mentorRole = await Role.create({ name: "mentor", permissions: ["VIEW_ASSIGNED_TEAMS", "SUBMIT_FEEDBACK"] });
    console.log("Roles seeded.");

    // 3. Create Default Admin
    await User.create({
      name: "Super Admin",
      email: "admin@msme.gov.in",
      password: "admin", // Unhashed for simple testing right now
      role: "admin",
      roleId: adminRole._id,
      approvalStatus: "approved"
    });
    console.log("Admin seeded.");

    // 4. Create Default Event
    await Event.create({
      name: "MSME Grand Hackathon 2026",
      description: "National level hackathon for innovations",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      status: "active",
      workflowStages: [
        { stageName: "Registration", order: 1, isActive: true },
        { stageName: "Screening", order: 2, isActive: false },
        { stageName: "Round 1", order: 3, isActive: false },
        { stageName: "Final Pitch", order: 4, isActive: false }
      ]
    });
    console.log("Default Event seeded.");

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
