const Company = require("../models/Company");
const User = require("../models/User");
const QuestionnaireResponse = require("../models/QuestionnaireResponse");

// Simple hardcoded admin login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // In production, this should verify against a database user with role 'admin'
    if (email === "admin@msme.gov.in" && password === "admin123") {
      // Returning a simple token for frontend protection
      return res.json({ token: "admin-auth-token-12345", user: { email, role: "admin" } });
    }
    
    res.status(401).json({ message: "Invalid admin credentials" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all companies with their questionnaire responses
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().lean();
    
    // Fetch responses for all companies
    const responses = await QuestionnaireResponse.find().lean();
    
    // Attach responses to companies
    const companiesWithResponses = companies.map(company => {
      const companyResponses = responses.filter(r => String(r.companyId) === String(company._id));
      return { ...company, responses: companyResponses };
    });

    res.json(companiesWithResponses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all participants
exports.getParticipants = async (req, res) => {
  try {
    const participants = await User.find({ role: "participant" }).lean();
    res.json(participants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update company approval status
exports.updateCompanyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const company = await Company.findByIdAndUpdate(id, { approvalStatus: status }, { new: true });
    
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update participant approval status
exports.updateParticipantStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const participant = await User.findByIdAndUpdate(id, { approvalStatus: status }, { new: true });
    
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    res.json(participant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
