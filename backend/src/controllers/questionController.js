const Question = require("../models/Question");

exports.createQuestion = async (
  req,
  res
) => {
  try {
    const question =
      await Question.create(req.body);

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getQuestions = async (
  req,
  res
) => {
  try {
    const questions =
      await Question.find()
      .sort({ order: 1 });

    res.json(questions);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getQuestionsByDepartment =
async (req, res) => {

  try {

    const questions =
      await Question.find({
        departmentId:
          req.params.departmentId
      })
      .sort({ order: 1 });

    res.json(questions);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.updateQuestion =
async (req, res) => {

  try {

    const question =
      await Question.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(question);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.deleteQuestion =
async (req, res) => {

  try {

    await Question.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};