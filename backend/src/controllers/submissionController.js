const Submission = require("../models/Submission");
const Project = require("../models/Project");
const User = require("../models/User");

exports.uploadSubmission = async (req, res) => {
  try {
    const { type, fileUrl } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user || !user.teamId) {
      return res.status(400).json({ message: "You must be in a team to submit." });
    }

    const project = await Project.findOne({ teamId: user.teamId });
    if (!project) {
      return res.status(400).json({ message: "You must create a project profile first." });
    }

    // Determine the next version number
    const previousSubmissions = await Submission.find({ 
      projectId: project._id, 
      type 
    }).sort({ version: -1 });

    const nextVersion = previousSubmissions.length > 0 ? previousSubmissions[0].version + 1 : 1;

    const submission = await Submission.create({
      projectId: project._id,
      type,
      fileUrl,
      version: nextVersion,
      submittedBy: userId
    });

    res.status(201).json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMySubmissions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.teamId) {
      return res.json({ success: true, submissions: [] });
    }

    const project = await Project.findOne({ teamId: user.teamId });
    if (!project) {
      return res.json({ success: true, submissions: [] });
    }

    const submissions = await Submission.find({ projectId: project._id })
      .sort({ createdAt: -1 })
      .populate('submittedBy', 'name email');

    res.json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
