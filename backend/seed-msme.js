require("dotenv").config();
const mongoose = require("mongoose");
const Department = require("./src/models/Department");
const Question = require("./src/models/Question");
const connectDB = require("./src/config/db");

async function seedMSME() {
  await connectDB();
  console.log("Connected to MongoDB");

  // Create a department
  const hrDept = await Department.create({
    code: "HR",
    title: { en: "Human Resources", hi: "मानव संसाधन", gu: "માનવ સંસાધન" },
    order: 1,
    isActive: true
  });
  console.log("Created HR Department");

  // Create questions
  await Question.insertMany([
    {
      departmentId: hrDept._id,
      code: "HR_001",
      type: "singleSelect",
      question: { en: "Do you have a formal employee handbook?", hi: "", gu: "" },
      options: [{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }],
      order: 1
    },
    {
      departmentId: hrDept._id,
      code: "HR_002",
      type: "scale",
      question: { en: "Rate the overall employee satisfaction (1-10)", hi: "", gu: "" },
      order: 2
    },
    {
      departmentId: hrDept._id,
      code: "HR_003",
      type: "textarea",
      question: { en: "Describe your hiring process.", hi: "", gu: "" },
      order: 3
    }
  ]);
  console.log("Created HR Questions");

  process.exit(0);
}

seedMSME().catch(err => {
  console.error(err);
  process.exit(1);
});
