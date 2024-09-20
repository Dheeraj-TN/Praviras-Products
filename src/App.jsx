import "./App.css";
import InputProducts from "./components/InputProducts";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OrdersPage from "./components/OrdersPage";
import Home from "./components/Home";
import Orders from "./components/Orders";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/productsPage" element={<InputProducts />} />
          <Route exact path="/ordersPage" element={<Orders />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
