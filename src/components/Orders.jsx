/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import OrdersPage from "./OrdersPage";
function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, "Orders"),

          orderBy("created", "desc")
        );
        onSnapshot(q, (snapshot) => {
          const orderData = snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }));

          setOrders(orderData);
        });
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchOrders();
    //eslint-disable-next-line
  }, []);

  return (
    <div>
      {orders.length === 0 ? (
        <h3>No Orders yet....</h3>
      ) : (
        orders.map((order) => <OrdersPage order={order} key={order.id} />)
      )}
    </div>
  );
}

export default Orders;
