const express = require("express");

const router = express.Router();

const Department = require("../models/Department");

router.get("/seed", async (req, res) => {

  await Department.deleteMany({});

  await Department.insertMany([
    {
      code: "operations",
      title: {
        en: "Operations & Production",
        hi: "संचालन एवं उत्पादन",
        gu: "ઓપરેશન્સ અને પ્રોડક્શન"
      },
      order: 1
    },

    {
      code: "finance",
      title: {
        en: "Finance & Working Capital",
        hi: "वित्त एवं कार्यशील पूंजी",
        gu: "ફાઇનાન્સ અને વર્કિંગ કેપિટલ"
      },
      order: 2
    },

    {
      code: "hr",
      title: {
        en: "HR & Workforce",
        hi: "एचआर एवं कार्यबल",
        gu: "એચઆર અને વર્કફોર્સ"
      },
      order: 3
    }
  ]);

  res.json({
    success: true
  });

});

module.exports = router;