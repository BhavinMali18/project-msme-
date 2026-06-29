const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const auditLogger = require("../middleware/auditLogger");
const { createOrUpdateProject, getMyProject } = require("../controllers/projectController");

router.post("/", auth, auditLogger("UPSERT_PROJECT", "Project"), createOrUpdateProject);
router.get("/my-project", auth, getMyProject);

module.exports = router;
