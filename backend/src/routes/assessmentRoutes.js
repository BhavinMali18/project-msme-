const express = require("express");

const router = express.Router();

const {
  startAssessment,
  saveAnswer,
  getAssessment
} = require(
  "../controllers/assessmentController"
);

router.post(
  "/start",
  startAssessment
);
console.log(
 require("../controllers/assessmentController")
);
router.post(
  "/answer",
  saveAnswer
);

router.get(
  "/:id",
  getAssessment
);

module.exports = router;