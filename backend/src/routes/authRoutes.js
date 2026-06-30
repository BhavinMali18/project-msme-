const express = require("express");

const router = express.Router();

const {
  register,
  login,
  registerEmployee,
  getCompanies,
  registerWithQuestionnaire,
  updateProfile,
  registerParticipant,
  registerStudent,
  registerUniversity
} = require("../controllers/authController");

router.get("/companies", getCompanies);

router.post("/register-with-questionnaire", registerWithQuestionnaire);

router.post("/register", register);

router.post("/register-employee", registerEmployee);

router.post("/register-participant", registerParticipant);

// New university module routes
router.post("/register-student", registerStudent);
router.post("/register-university", registerUniversity);

router.post("/login", login);

router.put("/profile", updateProfile);

module.exports = router;