const mongoose = require("mongoose");
const User = require("./src/models/User");
const Company = require("./src/models/Company");
const QuestionnaireResponse = require("./src/models/QuestionnaireResponse");

const MONGO_URI = "mongodb://localhost:27017/project-msme";

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully!");

    const companyCount = await Company.countDocuments();
    const userCount = await User.countDocuments();
    const responseCount = await QuestionnaireResponse.countDocuments();

    console.log(`\n--- DB Stats ---`);
    console.log(`Total Companies: ${companyCount}`);
    console.log(`Total Users: ${userCount}`);
    console.log(`Total Questionnaire Responses: ${responseCount}`);

    console.log(`\n--- Registered Companies ---`);
    const companies = await Company.find();
    companies.forEach(c => {
      console.log(`- ${c.name} (${c.city}, ${c.state}) [ID: ${c._id}]`);
    });

    console.log(`\n--- Registered Users ---`);
    const users = await User.find();
    users.forEach(u => {
      console.log(`- Name: ${u.name}, Email: ${u.email}, Role: ${u.role}, Company: ${u.companyName} [ID: ${u._id}]`);
    });

    console.log(`\n--- Questionnaire Responses ---`);
    const responses = await QuestionnaireResponse.find();
    responses.forEach(r => {
      console.log(`- Company ID: ${r.companyId}, User ID: ${r.userId}, Departments answered: ${Object.keys(r.answers).join(", ")}`);
    });

  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  } finally {
    await mongoose.disconnect();
  }
};

run();
