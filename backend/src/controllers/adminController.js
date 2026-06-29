const Company = require("../models/Company");
const User = require("../models/User");
const QuestionnaireResponse = require("../models/QuestionnaireResponse");

// Simple hardcoded admin login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // In production, this should verify against a database user with role 'admin'
    if (email === "admin@msme.gov.in" && password === "admin123") {
      // Returning a simple token for frontend protection
      return res.json({ token: "admin-auth-token-12345", user: { email, role: "admin" } });
    }
    
    res.status(401).json({ message: "Invalid admin credentials" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all companies with their questionnaire responses and employees
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().lean();
    
    // Fetch responses for all companies
    const responses = await QuestionnaireResponse.find().lean();
    
    // Fetch users (employees) for all companies
    const users = await User.find({ companyId: { $in: companies.map(c => c._id) } })
      .select("name email role approvalStatus")
      .lean();
    
    // Attach responses and employees to companies
    const companiesWithDetails = companies.map(company => {
      const companyResponses = responses.filter(r => String(r.companyId) === String(company._id));
      const employees = users.filter(u => String(u.companyId) === String(company._id));
      return { ...company, responses: companyResponses, employees };
    });

    res.json(companiesWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all participants
exports.getParticipants = async (req, res) => {
  try {
    const participants = await User.find({ role: "participant" }).lean();
    res.json(participants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update company approval status
exports.updateCompanyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const company = await Company.findByIdAndUpdate(id, { approvalStatus: status }, { new: true });
    
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update participant approval status
exports.updateParticipantStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const participant = await User.findByIdAndUpdate(id, { approvalStatus: status }, { new: true });
    
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    res.json(participant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Mentors and Evaluators
exports.getMentorsAndEvaluators = async (req, res) => {
  try {
    const personnel = await User.find({ role: { $in: ["mentor", "evaluator", "admin"] } })
      .select("name email role category")
      .lean();
    res.json(personnel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Teams with their basic info
exports.getTeams = async (req, res) => {
  try {
    const Team = require("../models/Team");
    const Project = require("../models/Project");

    const teams = await Team.find().populate("leaderId", "name email").lean();
    
    // Attach project industry if available
    const projects = await Project.find().lean();
    
    const teamsWithProjects = teams.map(team => {
      const proj = projects.find(p => String(p.teamId) === String(team._id));
      return {
        ...team,
        industry: proj ? proj.industry : "N/A",
        projectName: proj ? proj.projectName : "No Project Yet"
      };
    });

    res.json(teamsWithProjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new Personnel (Jury/Mentor)
exports.addPersonnel = async (req, res) => {
  try {
    const { name, email, password, role, category } = req.body;
    
    // In MVP, we just hash the password if bcrypt was used, or save directly if plain text.
    // Assuming simple creation for MVP admin flow:
    if (!["mentor", "evaluator"].includes(role)) {
      return res.status(400).json({ message: "Role must be mentor or evaluator" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const newUser = await User.create({
      name,
      email,
      password, // Should be hashed in production
      role,
      category,
      approvalStatus: "approved"
    });

    // Don't return password
    newUser.password = undefined;

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Assignments
exports.getAssignments = async (req, res) => {
  try {
    const MentorAssignment = require("../models/MentorAssignment");
    const assignments = await MentorAssignment.find()
      .populate("mentorId", "name email role category")
      .populate("teamId", "teamName industry")
      .lean();
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create an Assignment
exports.assignTeam = async (req, res) => {
  try {
    const MentorAssignment = require("../models/MentorAssignment");
    const { mentorId, teamId, round } = req.body;

    const existing = await MentorAssignment.findOne({ mentorId, teamId });
    if (existing) {
      return res.status(400).json({ message: "Assignment already exists" });
    }

    const assignment = await MentorAssignment.create({
      mentorId,
      teamId,
      round: round || "Initial"
    });

    const populated = await MentorAssignment.findById(assignment._id)
      .populate("mentorId", "name email role category")
      .populate("teamId", "teamName industry")
      .lean();

    res.status(201).json({ success: true, assignment: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get active event details
exports.getActiveEvent = async (req, res) => {
  try {
    const Event = require("../models/Event");
    const event = await Event.findOne({ status: "active" }).lean();
    if (!event) {
      return res.status(404).json({ message: "No active event found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
