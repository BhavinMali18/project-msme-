const Department = require("../models/Department");

exports.createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);

    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .sort({ order: 1 });

    res.json(departments);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const department =
      await Department.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(department);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(
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