const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { createQuestion, getQuestions, deleteQuestion, updateQuestion } = require("../controllers/customQuestionController");

router.use(auth);
router.post("/", createQuestion);
router.get("/", getQuestions);
router.put("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);

module.exports = router;
