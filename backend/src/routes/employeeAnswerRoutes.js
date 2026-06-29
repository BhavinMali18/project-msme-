const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  saveMultipleAnswers,
  saveAnswer,
  submitDepartment,
  getMyAnswers,
  getMyProgress,
  getCompanyStats,
  getDepartmentProgress,
  getSubmissionTable
} = require("../controllers/employeeAnswerController");

// Employee routes (require JWT auth)
router.post("/", auth, saveMultipleAnswers);
router.post("/save", auth, saveAnswer);
router.post("/submit/:departmentId", auth, submitDepartment);
router.get("/my/:departmentId", auth, getMyAnswers);
router.get("/my-progress", auth, getMyProgress);

// Company Admin routes
router.get("/company-stats", auth, getCompanyStats);
router.get("/dept-progress", auth, getDepartmentProgress);
router.get("/submission-table", auth, getSubmissionTable);

module.exports = router;
