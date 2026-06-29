const mongoose = require("mongoose");
const User = require("./src/models/User");
const Company = require("./src/models/Company");
const QuestionnaireResponse = require("./src/models/QuestionnaireResponse");
const Team = require("./src/models/Team");
const Project = require("./src/models/Project");
const Submission = require("./src/models/Submission");
const Theme = require("./src/models/Theme");
const MentorAssignment = require("./src/models/MentorAssignment");
const EvaluationRubric = require("./src/models/EvaluationRubric");
const EvaluationScore = require("./src/models/EvaluationScore");

const MONGO_URI = "mongodb://localhost:27017/project-msme";

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully!\n");

    const [
      companyCount, userCount, responseCount, teamCount, projectCount, 
      submissionCount, themeCount, mentorAssignmentCount, rubricCount, scoreCount,
      studentCount, universityCount, startupIndividualCount
    ] = await Promise.all([
      Company.countDocuments(),
      User.countDocuments(),
      QuestionnaireResponse.countDocuments(),
      Team.countDocuments(),
      Project.countDocuments(),
      Submission.countDocuments(),
      Theme.countDocuments(),
      MentorAssignment.countDocuments(),
      EvaluationRubric.countDocuments(),
      EvaluationScore.countDocuments(),
      User.countDocuments({ category: "student" }),
      User.countDocuments({ category: "university" }),
      User.countDocuments({ category: "startup_individual" })
    ]);

    console.log(`--- DB Stats ---`);
    console.log(`Total Companies: ${companyCount}`);
    console.log(`Total Users: ${userCount}`);
    console.log(`  -> Students: ${studentCount}`);
    console.log(`  -> Universities: ${universityCount}`);
    console.log(`  -> Startups/Individuals: ${startupIndividualCount}`);
    console.log(`Total Questionnaire Responses: ${responseCount}`);
    console.log(`Total Teams: ${teamCount}`);
    console.log(`Total Projects: ${projectCount}`);
    console.log(`Total Submissions: ${submissionCount}`);
    console.log(`Total Themes: ${themeCount}`);
    console.log(`Total Mentor Assignments: ${mentorAssignmentCount}`);
    console.log(`Total Evaluation Rubrics: ${rubricCount}`);
    console.log(`Total Evaluation Scores: ${scoreCount}`);

    console.log(`\n--- Registered Companies ---`);
    const companies = await Company.find();
    companies.forEach(c => console.log(`- ${c.name} (${c.city}, ${c.state}) [ID: ${c._id}]`));

    console.log(`\n--- Registered Users ---`);
    const users = await User.find();
    users.forEach(u => console.log(`- Name: ${u.name}, Email: ${u.email}, Role: ${u.role} [ID: ${u._id}]`));

    console.log(`\n--- Teams ---`);
    const teams = await Team.find();
    teams.forEach(t => console.log(`- Team: ${t.teamName}, Leader: ${t.leaderId} [ID: ${t._id}]`));

    console.log(`\n--- Projects ---`);
    const projects = await Project.find();
    projects.forEach(p => console.log(`- Project: ${p.projectName}, Stage: ${p.startupStage} [ID: ${p._id}]`));

    console.log(`\n--- Themes ---`);
    const themes = await Theme.find();
    themes.forEach(t => console.log(`- Theme: ${t.name}, Color: ${t.color} [ID: ${t._id}]`));

    console.log(`\n--- Mentor Assignments ---`);
    const assignments = await MentorAssignment.find();
    assignments.forEach(a => console.log(`- Mentor ID: ${a.mentorId}, Team ID: ${a.teamId} [ID: ${a._id}]`));

  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  } finally {
    await mongoose.disconnect();
  }
};

run();
