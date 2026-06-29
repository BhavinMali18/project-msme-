const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const auditLogger = require("../middleware/auditLogger");
const { uploadSubmission, getMySubmissions } = require("../controllers/submissionController");

router.post("/", auth, auditLogger("UPLOAD_SUBMISSION", "Submission"), uploadSubmission);
router.get("/my-submissions", auth, getMySubmissions);

module.exports = router;
