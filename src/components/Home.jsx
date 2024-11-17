import { useNavigate } from "react-router-dom";
import "./Home.css";
function Home() {
  const navigate = useNavigate();
  return (
    <div className="home">
      <button onClick={() => navigate("/productsPage")}>
        Input and Delete products Page
      </button>
      <button onClick={() => navigate("/ordersPage")}>Orders Page</button>
      <button onClick={() => navigate("/editProductsPage")}>
        Edit Product Details
      </button>
    </div>
  );
}

export default Home;
