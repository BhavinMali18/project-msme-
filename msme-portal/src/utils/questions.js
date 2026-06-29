export const DEPARTMENTS_CONFIG = [
  {
    id: "operations",
    minLabels: { q1: { min: "Never", max: "Always" }, q5: { min: "Very easy", max: "Very difficult" }, q6: { min: "Very dissatisfied", max: "Very satisfied" }, q10: { min: "Not at all", max: "Fully confident" } },
    questions: [
      { id: "q1", type: "scale" },
      { id: "q2", type: "text" },
      { id: "q3", type: "text" },
      { id: "q4", type: "yesNo", followUpPlaceholder: "Describe briefly" },
      { id: "q5", type: "scale" },
      { id: "q6", type: "scale" },
      { id: "q7", type: "yesNo", followUpPlaceholder: "If yes, frequency (weekly / monthly / quarterly)" },
      { id: "q8", type: "text" },
      { id: "q9", type: "text" },
      { id: "q10", type: "scale" },
      { id: "q11", type: "yesNo", followUpPlaceholder: "Describe the system" },
      { id: "q12", type: "text" }
    ]
  },
  {
    id: "finance",
    minLabels: { q3: { min: "Very difficult", max: "Very easy" }, q7: { min: "No visibility", max: "Full clarity" } },
    questions: [
      { id: "q1", type: "text", placeholder: "Number of days" },
      { id: "q2", type: "yesNo", followUpPlaceholder: "Describe impact" },
      { id: "q3", type: "scale" },
      { id: "q4", type: "multiSelect", options: [
        { value: "a", label: "Cash flow timing gaps" },
        { value: "b", label: "High interest on loans" },
        { value: "c", label: "Lack of collateral for credit" },
        { value: "d", label: "GST/tax refund delays" },
        { value: "e", label: "Managing multiple bank accounts and reconciliation" }
      ]},
      { id: "q5", type: "yesNo", followUpPlaceholder: "Which tool?" },
      { id: "q6", type: "text" },
      { id: "q7", type: "scale" },
      { id: "q8", type: "yesNo", followUpPlaceholder: "Approximate value (INR)" },
      { id: "q9", type: "text" },
      { id: "q10", type: "text" }
    ]
  },
  {
    id: "hr",
    minLabels: { q2: { min: "Very easy", max: "Very difficult" }, q7: { min: "Not at all", max: "Fully confident" } },
    questions: [
      { id: "q1", type: "text", placeholder: "% + Yes/No" },
      { id: "q2", type: "scale" },
      { id: "q3", type: "multiSelect", options: [
        { value: "a", label: "Wages" },
        { value: "b", label: "Working conditions" },
        { value: "c", label: "Seasonal migration" },
        { value: "d", label: "Better offers elsewhere" },
        { value: "e", label: "Lack of career growth" }
      ]},
      { id: "q4", type: "yesNo", followUpPlaceholder: "Describe briefly" },
      { id: "q5", type: "text", placeholder: "weeks/months + Yes/No" },
      { id: "q6", type: "yesNo", followUpPlaceholder: "Which area?" },
      { id: "q7", type: "scale" },
      { id: "q8", type: "yesNo", followUpPlaceholder: "Describe the gap if known" },
      { id: "q9", type: "text" },
      { id: "q10", type: "text" }
    ]
  },
  {
    id: "sales",
    minLabels: { q2: { min: "All referral", max: "All active outreach" }, q5: { min: "No clarity", max: "Full clarity" }, q8: { min: "Fully relationship-dependent", max: "Strong lead generation" } },
    questions: [
      { id: "q1", type: "text", placeholder: "% + scale 1–5 for concern" },
      { id: "q2", type: "scale" },
      { id: "q3", type: "yesNo", followUpPlaceholder: "If no, reason" },
      { id: "q4", type: "text" },
      { id: "q5", type: "scale" },
      { id: "q6", type: "yesNo", followUpPlaceholder: "If yes, obstacles / If no, holding back" },
      { id: "q7", type: "text" },
      { id: "q8", type: "scale" },
      { id: "q9", type: "yesNo", followUpPlaceholder: "Reason if known" },
      { id: "q10", type: "text" }
    ]
  },
  {
    id: "supply_chain",
    minLabels: { q3: { min: "Highly volatile", max: "Very stable" }, q6: { min: "No visibility", max: "Full real-time view" } },
    questions: [
      { id: "q1", type: "text", placeholder: "number + impact description" },
      { id: "q2", type: "text", placeholder: "frequency" },
      { id: "q3", type: "scale" },
      { id: "q4", type: "yesNo", followUpPlaceholder: "For what % of suppliers?" },
      { id: "q5", type: "text" },
      { id: "q6", type: "scale" },
      { id: "q7", type: "yesNo", followUpPlaceholder: "If yes, frequency and impact" },
      { id: "q8", type: "text", placeholder: "days + Yes/No for consistency" },
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
    minLabels: { q2: { min: "All paper/verbal", max: "Fully digital" }, q5: { min: "Not at all", max: "Fully capable" }, q8: { min: "No trust", max: "Full trust" } },
    questions: [
      { id: "q1", type: "multiSelect", options: [
        { value: "a", label: "WhatsApp/Excel only" },
        { value: "b", label: "Basic accounting software (Tally)" },
        { value: "c", label: "ERP (SAP/Odoo/etc.)" },
        { value: "d", label: "Custom software" },
        { value: "e", label: "Nothing digital" }
      ]},
      { id: "q2", type: "scale" },
      { id: "q3", type: "yesNo", followUpPlaceholder: "Reason" },
      { id: "q4", type: "singleSelect", options: [
        { value: "a", label: "Cost" },
        { value: "b", label: "Not relevant to my business" },
        { value: "c", label: "My team will not use it" },
        { value: "d", label: "I do not know what is available" },
        { value: "e", label: "Past bad experience" }
      ]},
      { id: "q5", type: "scale" },
      { id: "q6", type: "yesNo", followUpPlaceholder: "Describe what data" },
      { id: "q7", type: "text" },
      { id: "q8", type: "scale" },
      { id: "q9", type: "yesNo", followUpPlaceholder: "Impact description" },
      { id: "q10", type: "text" }
    ]
  },
  {
    id: "regulatory",
    minLabels: { q2: { min: "Not confident", max: "Fully confident" }, q6: { min: "Very difficult", max: "Very easy" } },
    questions: [
      { id: "q1", type: "text", placeholder: "Approximate hours" },
      { id: "q2", type: "scale" },
      { id: "q3", type: "yesNo", followUpPlaceholder: "Type of failure" },
      { id: "q4", type: "yesNo", followUpPlaceholder: "Which areas" },
      { id: "q5", type: "singleSelect", options: [
        { value: "a", label: "GST" },
        { value: "b", label: "Labour/PF/ESIC" },
        { value: "c", label: "Environmental/Pollution board" },
        { value: "d", label: "Export/import documentation" },
        { value: "e", label: "Product certification (BIS/ISO)" }
      ]},
      { id: "q6", type: "scale" },
      { id: "q7", type: "yesNo", followUpPlaceholder: "Describe system" },
      { id: "q8", type: "yesNo", followUpPlaceholder: "Describe impact" },
      { id: "q9", type: "yesNo", followUpPlaceholder: "Which schemes" },
      { id: "q10", type: "text" }
    ]
  },
  {
    id: "energy",
    minLabels: { q2: { min: "No visibility", max: "Full breakdown" }, q6: { min: "Not prepared", max: "Fully prepared" }, q9: { min: "No impact", max: "Significant savings" } },
    questions: [
      { id: "q1", type: "text", placeholder: "% + Yes/No" },
      { id: "q2", type: "scale" },
      { id: "q3", type: "yesNo", followUpPlaceholder: "Describe initiative" },
      { id: "q4", type: "multiSelect", options: [
        { value: "a", label: "Excess material waste/scrap" },
        { value: "b", label: "Wastewater disposal cost" },
        { value: "c", label: "Hazardous waste compliance" },
        { value: "d", label: "High water consumption" },
        { value: "e", label: "Packaging waste" }
      ]},
      { id: "q5", type: "yesNo", followUpPlaceholder: "Which buyers?" },
      { id: "q6", type: "scale" },
      { id: "q7", type: "yesNo", followUpPlaceholder: "Reason/barrier" },
      { id: "q8", type: "yesNo", followUpPlaceholder: "What metrics" },
      { id: "q9", type: "scale" },
      { id: "q10", type: "text" }
    ]
  }
];
