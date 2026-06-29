const express = require("express");

const router = express.Router();

const {
  register,
  login,
  registerEmployee,
  getCompanies,
  registerWithQuestionnaire,
  updateProfile,
  registerParticipant
} = require("../controllers/authController");

router.get("/companies", getCompanies);

router.post("/register-with-questionnaire", registerWithQuestionnaire);

router.post("/register", register);

router.post("/register-employee", registerEmployee);

router.post("/register-participant", registerParticipant);

router.post("/login", login);

router.put("/profile", updateProfile);

module.exports = router;