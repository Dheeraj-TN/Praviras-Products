import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <button onClick={() => navigate("/productsPage")}>
        Input and Edit products Page
      </button>
      <button onClick={() => navigate("/ordersPage")}>Orders Page</button>
    </div>
  );
}

export default Home;
