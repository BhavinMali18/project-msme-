const express = require("express");
const router = express.Router();
const {
  createOrUpdateProblemStatement,
  getMyProblemStatement,
} = require("../controllers/problemStatementController");
const auth = require("../middleware/auth");

router.use(auth);

router.post("/", createOrUpdateProblemStatement);
router.get("/my", getMyProblemStatement);

module.exports = router;
