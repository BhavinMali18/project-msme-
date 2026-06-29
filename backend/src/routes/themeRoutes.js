const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // Assuming admin/auth protection as needed
const auditLogger = require("../middleware/auditLogger");
const { createTheme, getThemes, deleteTheme } = require("../controllers/themeController");

router.post("/", auth, auditLogger("CREATE_THEME", "Theme"), createTheme);
router.get("/", getThemes); // Publicly accessible to fetch themes for dropdowns
router.delete("/:id", auth, auditLogger("DELETE_THEME", "Theme"), deleteTheme);

module.exports = router;
