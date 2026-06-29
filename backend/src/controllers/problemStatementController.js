const ProblemStatement = require("../models/ProblemStatement");

// Create or update a problem statement
exports.createOrUpdateProblemStatement = async (req, res) => {
  try {
    const { businessName, industry, customIndustry, department, customDepartment, problemTitle, problemDescription, expectedSolution, expectedImpact } = req.body;
    const userId = req.user.id;
    const companyId = req.user.companyId;
    const resolvedIndustry = industry === "Custom" ? customIndustry : industry;
    const resolvedDepartment = department === "Custom" ? customDepartment : department;

    if (!companyId) {
      return res.status(400).json({ message: "User is not linked to a company. Please register as a company user." });
    }

    if (!businessName || !resolvedIndustry || !problemTitle || !problemDescription) {
      return res.status(400).json({ message: "Missing required fields: businessName, industry, problemTitle, problemDescription" });
    }

    // Check if one already exists for this company
    let statement = await ProblemStatement.findOne({ companyId });

    if (statement) {
      statement.businessName = businessName;
      statement.industry = resolvedIndustry;
      statement.department = resolvedDepartment;
      statement.problemTitle = problemTitle;
      statement.problemDescription = problemDescription;
      statement.expectedSolution = expectedSolution;
      statement.expectedImpact = expectedImpact;
      await statement.save();
    } else {
      statement = await ProblemStatement.create({
        companyId,
        userId,
        businessName,
        industry: resolvedIndustry,
        department: resolvedDepartment,
        problemTitle,
        problemDescription,
        expectedSolution,
        expectedImpact
      });
    }

    res.status(201).json({ success: true, problemStatement: statement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get the logged-in company's problem statement
exports.getMyProblemStatement = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user.id;
    const statement = await ProblemStatement.findOne({ companyId });

    if (!statement) {
      return res.status(404).json({ success: false, message: "No problem statement found" });
    }

    res.json({ success: true, problemStatement: statement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
