import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/admin/Dashboard";
import Departments from "./pages/admin/Departments";
import Questions from "./pages/admin/Questions";
import UploadQuestionnaire from "./pages/admin/UploadQuestionnaire";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route
        path="/departments"
        element={<Departments />}
      />

      <Route
        path="/questions"
        element={<Questions />}
      />

      <Route
        path="/upload"
        element={<UploadQuestionnaire />}
      />
    </Routes>
  );
}

export default App;