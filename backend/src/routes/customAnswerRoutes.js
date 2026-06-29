const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { saveAnswers, getMyAnswers } = require("../controllers/customAnswerController");

router.use(auth);
router.post("/", saveAnswers);
router.get("/my", getMyAnswers);

module.exports = router;
