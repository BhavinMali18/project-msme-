const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const auditLogger = require("../middleware/auditLogger");
const { assignMentor, addFeedback, getMyMentorFeedback, getMentorAssignments } = require("../controllers/mentorController");

router.post("/assign", auth, auditLogger("ASSIGN_MENTOR", "MentorAssignment"), assignMentor);
router.post("/feedback", auth, auditLogger("MENTOR_FEEDBACK", "MentorAssignment"), addFeedback);
router.get("/my-feedback", auth, getMyMentorFeedback);
router.get("/my-assignments", auth, getMentorAssignments);

module.exports = router;
