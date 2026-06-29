const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const auditLogger = require("../middleware/auditLogger");
const { createTeam, getMyTeam } = require("../controllers/teamController");

router.post("/", auth, auditLogger("CREATE_TEAM", "Team"), createTeam);
router.get("/my-team", auth, getMyTeam);

module.exports = router;
