const EmployeeAnswer = require("../models/EmployeeAnswer");
const User = require("../models/User");
const Department = require("../models/Department");
const Question = require("../models/Question");
const CustomAnswer = require("../models/CustomAnswer");
const CustomQuestion = require("../models/CustomQuestion");

/**
 * Employee: Save multiple answers at once.
 * POST /api/answers
 */
exports.saveMultipleAnswers = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const companyId = req.user.companyId;
    const { answers, departmentId } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: "answers array is required" });
    }

    const bulkOps = answers.map((ans) => ({
      updateOne: {
        filter: { employeeId, questionId: ans.questionId },
        update: {
          $set: {
            companyId,
            departmentId: departmentId || ans.departmentId,
            answer: ans.answer,
            submitted: true,
            submittedAt: new Date()
          }
        },
        upsert: true
      }
    }));

    if (bulkOps.length > 0) {
      await EmployeeAnswer.bulkWrite(bulkOps);
    }

    res.json({ success: true, message: "Answers saved successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Employee: Save or update a single answer (draft mode).
 * POST /api/answers/save
 */
exports.saveAnswer = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const { companyId, departmentId, questionId, answer } = req.body;

    if (!companyId || !departmentId || !questionId) {
      return res.status(400).json({ message: "companyId, departmentId and questionId are required" });
    }

    // Upsert: find existing answer or create new
    const saved = await EmployeeAnswer.findOneAndUpdate(
      { employeeId, questionId },
      {
        companyId,
        employeeId,
        departmentId,
        questionId,
        answer,
        submitted: false // draft
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, answer: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Employee: Submit all answers for a department.
 * POST /api/answers/submit/:departmentId
 */
exports.submitDepartment = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const { departmentId } = req.params;

    const result = await EmployeeAnswer.updateMany(
      { employeeId, departmentId, submitted: false },
      { submitted: true, submittedAt: new Date() }
    );

    res.json({ success: true, updatedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Employee: Get their saved answers for a specific department.
 * GET /api/answers/my/:departmentId
 */
exports.getMyAnswers = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const { departmentId } = req.params;

    const answers = await EmployeeAnswer.find({ employeeId, departmentId });
    res.json({ success: true, answers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Employee: Get progress stats for all departments (how many questions answered per dept).
 * GET /api/answers/my-progress?companyId=...
 */
exports.getMyProgress = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const { companyId } = req.query;

    // Get all departments
    const departments = await Department.find({ isActive: true }).lean();

    const progress = await Promise.all(
      departments.map(async (dept) => {
        const totalQuestions = await Question.countDocuments({
          departmentId: dept._id,
          active: true
        });
        const answeredCount = await EmployeeAnswer.countDocuments({
          employeeId,
          departmentId: dept._id
        });
        const submittedCount = await EmployeeAnswer.countDocuments({
          employeeId,
          departmentId: dept._id,
          submitted: true
        });
        const isSubmitted = submittedCount === totalQuestions && totalQuestions > 0;
        const percentage = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

        return {
          department: dept,
          totalQuestions,
          answeredCount,
          submittedCount,
          isSubmitted,
          percentage
        };
      })
    );

    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Company Admin: Get top-level dashboard stats.
 * GET /api/answers/company-stats
 */
exports.getCompanyStats = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    if (!companyId) return res.status(403).json({ message: "Not a company user." });

    const totalEmployees = await User.countDocuments({ companyId, role: "dept_head" });
    const activeDepartments = (await User.distinct("department", { companyId, role: "dept_head" })).length;
    
    const submittedEmployeeIds = await CustomAnswer.distinct("userId", { companyId });
    const submittedCount = submittedEmployeeIds.length;
    const pendingCount = totalEmployees - submittedCount;

    res.json({
      success: true,
      stats: {
        totalEmployees,
        submittedCount,
        pendingCount,
        activeDepartments,
        averageScore: "N/A"
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Company Admin: Get per-department progress.
 * GET /api/answers/dept-progress
 */
exports.getDepartmentProgress = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    if (!companyId) return res.status(403).json({ message: "Not a company user." });

    const heads = await User.find({ companyId, role: "dept_head" });
    const depts = {};
    for (const h of heads) {
      if (!depts[h.department]) depts[h.department] = { deptName: h.department, total: 0, submitted: 0 };
      depts[h.department].total += 1;
      
      const hasAns = await CustomAnswer.exists({ userId: h._id });
      if (hasAns) depts[h.department].submitted += 1;
    }

    const progress = Object.values(depts).map(d => ({
      department: { name: d.deptName },
      submittedCount: d.submitted,
      totalEmployees: d.total,
      percentage: d.total > 0 ? Math.round((d.submitted / d.total) * 100) : 0
    }));

    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Company Admin: Get submission status table.
 * GET /api/answers/submission-table
 */
exports.getSubmissionTable = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    if (!companyId) return res.status(403).json({ message: "Not a company user." });

    const employees = await User.find({ companyId, role: "dept_head" }).select("name email department");

    const rows = await Promise.all(
      employees.map(async (emp) => {
        const lastAns = await CustomAnswer.findOne({ userId: emp._id }).sort({ updatedAt: -1 });

        let status = "Pending";
        let lastUpdated = null;

        if (lastAns) {
          status = "Submitted";
          lastUpdated = lastAns.updatedAt;
        }

        return {
          employeeId: emp._id,
          employeeName: emp.name,
          departments: emp.departments && emp.departments.length > 0 ? emp.departments : [emp.department],
          status,
          lastUpdated
        };
      })
    );

    res.json({ success: true, table: rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
