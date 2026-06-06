const express = require("express");

const router = express.Router();

const {
  register,
  login,
  registerEmployee,
  getCompanies,
  registerWithQuestionnaire
} = require("../controllers/authController");

router.get("/companies", getCompanies);

router.post("/register-with-questionnaire", registerWithQuestionnaire);

router.post("/register", register);

router.post("/register-employee", registerEmployee);

router.post("/login", login);

module.exports = router;