import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { translations } from "../../i18n/languages";

// Questionnaire Structural Configuration
const DEPARTMENTS_CONFIG = [
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

// Devanagari to Hinglish (Latin) transliteration mapping algorithm
function transliterateDevanagariToHinglish(text) {
  if (!text) return "";
  
  const mapping = {
    // Vowels
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ri', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
    // Consonants
    'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'n',
    'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'n',
    'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
    'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
    'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
    'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
    // Matras (Dependent Vowels)
    'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ri', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n', 'ः': 'h',
    // Special Symbols
    '्': '',
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
    '।': '.', ' ': ' '
  };

  const consonants = [
    'क','ख','ग','घ','च','छ','ज','झ','ट','ठ','ड','ढ','ण','त','थ','द','ध','न','प','फ','ब','भ','म','य','र','ल','व','श','ष','स','ह'
  ];
  
  const matras = [
    'ा','ि','ी','ु','ू','ृ','े','ै','ो','ौ','्','ं','ः'
  ];

  let result = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (mapping[char] !== undefined) {
      let replacement = mapping[char];

      const isConsonant = consonants.includes(char);
      const hasMatra = nextChar && matras.includes(nextChar);

      if (isConsonant && !hasMatra && nextChar !== ' ' && nextChar !== undefined) {
        replacement += 'a';
      }

      if (char === '्' && result.endsWith('a')) {
        result = result.slice(0, -1);
      }

      result += replacement;
    } else {
      result += char;
    }
  }

  return result.toLowerCase();
}

export default function Register() {
  const navigate = useNavigate();
  const { getCompanies, registerWithQuestionnaire } = useAuth();

  const [language, setLanguage] = useState("en"); // active language: en | hi | gu
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Microphone state
  const [isListening, setIsListening] = useState(false);
  const [listeningTarget, setListeningTarget] = useState(null); // { deptId, qId, isFollowUp, fieldName }

  // Loaded companies dropdown list
  const [companiesList, setCompaniesList] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);

  // Form State
  const [accountData, setAccountData] = useState({
    name: "",
    email: "",
    password: "",
    role: "company"
  });

  const [companySelection, setCompanySelection] = useState(""); // company ID or "NEW"
  const [newCompanyData, setNewCompanyData] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    contactPerson: "",
    phone: ""
  });

  const [selectedDepts, setSelectedDepts] = useState([]); // Array of department IDs
  const [activeDeptTab, setActiveDeptTab] = useState("");
  const [questionAnswers, setQuestionAnswers] = useState({}); // { deptId: { qId: value, qId_more: text } }

  // Load companies from DB
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompaniesList(data || []);
      } catch (err) {
        console.error("Failed to load companies:", err);
      } finally {
        setCompaniesLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewCompanyChange = (e) => {
    const { name, value } = e.target;
    setNewCompanyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeptToggle = (deptId) => {
    setSelectedDepts((prev) =>
      prev.includes(deptId) ? prev.filter((d) => d !== deptId) : [...prev, deptId]
    );
  };

  const handleAnswerChange = (deptId, questionId, value, isFollowUp = false) => {
    setQuestionAnswers((prev) => {
      const deptAnswers = prev[deptId] || {};
      if (isFollowUp) {
        return {
          ...prev,
          [deptId]: {
            ...deptAnswers,
            [`${questionId}_more`]: value
          }
        };
      } else {
        return {
          ...prev,
          [deptId]: {
            ...deptAnswers,
            [questionId]: value
          }
        };
      }
    });
  };

  const handleMultiSelectChange = (deptId, questionId, optionValue, isChecked) => {
    setQuestionAnswers((prev) => {
      const deptAnswers = prev[deptId] || {};
      const currentSelection = deptAnswers[questionId] || [];
      const newSelection = isChecked
        ? [...currentSelection, optionValue]
        : currentSelection.filter((v) => v !== optionValue);

      return {
        ...prev,
        [deptId]: {
          ...deptAnswers,
          [questionId]: newSelection
        }
      };
    });
  };

  const validateStep = () => {
    setError("");

    if (step === 1) {
      if (!accountData.name || !accountData.email || !accountData.password) {
        setError(language === "en" ? "Please fill out all personal credentials." : language === "hi" ? "कृपया सभी व्यक्तिगत क्रेडेंशियल भरें।" : "કૃપા કરીને બધી વ્યક્તિગત વિગતો ભરો.");
        return false;
      }
      if (accountData.password.length < 6) {
        setError(language === "en" ? "Password must be at least 6 characters." : language === "hi" ? "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।" : "પાસવર્ડ ઓછામાં ઓછો ૬ અક્ષરનો હોવો જોઈએ.");
        return false;
      }
      if (!companySelection) {
        setError(language === "en" ? "Please select an existing company or register a new one." : language === "hi" ? "कृपया एक मौजूदा कंपनी चुनें या एक नया पंजीकृत करें।" : "કૃપા કરીને હાલની કંપની પસંદ કરો અથવા નવી કંપની રજીસ્ટર કરો.");
        return false;
      }
      if (companySelection === "NEW") {
        if (!newCompanyData.name || !newCompanyData.city || !newCompanyData.state || !newCompanyData.country || !newCompanyData.pinCode) {
          setError(language === "en" ? "Please provide all required address/details for your company." : language === "hi" ? "कृपया अपनी कंपनी के लिए सभी आवश्यक पता/विवरण प्रदान करें।" : "કૃપા કરીને તમારી કંપની માટે જરૂરી બધી વિગતો આપો.");
          return false;
        }
      }
    } else if (step === 2) {
      if (selectedDepts.length === 0) {
        setError(language === "en" ? "Please select at least one department relevant to your role." : language === "hi" ? "कृपया अपनी भूमिका से संबंधित कम से कम एक विभाग का चयन करें।" : "કૃપા કરીને તમારી ભૂમિકાને સુસંગત ઓછામાં ઓછો એક વિભાગ પસંદ કરો.");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step === 2) {
        setActiveDeptTab(selectedDepts[0]);
      }
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const registrationPayload = {
        name: accountData.name,
        email: accountData.email,
        password: accountData.password,
        role: accountData.role,
        companyId: companySelection === "NEW" ? null : companySelection,
        newCompany: companySelection === "NEW" ? newCompanyData : null,
        questionnaireAnswers: questionAnswers
      };

      const user = await registerWithQuestionnaire(registrationPayload);

      if (user.role === "company") {
        navigate("/company/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  // Speech-to-text trigger handler
  const handleMicClick = (deptId, qId, isFollowUp, fieldName = "") => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser. Please use Chrome/Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    let speechLang = "en-IN";
    if (language === "hi") speechLang = "hi-IN";
    if (language === "gu") speechLang = "gu-IN";

    recognition.lang = speechLang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    setListeningTarget({ deptId, qId, isFollowUp, fieldName });

    recognition.start();

    recognition.onresult = (event) => {
      let transcript = event.results[0][0].transcript;
      
      // If Hindi active language, convert Devanagari text to Latin (Hinglish)
      if (language === "hi") {
        transcript = transliterateDevanagariToHinglish(transcript);
      }
      
      if (fieldName) {
        if (fieldName.startsWith("newCompanyData.")) {
          const subField = fieldName.split(".")[1];
          setNewCompanyData((prev) => ({ ...prev, [subField]: prev[subField] ? prev[subField] + " " + transcript : transcript }));
        } else {
          setAccountData((prev) => ({ ...prev, [fieldName]: prev[fieldName] ? prev[fieldName] + " " + transcript : transcript }));
        }
      } else {
        const currentAns = isFollowUp 
          ? (questionAnswers[deptId]?.[`${qId}_more`] || "")
          : (questionAnswers[deptId]?.[qId] || "");
        
        const newAns = currentAns ? currentAns + " " + transcript : transcript;
        handleAnswerChange(deptId, qId, newAns, isFollowUp);
      }
    };

    recognition.onerror = (err) => {
      console.error("Speech Recognition error:", err);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setListeningTarget(null);
    };
  };

  // Active language shortcut references
  const t = translations[language];

  return (
    <div className="auth-wrapper" style={{ minHeight: "100vh", padding: "40px 20px", flexDirection: "column", gap: "20px" }}>
      
      {/* Language Switcher Bar */}
      <div style={{
        display: "flex",
        background: "var(--code-bg)",
        border: "1px solid var(--border)",
        borderRadius: "20px",
        padding: "4px",
        gap: "4px"
      }}>
        {[
          { code: "en", label: "English" },
          { code: "hi", label: "हिंदी" },
          { code: "gu", label: "ગુજરાતી" }
        ].map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLanguage(lang.code)}
            style={{
              padding: "6px 16px",
              border: "none",
              borderRadius: "16px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "13px",
              background: language === lang.code ? "var(--accent)" : "transparent",
              color: language === lang.code ? "white" : "var(--text)"
            }}
          >
            {lang.label}
          </button>
        ))}
      </div>

      <div className="auth-card" style={{ maxWidth: step === 3 ? "850px" : "620px" }}>
        <h1 className="auth-title">{t.title}</h1>
        <p className="auth-subtitle">{t.subtitle}</p>

        {/* Progress Stepper */}
        <div className="stepper" style={{ marginBottom: "30px" }}>
          <div className="stepper-progress" style={{ width: `${((step - 1) / 2) * 100}%` }} />
          <div className={`step-item ${step >= 1 ? "completed" : ""} ${step === 1 ? "active" : ""}`}>1</div>
          <div className={`step-item ${step >= 2 ? "completed" : ""} ${step === 2 ? "active" : ""}`}>2</div>
          <div className={`step-item ${step >= 3 ? "completed" : ""} ${step === 3 ? "active" : ""}`}>3</div>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {/* STEP 1: Account Setup & Company Selection */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>{t.step1Title}</h2>
            
            <div className="form-group">
              <label className="form-label" htmlFor="name">{t.yourName}</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="form-input"
                  style={{ flexGrow: 1 }}
                  value={accountData.name}
                  onChange={handleAccountChange}
                  placeholder="e.g. John Doe"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleMicClick(null, null, false, "name")}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                    background: listeningTarget?.fieldName === "name" ? "red" : "var(--code-bg)"
                  }}
                >
                  🎤
                </button>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="email">{t.emailAddress}</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="form-input"
                  value={accountData.email}
                  onChange={handleAccountChange}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">{t.password}</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  className="form-input"
                  value={accountData.password}
                  onChange={handleAccountChange}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="role">{t.yourRole}</label>
              <select
                id="role"
                name="role"
                className="form-input"
                value={accountData.role}
                onChange={handleAccountChange}
                style={{ appearance: "auto" }}
              >
                <option value="company">{t.companyAdmin}</option>
                <option value="participant">{t.participantEmployee}</option>
              </select>
            </div>

            <div className="form-group" style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
              <label className="form-label" htmlFor="companySelect">{t.selectCompany}</label>
              <select
                id="companySelect"
                className="form-input"
                value={companySelection}
                onChange={(e) => setCompanySelection(e.target.value)}
                style={{ appearance: "auto" }}
              >
                <option value="">{t.chooseCompany}</option>
                <option value="NEW">{t.registerNewCompany}</option>
                {companiesList.map((comp) => (
                  <option key={comp._id} value={comp._id}>
                    {comp.name}
                  </option>
                ))}
              </select>
            </div>

            {companySelection === "NEW" && (
              <div style={{
                background: "var(--code-bg)",
                padding: "20px",
                borderRadius: "8px",
                marginTop: "16px",
                border: "1px solid var(--border)"
              }}>
                <h3 style={{ fontSize: "16px", margin: "0 0 16px 0" }}>{t.newCompanyProfile}</h3>
                
                <div className="form-group">
                  <label className="form-label">{t.companyName}</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      name="name"
                      className="form-input"
                      style={{ flexGrow: 1 }}
                      value={newCompanyData.name}
                      onChange={handleNewCompanyChange}
                      placeholder="e.g. Paramount Manufacturing"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleMicClick(null, null, false, "newCompanyData.name")}
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        cursor: "pointer",
                        background: listeningTarget?.fieldName === "newCompanyData.name" ? "red" : "var(--bg)"
                      }}
                    >
                      🎤
                    </button>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t.contactPerson}</label>
                    <input
                      type="text"
                      name="contactPerson"
                      className="form-input"
                      value={newCompanyData.contactPerson}
                      onChange={handleNewCompanyChange}
                      placeholder="e.g. Jane Smith"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.phoneNumber}</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      value={newCompanyData.phone}
                      onChange={handleNewCompanyChange}
                      placeholder="e.g. +91 99999 99999"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t.streetAddress}</label>
                  <input
                    type="text"
                    name="street"
                    className="form-input"
                    value={newCompanyData.street}
                    onChange={handleNewCompanyChange}
                    placeholder="e.g. GIDC Phase 3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t.city}</label>
                    <input
                      type="text"
                      name="city"
                      className="form-input"
                      value={newCompanyData.city}
                      onChange={handleNewCompanyChange}
                      placeholder="e.g. Vadodara"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.state}</label>
                    <input
                      type="text"
                      name="state"
                      className="form-input"
                      value={newCompanyData.state}
                      onChange={handleNewCompanyChange}
                      placeholder="e.g. Gujarat"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t.country}</label>
                    <input
                      type="text"
                      name="country"
                      className="form-input"
                      value={newCompanyData.country}
                      onChange={handleNewCompanyChange}
                      placeholder="e.g. India"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.pinCode}</label>
                    <input
                      type="text"
                      name="pinCode"
                      className="form-input"
                      value={newCompanyData.pinCode}
                      onChange={handleNewCompanyChange}
                      placeholder="e.g. 390010"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <button type="button" className="btn-primary" onClick={handleNext} style={{ marginTop: "24px" }}>
              {t.nextSelectDepts}
            </button>
          </div>
        )}

        {/* STEP 2: Choose Departments */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>{t.step2Title}</h2>
            
            <div style={{
              background: "var(--accent-bg)",
              border: "1px solid var(--accent-border)",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "24px",
              fontSize: "14px",
              lineHeight: "1.5",
              color: "var(--text-h)"
            }}>
              <p style={{ fontWeight: 600, marginBottom: "8px" }}>{t.purposeTitle}</p>
              <p style={{ marginBottom: "12px" }}>{t.purposeP1}</p>
              <p style={{ marginBottom: "12px" }}>{t.purposeP2}</p>
              <p style={{ fontWeight: 500 }}>{t.purposeP3}</p>
            </div>

            <p style={{ fontSize: "15px", marginBottom: "16px", fontWeight: 500 }}>
              {t.relevantDepts}
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "30px"
            }}>
              {DEPARTMENTS_CONFIG.map((dept) => {
                const isSelected = selectedDepts.includes(dept.id);
                return (
                  <div
                    key={dept.id}
                    onClick={() => handleDeptToggle(dept.id)}
                    style={{
                      border: isSelected ? "2px solid var(--accent)" : "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "16px",
                      background: isSelected ? "var(--accent-bg)" : "var(--bg)",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        style={{ cursor: "pointer" }}
                      />
                      <div style={{ fontWeight: 600, color: "var(--text-h)" }}>
                        {t[dept.id].name}
                      </div>
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text)", marginTop: "6px" }}>
                      {t.targetRespondent}: {t[dept.id].target}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button type="button" className="btn-secondary" onClick={handleBack}>
                {t.back}
              </button>
              <button type="button" className="btn-primary" onClick={handleNext}>
                {t.nextFillQuestionnaire}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Complete Questionnaires */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>{t.step3Title}</h2>

            {/* Tabs for selected departments */}
            <div style={{
              display: "flex",
              borderBottom: "1px solid var(--border)",
              marginBottom: "24px",
              overflowX: "auto",
              gap: "8px",
              paddingBottom: "1px"
            }}>
              {selectedDepts.map((deptId) => {
                const dept = DEPARTMENTS_CONFIG.find((d) => d.id === deptId);
                const isActive = activeDeptTab === deptId;
                const answersMap = questionAnswers[deptId] || {};
                const answeredCount = Object.keys(answersMap).filter((key) => !key.endsWith("_more") && answersMap[key] !== "").length;
                const totalCount = dept?.questions.length || 0;

                return (
                  <button
                    key={deptId}
                    type="button"
                    onClick={() => setActiveDeptTab(deptId)}
                    style={{
                      padding: "10px 16px",
                      border: "none",
                      background: isActive ? "var(--accent-bg)" : "none",
                      color: isActive ? "var(--accent)" : "var(--text)",
                      borderBottom: isActive ? "2px solid var(--accent)" : "none",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      borderRadius: "6px 6px 0 0"
                    }}
                  >
                    {t[deptId].name} ({answeredCount}/{totalCount})
                  </button>
                );
              })}
            </div>

            {/* Questions Form for Active Tab */}
            {activeDeptTab && (() => {
              const activeDept = DEPARTMENTS_CONFIG.find((d) => d.id === activeDeptTab);
              if (!activeDept) return null;

              return (
                <div style={{ animation: "fadeIn 0.2s ease" }}>
                  <div style={{
                    background: "var(--code-bg)",
                    padding: "16px",
                    borderRadius: "6px",
                    marginBottom: "24px"
                  }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--accent)" }}>
                      {t.targetRespondent}: {t[activeDeptTab].target}
                    </span>
                  </div>

                  {activeDept.questions.map((q, idx) => {
                    const ans = questionAnswers[activeDeptTab]?.[q.id] || "";
                    const followUp = questionAnswers[activeDeptTab]?.[`${q.id}_more`] || "";
                    const labels = activeDept.minLabels?.[q.id];

                    return (
                      <div key={q.id} style={{
                        marginBottom: "32px",
                        paddingBottom: "24px",
                        borderBottom: idx < activeDept.questions.length - 1 ? "1px solid var(--border)" : "none"
                      }}>
                        <div style={{ fontWeight: 600, color: "var(--text-h)", fontSize: "15px", marginBottom: "12px" }}>
                          Q{idx + 1}. {t[activeDeptTab][q.id]}
                        </div>

                        {/* RENDER SCALE 1-5 */}
                        {q.type === "scale" && (
                          <div>
                            {labels && (
                              <div style={{ display: "flex", justifyContent: "space-between", maxWidth: "400px", marginBottom: "8px", fontSize: "12px", color: "var(--text)" }}>
                                <span>1 ({labels.min})</span>
                                <span>5 ({labels.max})</span>
                              </div>
                            )}
                            <div style={{ display: "flex", gap: "16px" }}>
                              {[1, 2, 3, 4, 5].map((val) => (
                                <label key={val} style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  cursor: "pointer",
                                  padding: "8px 16px",
                                  borderRadius: "6px",
                                  border: ans == val ? "2px solid var(--accent)" : "1px solid var(--border)",
                                  background: ans == val ? "var(--accent-bg)" : "none",
                                  fontWeight: 600,
                                  width: "20px"
                                }}>
                                  <input
                                    type="radio"
                                    name={`${activeDeptTab}_${q.id}`}
                                    value={val}
                                    checked={ans == val}
                                    onChange={() => handleAnswerChange(activeDeptTab, q.id, val)}
                                    style={{ display: "none" }}
                                  />
                                  {val}
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* RENDER YES/NO WITH OPTIONAL FOLLOW UP */}
                        {q.type === "yesNo" && (
                          <div>
                            <div style={{ display: "flex", gap: "20px", marginBottom: "12px" }}>
                              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                                <input
                                  type="radio"
                                  name={`${activeDeptTab}_${q.id}`}
                                  value="Yes"
                                  checked={ans === "Yes"}
                                  onChange={() => handleAnswerChange(activeDeptTab, q.id, "Yes")}
                                />
                                Yes
                              </label>
                              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                                <input
                                  type="radio"
                                  name={`${activeDeptTab}_${q.id}`}
                                  value="No"
                                  checked={ans === "No"}
                                  onChange={() => handleAnswerChange(activeDeptTab, q.id, "No")}
                                />
                                No
                              </label>
                            </div>

                            {ans === "Yes" && (
                              <div style={{ display: "flex", gap: "8px", animation: "fadeIn 0.2s ease" }}>
                                <input
                                  type="text"
                                  className="form-input"
                                  style={{ flexGrow: 1 }}
                                  value={followUp}
                                  onChange={(e) => handleAnswerChange(activeDeptTab, q.id, e.target.value, true)}
                                  placeholder={q.followUpPlaceholder || "Provide details..."}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleMicClick(activeDeptTab, q.id, true)}
                                  style={{
                                    padding: "10px",
                                    borderRadius: "8px",
                                    border: "1px solid var(--border)",
                                    cursor: "pointer",
                                    background: listeningTarget?.deptId === activeDeptTab && listeningTarget?.qId === q.id && listeningTarget?.isFollowUp ? "red" : "var(--code-bg)"
                                  }}
                                >
                                  🎤
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* RENDER MULTI-SELECT CHECKBOXES */}
                        {q.type === "multiSelect" && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {q.options.map((opt) => {
                              const isChecked = Array.isArray(ans) && ans.includes(opt.value);
                              return (
                                <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                                  <input
                                    type="checkbox"
                                    value={opt.value}
                                    checked={isChecked}
                                    onChange={(e) => handleMultiSelectChange(activeDeptTab, q.id, opt.value, e.target.checked)}
                                  />
                                  <span>{opt.label}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}

                        {/* RENDER SINGLE-SELECT DROPDOWN */}
                        {q.type === "singleSelect" && (
                          <select
                            className="form-input"
                            style={{ appearance: "auto", width: "100%" }}
                            value={ans}
                            onChange={(e) => handleAnswerChange(activeDeptTab, q.id, e.target.value)}
                          >
                            <option value="">-- Choose Option --</option>
                            {q.options.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        )}

                        {/* RENDER TEXT/TEXTAREA RESPONSE */}
                        {q.type === "text" && (
                          <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
                            <textarea
                              className="form-input"
                              style={{ flexGrow: 1, height: "80px", fontFamily: "inherit" }}
                              value={ans}
                              onChange={(e) => handleAnswerChange(activeDeptTab, q.id, e.target.value)}
                              placeholder="Your answer..."
                            />
                            <button
                              type="button"
                              onClick={() => handleMicClick(activeDeptTab, q.id, false)}
                              style={{
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid var(--border)",
                                cursor: "pointer",
                                height: "46px",
                                background: listeningTarget?.deptId === activeDeptTab && listeningTarget?.qId === q.id && !listeningTarget?.isFollowUp ? "red" : "var(--code-bg)"
                              }}
                            >
                              🎤
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px", borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
              <button type="button" className="btn-secondary" onClick={handleBack} disabled={loading}>
                {t.back}
              </button>

              <button
                type="button"
                className="btn-primary"
                onClick={handleSubmit}
                disabled={loading}
                style={{ width: "auto", padding: "14px 28px" }}
              >
                {loading ? "Registering Account..." : t.submitRegister}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recording indicator overlay */}
      {isListening && (
        <div style={{
          position: "fixed",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "red",
          color: "white",
          padding: "12px 24px",
          borderRadius: "30px",
          fontSize: "14px",
          fontWeight: 700,
          boxShadow: "0 4px 12px rgba(255, 0, 0, 0.4)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          animation: "pulse 1.5s infinite"
        }}>
          <span style={{
            width: "8px",
            height: "8px",
            background: "white",
            borderRadius: "50%"
          }} />
          {t.listening}
        </div>
      )}
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.8; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.05); }
          100% { opacity: 0.8; transform: translateX(-50%) scale(1); }
        }
      `}</style>
    </div>
  );
}
