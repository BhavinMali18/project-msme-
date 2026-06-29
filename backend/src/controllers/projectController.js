const Project = require("../models/Project");
const User = require("../models/User");
const Team = require("../models/Team");

exports.createOrUpdateProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      projectName, problemStatement, solution, industry, 
      trlLevel, startupStage, revenue, customers, patents 
    } = req.body;

    const user = await User.findById(userId);
    if (!user || !user.teamId) {
      return res.status(400).json({ message: "You must be in a team to create a project." });
    }

    let project = await Project.findOne({ teamId: user.teamId });

    if (project) {
      // Update existing
      project.projectName = projectName || project.projectName;
      project.problemStatement = problemStatement || project.problemStatement;
      project.solution = solution || project.solution;
      project.industry = industry || project.industry;
      project.trlLevel = trlLevel || project.trlLevel;
      project.startupStage = startupStage || project.startupStage;
      project.revenue = revenue || project.revenue;
      project.customers = customers || project.customers;
      project.patents = patents || project.patents;
      
      await project.save();
    } else {
      // Create new
      project = await Project.create({
        teamId: user.teamId,
        projectName,
        problemStatement,
        solution,
        industry,
        trlLevel,
        startupStage,
        revenue,
        customers,
        patents
      });
    }

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyProject = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.teamId) {
      return res.status(404).json({ message: "Project not found" });
    }

    const project = await Project.findOne({ teamId: user.teamId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
