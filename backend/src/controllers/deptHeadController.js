const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Company = require("../models/Company");

// Generate a readable random password
const generatePassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let pw = "";
  for (let i = 0; i < 10; i++) pw += chars[Math.floor(Math.random() * chars.length)];
  return pw;
};

// Generate login email from name + company domain fragment
const generateEmail = (name, companyName) => {
  const namePart = name.toLowerCase().replace(/\s+/g, ".");
  const companyPart = companyName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8);
  return `${namePart}@${companyPart}.msme.portal`;
};

// POST /api/dept-heads — company admin creates a dept head
exports.createDeptHead = async (req, res) => {
  try {
    const { name, departments } = req.body;
    const companyId = req.user.companyId;

    if (!name || !departments || !Array.isArray(departments) || departments.length === 0) {
      return res.status(400).json({ message: "Name and at least one department are required." });
    }
    if (!companyId) {
      return res.status(403).json({ message: "Only company admins can create dept heads." });
    }

    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: "Company not found." });

    const email = generateEmail(name, company.name);
    const tempPassword = generatePassword();
    const hash = await bcrypt.hash(tempPassword, 10);

    // Check for duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: `A user with email ${email} already exists. Try a different name.` });
    }

    const deptHead = await User.create({
      name,
      email,
      password: hash,
      tempPassword, // stored plain for display; cleared on first login
      role: "dept_head",
      department: departments[0], // fallback
      departments,
      isHead: true,
      companyId,
      companyName: company.name,
    });

    res.status(201).json({
      success: true,
      deptHead: {
        _id: deptHead._id,
        name: deptHead.name,
        email: deptHead.email,
        department: deptHead.department,
        departments: deptHead.departments,
        createdAt: deptHead.createdAt,
      },
      credentials: {
        email: deptHead.email,
        password: tempPassword,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/dept-heads — list all dept heads for a company
exports.getDeptHeads = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    if (!companyId) return res.status(403).json({ message: "Not a company user." });

    const heads = await User.find({ companyId, role: "dept_head" })
      .select("name email department departments createdAt isHead")
      .sort({ createdAt: -1 });

    res.json({ success: true, deptHeads: heads });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/dept-heads/:id
exports.deleteDeptHead = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const head = await User.findOne({ _id: req.params.id, companyId, role: "dept_head" });
    if (!head) return res.status(404).json({ message: "Dept head not found." });

    await head.deleteOne();
    res.json({ success: true, message: "Dept head removed." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/dept-heads/:id/password
exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const companyId = req.user.companyId;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const head = await User.findOne({ _id: req.params.id, companyId, role: "dept_head" });
    if (!head) return res.status(404).json({ message: "Dept head not found." });

    const hash = await bcrypt.hash(newPassword, 10);
    head.password = hash;
    head.tempPassword = newPassword;
    await head.save();

    res.json({
      success: true,
      message: "Password updated successfully.",
      credentials: {
        email: head.email,
        password: newPassword
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/dept-heads/:id/answers
exports.getDeptHeadAnswers = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const employeeId = req.params.id;

    const head = await User.findOne({ _id: employeeId, companyId, role: "dept_head" });
    if (!head) return res.status(404).json({ message: "Dept head not found." });

    const EmployeeAnswer = require("../models/EmployeeAnswer");
    const CustomAnswer = require("../models/CustomAnswer");

    const [deptAnswers, customAnswers] = await Promise.all([
      EmployeeAnswer.find({ employeeId }),
      CustomAnswer.find({ userId: employeeId })
    ]);

    res.json({
      success: true,
      employee: {
        name: head.name,
        departments: head.departments && head.departments.length > 0 ? head.departments : [head.department]
      },
      deptAnswers,
      customAnswers
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
