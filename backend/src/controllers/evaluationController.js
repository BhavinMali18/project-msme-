const EvaluationRubric = require("../models/EvaluationRubric");
const EvaluationScore = require("../models/EvaluationScore");
const Project = require("../models/Project");

// Admin: Create or update a rubric
exports.upsertRubric = async (req, res) => {
  try {
    const { eventId, roundName, criteria } = req.body;
    
    // Ensure total weight is 100
    const totalWeight = criteria.reduce((sum, c) => sum + Number(c.weight), 0);
    if (totalWeight !== 100) {
      return res.status(400).json({ message: "Total criteria weight must equal 100" });
    }

    let rubric = await EvaluationRubric.findOne({ eventId, roundName });
    if (rubric) {
      rubric.criteria = criteria;
      rubric.totalWeight = totalWeight;
      await rubric.save();
    } else {
      rubric = await EvaluationRubric.create({ eventId, roundName, criteria, totalWeight });
    }

    res.json({ success: true, rubric });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Evaluator/Jury: Submit scores
exports.submitScore = async (req, res) => {
  try {
    const { projectId, rubricId, scores, feedbackRemarks, improvementSuggestions } = req.body;
    const evaluatorId = req.user.id;

    const rubric = await EvaluationRubric.findById(rubricId);
    if (!rubric) return res.status(404).json({ message: "Rubric not found" });

    let totalWeightedScore = 0;
    const calculatedScores = scores.map(s => {
      const criterion = rubric.criteria.find(c => c.name === s.criteriaName);
      const weight = criterion ? criterion.weight : 0;
      const weightedScore = s.score * (weight / 100);
      totalWeightedScore += weightedScore;
      return { ...s, weightedScore };
    });

    const evalScore = await EvaluationScore.findOneAndUpdate(
      { projectId, evaluatorId, rubricId },
      { scores: calculatedScores, totalWeightedScore, feedbackRemarks, improvementSuggestions },
      { new: true, upsert: true }
    );

    res.json({ success: true, score: evalScore });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Participant: Get their scores
exports.getMyScores = async (req, res) => {
  try {
    // In a real app we derive teamId -> projectId. For simplicity, expect projectId in query.
    const { projectId } = req.query;
    if (!projectId) return res.status(400).json({ message: "projectId required" });

    // Ensure they can only view if published (flag omitted for MVP, just return them)
    const scores = await EvaluationScore.find({ projectId }).populate('evaluatorId', 'name').populate('rubricId', 'roundName');
    
    res.json({ success: true, scores });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all rubrics
exports.getRubrics = async (req, res) => {
  try {
    const rubrics = await EvaluationRubric.find().lean();
    res.json({ success: true, rubrics });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
