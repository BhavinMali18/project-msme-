const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/universityController");

// Public routes
router.get("/", ctrl.getApprovedUniversities);
router.get("/known-list", ctrl.getKnownUniversityList);
router.get("/:id", ctrl.getUniversityById);

// University admin routes (auth middleware can be added later)
router.get("/:id/students", ctrl.getUniversityStudents);
router.get("/:id/teams", ctrl.getUniversityTeams);
router.get("/:id/mentors", ctrl.getUniversityMentors);
router.post("/:id/mentors", ctrl.addMentor);
router.put("/:id/teams/:teamId/assign-mentor", ctrl.assignMentorToTeam);

// Admin-only routes
router.get("/admin/all", ctrl.getAllUniversities);
router.put("/:id/status", ctrl.updateUniversityStatus);

module.exports = router;
