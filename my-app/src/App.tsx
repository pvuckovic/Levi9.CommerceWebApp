import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import NavigationBar from "./components/navigationBar";
import AddNewDocumentPage from "./components/document";
import ProductPage from "./components/productPage";
import Footer from "./footer";
import LoginClient from "./components/login/login";
import RegisterClient from "./components/register/register";
import DocumentList from "./components/documentList";
import Profile from "./components/profile/profile";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginClient />} />
        </Routes>

        <Routes>
          <Route path="/register" element={<RegisterClient />} />
        </Routes>
        {(window.location.pathname !== '/' && window.location.pathname !== '/register') && <NavigationBar />}
        <Routes>
          <Route path="/products" element={<ProductPage />} />
          <Route path="/documents" element={<AddNewDocumentPage documentType={""} clientId={0} items={[]} />} />
          <Route path="/documentList" element={<DocumentList />} />
          <Route path="/profile" element={<Profile clientId={1} />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
