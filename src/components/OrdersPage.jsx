/* eslint-disable react/prop-types */
// import CurrencyFormat from "react-currency-format";
import OrdersPageProps from "./OrdersPageProps";
import moment from "moment";
import "./OrdersPage.css";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
function OrdersPage({ order }) {
  const [status, setStatus] = useState("Pending");
  const changeStatus = async () => {
    const docRef = doc(db, "Orders", order.id);
    console.log("Order id: ", order.id);
    await updateDoc(docRef, {
      status: "Delivered",
    });
  };
  const getStatus = async () => {
    const docRef = doc(db, "Orders", order.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setStatus(docSnap.data().status);
    }
  };
  useEffect(() => {
    getStatus();
  });

  return (
    <div
      className="order"
      style={{
        overflowX: "hidden",
        marginTop: "40px",
        borderBottom: "1px solid lightgray",
      }}
    >
      <h3 className="order__total" style={{ marginLeft: "10px" }}>
        Order Total: ₹{order.data.totalAmount}
      </h3>
      <div className="order__details">
        <p>Order ID: {order.id}</p>
        <p>
          Order Placed at:{" "}
          {moment(order.data.created.toDate()).format(
            "ddd, DD MMM YYYY h:mm A"
          )}
        </p>
        <div className="order__status">
          <p>Status: {status}</p>
        </div>
      </div>
      <div>
        {status === "In Progress" ? (
          <button
            style={{
              marginTop: 0,
              marginBottom: "20px",
              backgroundColor: "#ba704f",
              color: "white",
              cursor: "pointer",
              borderRadius: "5px",
              border: "none",
              padding: "10px",
              fontSize: "15px",
            }}
            onClick={changeStatus}
          >
            Change status to &quot; Delivered &quot;
          </button>
        ) : (
          ""
        )}
      </div>
      {order.data.products?.map((item) => (
        <OrdersPageProps
          key={item.id}
          id={item.id}
          img1={item.img1}
          productName={item.productName}
          price={item.price}
          desc={item.desc}
          updatedCost={item.updatedPrice}
        />
      ))}
    </div>
  );
}

export default OrdersPage;
