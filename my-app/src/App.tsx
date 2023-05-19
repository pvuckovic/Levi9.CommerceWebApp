import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import NavigationBar from "./components/navigationBar";
import DocumentPage from "./components/document";
import Product from "./components/product/products"

function App() {
  return (
    <div className="App">      
      <Router> 
      <NavigationBar /> 
        <Routes>
          <Route path="/" element={<Product/>} />
          <Route path="/products" element={<Product/>} />
          <Route path="/document" element={<DocumentPage/>} /> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;
