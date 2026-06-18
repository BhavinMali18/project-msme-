const express = require("express");
const router = express.Router();

const {
  adminLogin,
  getCompanies,
  getParticipants,
  updateCompanyStatus,
  updateParticipantStatus
} = require("../controllers/adminController");

router.post("/login", adminLogin);
router.get("/companies", getCompanies);
router.get("/participants", getParticipants);
router.put("/companies/:id/status", updateCompanyStatus);
router.put("/participants/:id/status", updateParticipantStatus);

module.exports = router;
