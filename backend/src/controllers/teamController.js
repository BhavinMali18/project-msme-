const Team = require("../models/Team");
const User = require("../models/User");
const Theme = require("../models/Theme");

// POST /api/teams — Create a new team for a theme
exports.createTeam = async (req, res) => {
  try {
    const { teamName, themeId } = req.body;
    const userId = req.user.id;

    if (!teamName || !themeId) {
      return res.status(400).json({ message: "Team name and theme are required." });
    }

    // Verify theme exists
    const theme = await Theme.findById(themeId);
    if (!theme) {
      return res.status(400).json({ message: "Selected theme not found." });
    }

    // One team per theme per user — check if already in a team for this theme
    const existingTeam = await Team.findOne({ themeId, memberIds: userId });
    if (existingTeam) {
      return res.status(400).json({
        message: `You are already in a team for the "${theme.name}" theme.`
      });
    }

    // Generate unique invite code
    let inviteCode;
    let codeExists = true;
    while (codeExists) {
      inviteCode = generateInviteCode();
      codeExists = await Team.findOne({ inviteCode });
    }

    const user = await User.findById(userId);

    const newTeam = await Team.create({
      teamName,
      themeId,
      leaderId: userId,
      memberIds: [userId],
      inviteCode,
      universityId: user.universityId || undefined,
    });

    const populated = await Team.findById(newTeam._id)
      .populate("themeId", "name color description")
      .populate("leaderId", "name email")
      .populate("memberIds", "name email studentId");

    res.status(201).json({ success: true, team: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/teams/join — Join a team via invite code
exports.joinTeam = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const userId = req.user.id;

    if (!inviteCode) {
      return res.status(400).json({ message: "Invite code is required." });
    }

    const team = await Team.findOne({ inviteCode: inviteCode.toUpperCase().trim() });
    if (!team) {
      return res.status(404).json({ message: "No team found with this invite code." });
    }

    // Check max members
    if (team.memberIds.length >= team.maxMembers) {
      return res.status(400).json({ message: "This team is full (max 4 members)." });
    }

    // Check already a member
    if (team.memberIds.map(String).includes(String(userId))) {
      return res.status(400).json({ message: "You are already in this team." });
    }

    // One team per theme per user
    const existingTeam = await Team.findOne({
      themeId: team.themeId,
      memberIds: userId,
    });
    if (existingTeam) {
      const theme = await Theme.findById(team.themeId);
      return res.status(400).json({
        message: `You are already in a team for the "${theme?.name || "selected"}" theme.`
      });
    }

    team.memberIds.push(userId);
    await team.save();

    const populated = await Team.findById(team._id)
      .populate("themeId", "name color description")
      .populate("leaderId", "name email")
      .populate("memberIds", "name email studentId");

    res.json({ success: true, team: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/teams/mine — Get all teams the logged-in user is part of
exports.getMyTeams = async (req, res) => {
  try {
    const userId = req.user.id;

    const teams = await Team.find({ memberIds: userId })
      .populate("themeId", "name color description")
      .populate("leaderId", "name email")
      .populate("memberIds", "name email studentId")
      .populate("mentorId", "name email employeeId")
      .sort({ createdAt: -1 });

    res.json({ success: true, teams });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/teams/:id/leave — Leave a team
exports.leaveTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const team = await Team.findById(id);
    if (!team) return res.status(404).json({ message: "Team not found." });

    if (!team.memberIds.map(String).includes(String(userId))) {
      return res.status(400).json({ message: "You are not in this team." });
    }

    // If leader tries to leave and others exist, transfer leadership
    if (String(team.leaderId) === String(userId) && team.memberIds.length > 1) {
      const remaining = team.memberIds.filter(m => String(m) !== String(userId));
      team.leaderId = remaining[0];
    }

    team.memberIds = team.memberIds.filter(m => String(m) !== String(userId));

    if (team.memberIds.length === 0) {
      await Team.findByIdAndDelete(id);
      return res.json({ success: true, message: "Team dissolved as last member left." });
    }

    await team.save();
    res.json({ success: true, message: "You have left the team." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/teams/all — Public: all teams (for leaderboard)
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("themeId", "name color")
      .populate("leaderId", "name email")
      .populate("memberIds", "name")
      .select("-inviteCode") // never expose invite codes publicly
      .sort({ createdAt: -1 });
    res.json({ success: true, teams });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function generateInviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}
