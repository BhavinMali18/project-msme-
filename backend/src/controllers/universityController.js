const University = require("../models/University");
const User = require("../models/User");
const Team = require("../models/Team");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// GET /api/universities - public list of approved universities only
exports.getApprovedUniversities = async (req, res) => {
  try {
    const universities = await University.find(
      { approvalStatus: "approved" },
      "name shortCode city contactEmail totalStudents totalTeams totalMentors"
    ).sort({ name: 1 });
    res.json(universities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/universities/known-list - list of known real university names for autocomplete
exports.getKnownUniversityList = async (req, res) => {
  res.json({ universities: University.schema.statics ? require("../models/University").KNOWN_UNIVERSITIES : [] });
};

// GET /api/universities/all - admin: all universities with status
exports.getAllUniversities = async (req, res) => {
  try {
    const universities = await University.find()
      .populate("adminUserId", "name email")
      .sort({ createdAt: -1 });
    res.json(universities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/universities/:id - single university details
exports.getUniversityById = async (req, res) => {
  try {
    const university = await University.findById(req.params.id).populate("adminUserId", "name email");
    if (!university) return res.status(404).json({ message: "University not found" });
    res.json(university);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/universities/:id/students - students of a university
exports.getUniversityStudents = async (req, res) => {
  try {
    const students = await User.find(
      { universityId: req.params.id, role: "participant" },
      "name email phone studentId teamId approvalStatus createdAt"
    ).populate("teamId", "teamName approvalStatus");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/universities/:id/teams - teams of a university
exports.getUniversityTeams = async (req, res) => {
  try {
    const teams = await Team.find({ universityId: req.params.id })
      .populate("leaderId", "name email")
      .populate("memberIds", "name email studentId")
      .populate("mentorId", "name email employeeId");
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/universities/:id/mentors - mentors of a university
exports.getUniversityMentors = async (req, res) => {
  try {
    const mentors = await User.find(
      { universityId: req.params.id, role: "mentor" },
      "name email employeeId phone approvalStatus createdAt"
    );
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/universities/:id/mentors - university adds a mentor by their real employee ID
exports.addMentor = async (req, res) => {
  try {
    const { name, email, phone, employeeId, password } = req.body;
    const { id: universityId } = req.params;

    if (!name || !email || !employeeId) {
      return res.status(400).json({ message: "Name, email, and employee ID are required" });
    }

    const university = await University.findById(universityId);
    if (!university) return res.status(404).json({ message: "University not found" });
    if (university.approvalStatus !== "approved") {
      return res.status(403).json({ message: "University is not yet approved" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "A user with this email already exists" });

    const existingEmployeeId = await User.findOne({ employeeId, universityId });
    if (existingEmployeeId) {
      return res.status(400).json({ message: "A mentor with this employee ID already exists at this university" });
    }

    const hash = await bcrypt.hash(password || employeeId, 10);
    const mentor = await User.create({
      name,
      email,
      phone,
      password: hash,
      role: "mentor",
      universityId,
      employeeId,
      approvalStatus: "approved"
    });

    // Update university mentor count
    await University.findByIdAndUpdate(universityId, { $inc: { totalMentors: 1 } });

    mentor.password = undefined;
    res.status(201).json({ success: true, mentor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/universities/:id/teams/:teamId/assign-mentor - assign mentor to a team
exports.assignMentorToTeam = async (req, res) => {
  try {
    const { id: universityId, teamId } = req.params;
    const { mentorId } = req.body;

    if (!mentorId) return res.status(400).json({ message: "mentorId is required" });

    // Verify mentor belongs to this university
    const mentor = await User.findOne({ _id: mentorId, universityId, role: "mentor" });
    if (!mentor) {
      return res.status(400).json({ message: "Mentor not found in this university" });
    }

    const team = await Team.findByIdAndUpdate(
      teamId,
      { mentorId },
      { new: true }
    ).populate("mentorId", "name email employeeId")
     .populate("leaderId", "name email")
     .populate("memberIds", "name email");

    if (!team) return res.status(404).json({ message: "Team not found" });

    res.json({ success: true, team });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/universities/:id/approve - admin: approve or reject university
exports.updateUniversityStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const university = await University.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: status, ...(rejectionReason && { rejectionReason }) },
      { new: true }
    );
    if (!university) return res.status(404).json({ message: "University not found" });
    res.json(university);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
