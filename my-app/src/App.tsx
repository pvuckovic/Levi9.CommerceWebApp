import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import NavigationBar from "./components/navigationBar";
import Product from "./components/product/products"
import AddNewDocumentPage from "./components/document";
import LoginClient from "./components/login/login";
import Profile from "./components/profile/profile";


function App() {
  return (
    <div className="App">
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Product />} />
          <Route path="/products" element={<Product />} />
          <Route path="/documents" element={<AddNewDocumentPage documentType={""} clientId={0} items={[]} />} />
          <Route path="/login/login" element={<LoginClient/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
