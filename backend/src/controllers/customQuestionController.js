const CustomQuestion = require("../models/CustomQuestion");

// POST /api/custom-questions
exports.createQuestion = async (req, res) => {
  try {
    const { deptHeadId, text, type, order } = req.body;
    const companyId = req.user.companyId;

    if (!companyId) return res.status(403).json({ message: "Only company admins can create questions." });
    if (!text) return res.status(400).json({ message: "Question text is required." });

    const q = await CustomQuestion.create({
      companyId,
      deptHeadId: deptHeadId || null,
      text,
      type: type || "text",
      order: order || 0,
    });

    res.status(201).json({ success: true, question: q });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/custom-questions — admin sees all, dept_head sees their own
exports.getQuestions = async (req, res) => {
  try {
    const { deptHeadId } = req.query;
    const companyId = req.user.companyId;
    const role = req.user.role;

    if (!companyId) return res.status(403).json({ message: "Forbidden" });

    let filter = { companyId, active: true };

    if (role === "dept_head") {
      // Dept head sees questions targeted at them OR company-wide (deptHeadId: null)
      filter.$or = [{ deptHeadId: req.user.id }, { deptHeadId: null }];
    } else if (deptHeadId) {
      // Admin filtering by dept head
      filter.deptHeadId = deptHeadId;
    }

    const questions = await CustomQuestion.find(filter).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, questions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/custom-questions/:id
exports.deleteQuestion = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const q = await CustomQuestion.findOne({ _id: req.params.id, companyId });
    if (!q) return res.status(404).json({ message: "Question not found." });
    await q.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/custom-questions/:id
exports.updateQuestion = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const q = await CustomQuestion.findOneAndUpdate(
      { _id: req.params.id, companyId },
      { $set: req.body },
      { new: true }
    );
    if (!q) return res.status(404).json({ message: "Question not found." });
    res.json({ success: true, question: q });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
