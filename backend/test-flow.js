const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Models
const Role = require("./src/models/Role");
const User = require("./src/models/User");
const Event = require("./src/models/Event");
const Team = require("./src/models/Team");
const Project = require("./src/models/Project");
const Submission = require("./src/models/Submission");
const MentorAssignment = require("./src/models/MentorAssignment");
const Theme = require("./src/models/Theme");
const EvaluationRubric = require("./src/models/EvaluationRubric");

const MONGO_URI = "mongodb://localhost:27017/project-msme";

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for setting up test data...");

    // 1. Get or Create Event
    let event = await Event.findOne({ status: "active" });
    if (!event) {
      event = await Event.create({
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
      console.log("Created Event.");
    }

    // 2. Create Rubric
    let rubric = await EvaluationRubric.findOne({ eventId: event._id, roundName: "Screening" });
    if (!rubric) {
      rubric = await EvaluationRubric.create({
        eventId: event._id,
        roundName: "Screening",
        criteria: [
          { name: "Innovation & Novelty", weight: 50, maxScore: 10 },
          { name: "Technical Feasibility", weight: 50, maxScore: 10 }
        ],
        totalWeight: 100
      });
      console.log("Created Screening Rubric.");
    }

    // 3. Create Theme
    let theme = await Theme.findOne({ name: "Agritech" });
    if (!theme) {
      theme = await Theme.create({
        name: "Agritech",
        color: "#10B981",
        description: "Innovative solutions for agriculture and food processing."
      });
      console.log("Created Agritech Theme.");
    }

    // Hash passwords
    const hash = await bcrypt.hash("password123", 10);

    // 4. Create Participant
    let participant = await User.findOne({ email: "test.participant@example.com" });
    if (!participant) {
      participant = await User.create({
        name: "Test Participant",
        email: "test.participant@example.com",
        phone: "+91 9999999999",
        password: hash,
        role: "participant",
        category: "student",
        college: "XYZ Institute of Technology",
        approvalStatus: "approved"
      });
      console.log("Created Participant.");
    }

    // 5. Create Mentor
    let mentor = await User.findOne({ email: "arthur.mentor@msme.gov.in" });
    if (!mentor) {
      mentor = await User.create({
        name: "Arthur Mentor",
        email: "arthur.mentor@msme.gov.in",
        phone: "+91 8888888888",
        password: hash,
        role: "mentor",
        category: "Operations",
        approvalStatus: "approved"
      });
      console.log("Created Mentor.");
    }

    // 6. Create Evaluator
    let evaluator = await User.findOne({ email: "morgana.eval@msme.gov.in" });
    if (!evaluator) {
      evaluator = await User.create({
        name: "Morgana Evaluator",
        email: "morgana.eval@msme.gov.in",
        phone: "+91 7777777777",
        password: hash,
        role: "evaluator",
        category: "Tech",
        approvalStatus: "approved"
      });
      console.log("Created Evaluator.");
    }

    // 7. Create Team for Participant
    let team = await Team.findOne({ leaderId: participant._id });
    if (!team) {
      team = await Team.create({
        teamName: "AgriTech Wizards",
        eventId: event._id,
        leaderId: participant._id,
        memberIds: [participant._id],
        approvalStatus: "approved"
      });
      console.log("Created Team.");

      participant.teamId = team._id;
      await participant.save();
    }

    // 8. Create Project Profile
    let project = await Project.findOne({ teamId: team._id });
    if (!project) {
      project = await Project.create({
        teamId: team._id,
        projectName: "Smart Crop Irrigation",
        themeId: theme._id,
        problemStatement: "Manual irrigation leads to water wastage and uneven soil moisture.",
        solution: "IoT sensors measure soil moisture and trigger automated drip irrigation.",
        trlLevel: 4,
        startupStage: "Prototype",
        revenue: 0,
        customers: 0,
        patents: 1
      });
      console.log("Created Project Profile.");
    }

    // 9. Create Submission
    let submission = await Submission.findOne({ projectId: project._id });
    if (!submission) {
      submission = await Submission.create({
        projectId: project._id,
        type: "PPT",
        fileUrl: "https://docs.google.com/presentation/d/12345/edit",
        version: 1,
        submittedBy: participant._id
      });
      console.log("Created Submission.");
    }

    // 10. Assign Team to Mentor and Evaluator
    let mentorAssign = await MentorAssignment.findOne({ mentorId: mentor._id, teamId: team._id });
    if (!mentorAssign) {
      mentorAssign = await MentorAssignment.create({
        mentorId: mentor._id,
        teamId: team._id,
        round: "Initial",
        status: "active"
      });
      console.log("Assigned Team to Mentor.");
    }

    let evalAssign = await MentorAssignment.findOne({ mentorId: evaluator._id, teamId: team._id });
    if (!evalAssign) {
      evalAssign = await MentorAssignment.create({
        mentorId: evaluator._id,
        teamId: team._id,
        round: "Screening",
        status: "active"
      });
      console.log("Assigned Team to Evaluator.");
    }

    console.log("Test data setup successfully!");
  } catch (err) {
    console.error("Error setting up test data:", err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
