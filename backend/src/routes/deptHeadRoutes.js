const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createDeptHead,
  getDeptHeads,
  deleteDeptHead,
  resetPassword,
  getDeptHeadAnswers
} = require("../controllers/deptHeadController");

router.use(auth);
router.get("/", getDeptHeads);
router.post("/", createDeptHead);
router.delete("/:id", deleteDeptHead);
router.put("/:id/password", resetPassword);
router.get("/:id/answers", getDeptHeadAnswers);

module.exports = router;
