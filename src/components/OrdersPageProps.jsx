/* eslint-disable react/prop-types */
import "./OrdersPageProps.css";
function OrdersPageProps({ id, img1, productName, updatedCost, desc }) {
  return (
    <div className="checkoutPage__props" key={id}>
      <div className="checkoutPage__props__image__container">
        <img src={img1} alt="" className="checkoutPage__props__img" />
      </div>
      <div className="checkoutPage__props__info">
        <h2 className="checkoutPage__props__productName">{productName}</h2>
        <p className="checkoutPage__props__desc">{desc}</p>
        <div className="checkpout__props__priceRating">
          <p>
            <small>₹</small>
            <strong>{updatedCost}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrdersPageProps;
