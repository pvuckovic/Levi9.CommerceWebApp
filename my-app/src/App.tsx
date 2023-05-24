import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import NavigationBar from "./components/navigationBar";
import AddNewDocumentPage from "./components/document";
import ProductPage from "./components/productPage";
import Footer from "./footer";

function App() {
  return (
    <div className="App">
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<ProductPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/documents" element={<AddNewDocumentPage documentType={""} clientId={0} items={[]} />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
