const Team = require("../models/Team");
const User = require("../models/User");
const Event = require("../models/Event");

exports.createTeam = async (req, res) => {
  try {
    const { teamName } = req.body;
    const userId = req.user.id; // From auth middleware

    // Check if user already in a team
    const user = await User.findById(userId);
    if (user.teamId) {
      return res.status(400).json({ message: "You are already in a team." });
    }

    // Get active event
    const event = await Event.findOne({ status: "active" });
    if (!event) {
      return res.status(400).json({ message: "No active hackathon event found." });
    }

    const newTeam = await Team.create({
      teamName,
      eventId: event._id,
      leaderId: userId,
      memberIds: [userId]
    });

    // Update user with team ID
    user.teamId = newTeam._id;
    await user.save();

    res.status(201).json({ success: true, team: newTeam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyTeam = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'teamId',
      populate: { path: 'memberIds leaderId', select: 'name email role category' }
    });

    if (!user || !user.teamId) {
      return res.status(404).json({ message: "Team not found." });
    }

    res.json({ success: true, team: user.teamId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
