import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import DocumentPage from "./components/document";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/document" element={<DocumentPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
