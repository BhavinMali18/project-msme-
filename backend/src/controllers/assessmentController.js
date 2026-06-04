const Assessment = require("../models/Assessment");
const Response = require("../models/Response");

exports.startAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.create(req.body);

    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.saveAnswer = async (req, res) => {
  try {
    const response = await Response.create(req.body);

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(
      req.params.id
    );

    const responses = await Response.find({
      assessmentId: req.params.id
    });

    res.json({
      assessment,
      responses
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};