const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { createTeam, joinTeam, getMyTeams, leaveTeam, getAllTeams } = require("../controllers/teamController");

router.get("/all", getAllTeams);          // Public - leaderboard
router.get("/mine", auth, getMyTeams);    // My teams
router.post("/", auth, createTeam);       // Create team
router.post("/join", auth, joinTeam);     // Join by invite code
router.delete("/:id/leave", auth, leaveTeam); // Leave team

module.exports = router;
