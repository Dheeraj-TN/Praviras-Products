import "./App.css";
import InputProducts from "./components/InputProducts";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Orders from "./components/Orders";
import EditProducts from "./components/EditProducts";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/productsPage" element={<InputProducts />} />
          <Route exact path="/ordersPage" element={<Orders />} />
          <Route exact path="/editProductsPage" element={<EditProducts />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
