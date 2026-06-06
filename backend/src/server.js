require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

connectDB();
app.use(
  "/api/assessments",
  require("./routes/assessmentRoutes")
);
app.use(cors());
app.use(express.json());
app.use(
  "/api/auth",
  require("./routes/authRoutes")
);
app.use(
  "/api/setup",
  require("./routes/setupRoutes")
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "XLRQ API Running"
  });
});
app.use(
  "/api/departments",
  require("./routes/departmentRoutes")
);

app.use(
  "/api/questions",
  require("./routes/questionRoutes")
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});