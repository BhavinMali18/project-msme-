const CustomAnswer = require("../models/CustomAnswer");

// POST /api/custom-answers — bulk upsert
exports.saveAnswers = async (req, res) => {
  try {
    const userId = req.user.id;
    const companyId = req.user.companyId;
    const { answers } = req.body; // [{questionId, answer}]

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "answers array required." });
    }

    const ops = answers.map(({ questionId, answer }) => ({
      updateOne: {
        filter: { questionId, userId },
        update: { $set: { questionId, userId, companyId, answer } },
        upsert: true,
      },
    }));

    await CustomAnswer.bulkWrite(ops);
    res.json({ success: true, message: "Answers saved." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/custom-answers/my
exports.getMyAnswers = async (req, res) => {
  try {
    const userId = req.user.id;
    const answers = await CustomAnswer.find({ userId });
    res.json({ success: true, answers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
