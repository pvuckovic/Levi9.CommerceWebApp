import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import NavigationBar from "./components/navigationBar";
import Product from "./components/product/products"
import AddNewDocumentPage from "./components/document";

function App() {
  return (
    <div className="App">
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Product />} />
          <Route path="/products" element={<Product />} />
          <Route path="/documents" element={<AddNewDocumentPage documentType={""} clientId={0} items={[]} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
