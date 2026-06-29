const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const auditLogger = require("../middleware/auditLogger");
const { upsertRubric, submitScore, getMyScores, getRubrics } = require("../controllers/evaluationController");

router.post("/rubric", auth, auditLogger("UPSERT_RUBRIC", "EvaluationRubric"), upsertRubric);
router.post("/score", auth, auditLogger("SUBMIT_SCORE", "EvaluationScore"), submitScore);
router.get("/my-scores", auth, getMyScores);
router.get("/rubrics", auth, getRubrics);

module.exports = router;
