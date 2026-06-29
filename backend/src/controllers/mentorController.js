const MentorAssignment = require("../models/MentorAssignment");
const Team = require("../models/Team");

// Admin: Assign mentor to team
exports.assignMentor = async (req, res) => {
  try {
    const { mentorId, teamId } = req.body;
    
    let assignment = await MentorAssignment.findOne({ mentorId, teamId });
    if (!assignment) {
      assignment = await MentorAssignment.create({ mentorId, teamId });
    }
    res.json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mentor: Add feedback note
exports.addFeedback = async (req, res) => {
  try {
    const { assignmentId, note } = req.body;
    const assignment = await MentorAssignment.findById(assignmentId);
    
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    
    assignment.feedbackLog.push({ note });
    await assignment.save();

    res.json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Participant/Team: Get their mentor feedback
exports.getMyMentorFeedback = async (req, res) => {
  try {
    const { teamId } = req.query;
    if (!teamId) return res.status(400).json({ message: "teamId required" });

    const assignments = await MentorAssignment.find({ teamId }).populate('mentorId', 'name email');
    res.json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mentor/Evaluator: Get their assigned teams
exports.getMentorAssignments = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const assignments = await MentorAssignment.find({ mentorId, status: "active" })
      .populate({
        path: "teamId",
        populate: { path: "memberIds leaderId", select: "name email category" }
      });
    
    const Project = require("../models/Project");
    const Submission = require("../models/Submission");

    const assignmentsWithProjects = await Promise.all(
      assignments.map(async (a) => {
        if (!a.teamId) return { ...a.toObject(), project: null, submissions: [] };
        const project = await Project.findOne({ teamId: a.teamId._id });
        let submissions = [];
        if (project) {
          submissions = await Submission.find({ projectId: project._id }).sort({ createdAt: -1 });
        }
        return {
          ...a.toObject(),
          project,
          submissions
        };
      })
    );

    res.json({ success: true, assignments: assignmentsWithProjects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
