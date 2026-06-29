require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");
const Department = require("./src/models/Department");
const Question = require("./src/models/Question");
const connectDB = require("./src/config/db");

// Configuration matching DEPARTMENTS_CONFIG in Register.jsx
const DEPARTMENTS_CONFIG = [
  {
    id: "operations",
    questions: [
      { id: "q1", type: "scale" },
      { id: "q2", type: "text" },
      { id: "q3", type: "text" },
      { id: "q4", type: "yesNo" },
      { id: "q5", type: "scale" },
      { id: "q6", type: "scale" },
      { id: "q7", type: "yesNo" },
      { id: "q8", type: "text" },
      { id: "q9", type: "text" },
      { id: "q10", type: "scale" },
      { id: "q11", type: "yesNo" },
      { id: "q12", type: "text" }
    ]
  },
  {
    id: "finance",
    questions: [
      { id: "q1", type: "text" },
      { id: "q2", type: "yesNo" },
      { id: "q3", type: "scale" },
      { id: "q4", type: "multiSelect", options: [
        { value: "a", label: "Cash flow timing gaps" },
        { value: "b", label: "High interest on loans" },
        { value: "c", label: "Lack of collateral for credit" },
        { value: "d", label: "GST/tax refund delays" },
        { value: "e", label: "Managing multiple bank accounts and reconciliation" }
      ]},
      { id: "q5", type: "yesNo" },
      { id: "q6", type: "text" },
      { id: "q7", type: "scale" },
      { id: "q8", type: "yesNo" },
      { id: "q9", type: "text" },
      { id: "q10", type: "text" }
    ]
  },
  {
    id: "hr",
    questions: [
      { id: "q1", type: "text" },
      { id: "q2", type: "scale" },
      { id: "q3", type: "multiSelect", options: [
        { value: "a", label: "Wages" },
        { value: "b", label: "Working conditions" },
        { value: "c", label: "Seasonal migration" },
        { value: "d", label: "Better offers elsewhere" },
        { value: "e", label: "Lack of career growth" }
      ]},
      { id: "q4", type: "yesNo" },
      { id: "q5", type: "text" },
      { id: "q6", type: "yesNo" },
      { id: "q7", type: "scale" },
      { id: "q8", type: "yesNo" },
      { id: "q9", type: "text" },
      { id: "q10", type: "text" }
    ]
  },
  {
    id: "sales",
    questions: [
      { id: "q1", type: "text" },
      { id: "q2", type: "scale" },
      { id: "q3", type: "yesNo" },
      { id: "q4", type: "text" },
      { id: "q5", type: "scale" },
      { id: "q6", type: "yesNo" },
      { id: "q7", type: "text" },
      { id: "q8", type: "scale" },
      { id: "q9", type: "yesNo" },
      { id: "q10", type: "text" }
    ]
  },
  {
    id: "supply_chain",
    questions: [
      { id: "q1", type: "text" },
      { id: "q2", type: "text" },
      { id: "q3", type: "scale" },
      { id: "q4", type: "yesNo" },
      { id: "q5", type: "text" },
      { id: "q6", type: "scale" },
      { id: "q7", type: "yesNo" },
      { id: "q8", type: "text" },
      { id: "q9", type: "multiSelect", options: [
        { value: "a", label: "Own fleet" },
        { value: "b", label: "Dedicated 3PL" },
        { value: "c", label: "Ad-hoc transport" },
        { value: "d", label: "Combination" }
      ]},
      { id: "q10", type: "text" }
    ]
  },
  {
    id: "technology",
    questions: [
      { id: "q1", type: "multiSelect", options: [
        { value: "a", label: "WhatsApp/Excel only" },
        { value: "b", label: "Basic accounting software (Tally)" },
        { value: "c", label: "ERP (SAP/Odoo/etc.)" },
        { value: "d", label: "Custom software" },
        { value: "e", label: "Nothing digital" }
      ]},
      { id: "q2", type: "scale" },
      { id: "q3", type: "yesNo" },
      { id: "q4", type: "singleSelect", options: [
        { value: "a", label: "Cost" },
        { value: "b", label: "Not relevant to my business" },
        { value: "c", label: "My team will not use it" },
        { value: "d", label: "I do not know what is available" },
        { value: "e", label: "Past bad experience" }
      ]},
      { id: "q5", type: "scale" },
      { id: "q6", type: "yesNo" },
      { id: "q7", type: "text" },
      { id: "q8", type: "scale" },
      { id: "q9", type: "yesNo" },
      { id: "q10", type: "text" }
    ]
  },
  {
    id: "regulatory",
    questions: [
      { id: "q1", type: "text" },
      { id: "q2", type: "scale" },
      { id: "q3", type: "yesNo" },
      { id: "q4", type: "yesNo" },
      { id: "q5", type: "singleSelect", options: [
        { value: "a", label: "GST" },
        { value: "b", label: "Labour/PF/ESIC" },
        { value: "c", label: "Environmental/Pollution board" },
        { value: "d", label: "Export/import documentation" },
        { value: "e", label: "Product certification (BIS/ISO)" }
      ]},
      { id: "q6", type: "scale" },
      { id: "q7", type: "yesNo" },
      { id: "q8", type: "yesNo" },
      { id: "q9", type: "yesNo" },
      { id: "q10", type: "text" }
    ]
  },
  {
    id: "energy",
    questions: [
      { id: "q1", type: "text" },
      { id: "q2", type: "scale" },
      { id: "q3", type: "yesNo" },
      { id: "q4", type: "multiSelect", options: [
        { value: "a", label: "Excess material waste/scrap" },
        { value: "b", label: "Wastewater disposal cost" },
        { value: "c", label: "Hazardous waste compliance" },
        { value: "d", label: "High water consumption" },
        { value: "e", label: "Packaging waste" }
      ]},
      { id: "q5", type: "yesNo" },
      { id: "q6", type: "scale" },
      { id: "q7", type: "yesNo" },
      { id: "q8", type: "yesNo" },
      { id: "q9", type: "scale" },
      { id: "q10", type: "text" }
    ]
  }
];

const runSeeder = async () => {
  await connectDB();
  console.log("Connected to MongoDB");

  try {
    // Dynamically import translations module from the portal
    const languagesPath = path.resolve(__dirname, "../msme-portal/src/i18n/languages.js");
    const fileUrl = "file:///" + languagesPath.replace(/\\/g, "/");
    const { translations } = await import(fileUrl);
    console.log("Translations loaded successfully");

    // 1. Wipe existing departments and questions
    await Department.deleteMany({});
    await Question.deleteMany({});
    console.log("Cleared existing Department and Question collections");

    // 2. Iterate through DEPARTMENTS_CONFIG to seed
    for (let i = 0; i < DEPARTMENTS_CONFIG.length; i++) {
      const config = DEPARTMENTS_CONFIG[i];
      const deptKey = config.id;

      // Extract translated names
      const titleEn = translations.en[deptKey]?.name || deptKey;
      const titleHi = translations.hi[deptKey]?.name || "";
      const titleGu = translations.gu[deptKey]?.name || "";

      // Create Department
      const deptDoc = await Department.create({
        code: deptKey,
        title: {
          en: titleEn,
          hi: titleHi,
          gu: titleGu
        },
        order: i + 1,
        isActive: true
      });
      console.log(`Created Department: ${titleEn} (${deptKey})`);

      // Create Questions for this department
      const questionsToInsert = config.questions.map((qConfig, qIdx) => {
        // Extract translated prompts
        const qEn = translations.en[deptKey]?.[qConfig.id] || "";
        const qHi = translations.hi[deptKey]?.[qConfig.id] || "";
        const qGu = translations.gu[deptKey]?.[qConfig.id] || "";

        // Map 'yesNo' type to 'singleSelect' for database model compatibility
        let mappedType = qConfig.type;
        let options = qConfig.options || [];

        if (qConfig.type === "yesNo") {
          mappedType = "singleSelect";
          options = [
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" }
          ];
        }

        return {
          departmentId: deptDoc._id,
          code: `${deptKey.substring(0, 3).toUpperCase()}_${String(qIdx + 1).padStart(3, '0')}`,
          type: mappedType,
          question: {
            en: qEn,
            hi: qHi,
            gu: qGu
          },
          options: options,
          required: true,
          active: true,
          order: qIdx + 1
        };
      });

      await Question.insertMany(questionsToInsert);
      console.log(`Inserted ${questionsToInsert.length} questions for ${deptKey}`);
    }

    console.log("\n🚀 DB Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

runSeeder();
