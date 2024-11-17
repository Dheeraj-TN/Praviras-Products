import { db } from "../firebase";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { SearchOutlined } from "@ant-design/icons";
import "./EditProducts.css";
import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
function EditProducts() {
  const necklaceRef = collection(db, "Necklases");
  const earringRef = collection(db, "Earrings");
  const braceletRef = collection(db, "Bracelet");
  const clipsPinsRef = collection(db, "ClipsPins");
  const fingerRingsRef = collection(db, "FingerRings");
  const productRef = collection(db, "Products");
  const [products, setProducts] = useState([]);
  const [searchedProduct, setSearchedProduct] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const [changedProductName, setChangedProductName] = useState("");
  const [changedProductDesc, setChangedProductDesc] = useState("");
  const [changedProductPrice, setChangedProductPrice] = useState("");
  const [changedProductStatus, setChangedProductStatus] = useState("Available");
  const navigate = useNavigate();
  const handleSearch = (e) => {
    setSearchedProduct(e.target.value);
  };
  const handleStatusChange = (e) => {
    setChangedProductStatus(e.target.value);
  };
  const editSection = useRef(null);
  const onSearch = () => {
    if (
      searchedProduct.includes("Necklace".toLowerCase()) ||
      searchedProduct.includes("chain".toLowerCase()) ||
      searchedProduct.includes("pendent".toLowerCase()) ||
      searchedProduct.includes("layered".toLowerCase())
    ) {
      const q = query(necklaceRef);
      onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            productNameLowerCase: doc.data().productName.toLowerCase(),
          }))
          .filter((item) =>
            item.productNameLowerCase.includes(searchedProduct)
          );
        setProducts(data);
      });
    }
    if (
      searchedProduct.includes("Bracelet".toLowerCase()) ||
      searchedProduct.includes("Kada".toLowerCase()) ||
      searchedProduct.includes("Stainless Steel Bracelet".toLowerCase())
    ) {
      const q = query(braceletRef);
      onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            productNameLowerCase: doc.data().productName.toLowerCase(),
          }))
          .filter((item) =>
            item.productNameLowerCase.includes(searchedProduct)
          );
        setProducts(data);
      });
    }
    if (
      searchedProduct.includes("Hoops".toLowerCase()) ||
      searchedProduct.includes("Studs".toLowerCase()) ||
      searchedProduct.includes("Statement".toLowerCase()) ||
      searchedProduct.includes("Traditional".toLowerCase())
    ) {
      const q = query(earringRef);
      onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            productNameLowerCase: doc.data().productName.toLowerCase(),
          }))
          .filter((item) =>
            item.productNameLowerCase.includes(searchedProduct)
          );
        setProducts(data);
      });
    }
    if (
      searchedProduct.includes("Center".toLowerCase()) ||
      searchedProduct.includes("Handmade".toLowerCase()) ||
      searchedProduct.includes("Saree".toLowerCase()) ||
      searchedProduct.includes("Hair".toLowerCase())
    ) {
      const q = query(clipsPinsRef);
      onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            productNameLowerCase: doc.data().productName.toLowerCase(),
          }))
          .filter((item) =>
            item.productNameLowerCase.includes(searchedProduct)
          );
        setProducts(data);
      });
    }
    if (searchedProduct.includes("Finger".toLowerCase())) {
      const q = query(fingerRingsRef);
      onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            productNameLowerCase: doc.data().productName.toLowerCase(),
          }))
          .filter((item) =>
            item.productNameLowerCase.includes(searchedProduct)
          );
        setProducts(data);
      });
    }
  };
  const clickedProduct = (product) => {
    if (editSection.current) {
      editSection.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setSelectedProduct(true);
    setSelectedProductDetails(product);
    // console.log("selectedProductId: ", product.id);
  };
  const updateDetails = async () => {
    if (
      selectedProductDetails.productName
        .toLowerCase()
        .includes("Necklace".toLowerCase()) ||
      selectedProductDetails.productName
        .toLowerCase()
        .includes("chain".toLowerCase()) ||
      selectedProductDetails.productName
        .toLowerCase()
        .includes("pendent".toLowerCase()) ||
      selectedProductDetails.productName
        .toLowerCase()
        .includes("layered".toLowerCase())
    ) {
      const q = query(
        necklaceRef,
        where("uniqueId", "==", selectedProductDetails.id)
      );
      const doc = getDocs(q);

      await doc.then((snapshot) => {
        snapshot.forEach((doc) => {
          updateDoc(doc.ref, {
            productName:
              changedProductName !== ""
                ? changedProductName
                : selectedProductDetails.productName,
            completeDesc:
              changedProductDesc !== ""
                ? changedProductDesc
                : selectedProductDetails.completeDesc,
            status: changedProductStatus
              ? changedProductStatus
              : selectedProductDetails.status,
            price:
              changedProductPrice !== ""
                ? changedProductPrice
                : selectedProductDetails.price,
          });
        });
      });
    }
    if (
      selectedProductDetails.productName
        .toLowerCase()
        .includes("Bracelet".toLowerCase()) ||
      selectedProductDetails.productName
        .toLowerCase()
        .includes("Kada".toLowerCase()) ||
      selectedProductDetails.productName
        .toLowerCase()
        .includes("Stainless Steel Bracelet".toLowerCase())
    ) {
      const q = query(
        braceletRef,
        where("uniqueId", "==", selectedProductDetails.id)
      );
      const doc = getDocs(q);

      await doc.then((snapshot) => {
        snapshot.forEach((doc) => {
          updateDoc(doc.ref, {
            productName:
              changedProductName !== ""
                ? changedProductName
                : selectedProductDetails.productName,
            completeDesc:
              changedProductDesc !== ""
                ? changedProductDesc
                : selectedProductDetails.completeDesc,
            status: changedProductStatus
              ? changedProductStatus
              : selectedProductDetails.status,
            price:
              changedProductPrice !== ""
                ? changedProductPrice
                : selectedProductDetails.price,
          });
        });
      });
    }
    if (
      selectedProductDetails.productName
        .toLowerCase()
        .includes("Hoops".toLowerCase()) ||
      selectedProductDetails.productName
        .toLowerCase()
        .includes("Studs".toLowerCase()) ||
      selectedProductDetails.productName
        .toLowerCase()
        .includes("Statement".toLowerCase()) ||
      selectedProductDetails.productName
        .toLowerCase()
        .includes("Traditional".toLowerCase())
    ) {
      const q = query(
        earringRef,
        where("uniqueId", "==", selectedProductDetails.id)
      );
      const doc = getDocs(q);

      await doc.then((snapshot) => {
        snapshot.forEach((doc) => {
          updateDoc(doc.ref, {
            productName:
              changedProductName !== ""
                ? changedProductName
                : selectedProductDetails.productName,
            completeDesc:
              changedProductDesc !== ""
                ? changedProductDesc
                : selectedProductDetails.completeDesc,
            status: changedProductStatus
              ? changedProductStatus
              : selectedProductDetails.status,
            price:
              changedProductPrice !== ""
                ? changedProductPrice
                : selectedProductDetails.price,
          });
        });
      });
    }
    if (
      selectedProductDetails.productName
        .toLowerCase()
        .includes("Center".toLowerCase()) ||
      selectedProductDetails.productName
        .toLowerCase()
        .includes("Handmade".toLowerCase()) ||
      selectedProductDetails.productName
        .toLowerCase()
        .includes("Saree".toLowerCase()) ||
      selectedProductDetails.productName
        .toLowerCase()
        .includes("Hair".toLowerCase())
    ) {
      const q = query(
        clipsPinsRef,
        where("uniqueId", "==", selectedProductDetails.id)
      );
      const doc = getDocs(q);

      await doc.then((snapshot) => {
        snapshot.forEach((doc) => {
          updateDoc(doc.ref, {
            productName:
              changedProductName !== ""
                ? changedProductName
                : selectedProductDetails.productName,
            completeDesc:
              changedProductDesc !== ""
                ? changedProductDesc
                : selectedProductDetails.completeDesc,
            status: changedProductStatus
              ? changedProductStatus
              : selectedProductDetails.status,
            price:
              changedProductPrice !== ""
                ? changedProductPrice
                : selectedProductDetails.price,
          });
        });
      });
    }
    if (
      selectedProductDetails.productName
        .toLowerCase()
        .includes("Finger".toLowerCase())
    ) {
      const q = query(
        fingerRingsRef,
        where("uniqueId", "==", selectedProductDetails.id)
      );
      const doc = getDocs(q);

      await doc.then((snapshot) => {
        snapshot.forEach((doc) => {
          updateDoc(doc.ref, {
            productName:
              changedProductName !== ""
                ? changedProductName
                : selectedProductDetails.productName,
            completeDesc:
              changedProductDesc !== ""
                ? changedProductDesc
                : selectedProductDetails.completeDesc,
            status: changedProductStatus
              ? changedProductStatus
              : selectedProductDetails.status,
            price:
              changedProductPrice !== ""
                ? changedProductPrice
                : selectedProductDetails.price,
          });
        });
      });
    }
    const q2 = query(
      productRef,
      where("uniqueId", "==", selectedProductDetails.id)
    );
    const doc2 = getDocs(q2);
    await doc2.then((snapshot) => {
      snapshot.forEach((doc) => {
        updateDoc(doc.ref, {
          productName:
            changedProductName !== ""
              ? changedProductName
              : selectedProductDetails.productName,
          price:
            changedProductPrice !== ""
              ? changedProductPrice
              : selectedProductDetails.price,
        });
      });
    });
    toast.success("Product details updated successfully");
    setChangedProductName("");
    setChangedProductDesc("");
    setChangedProductPrice("");
    setChangedProductStatus("Available");
    setSelectedProductDetails(null);
    setSelectedProduct(false);
    // console.log("Product details updated successfully");
  };
  return (
    <div className="editProducts__page">
      <Toaster />
      <HomeOutlined className="home__icon" onClick={() => navigate("/")} />

      <h1>Edit Product Details</h1>
      <div className="editProducts__searchContainer">
        <input
          type="text"
          placeholder="Enter complete name...."
          value={searchedProduct}
          onChange={handleSearch}
        />
        <SearchOutlined
          className="editProducts__searchIcon"
          onClick={onSearch}
        />
      </div>
      <div className="editProducts__allProductOptions">
        <h2>Click on the product which you want to edit 👇</h2>
        {products ? (
          products.map((product, index) => {
            return (
              <div
                className="editProducts__product"
                key={index}
                onClick={() => clickedProduct(product)}
              >
                <img src={product.image[0]} alt="" />
                <div className="editProducts__product__details">
                  <h4>{product.productName}</h4>
                  <p>{product.completeDesc}</p>
                  <p>{product.status}</p>
                  <p>₹{product.price}</p>
                </div>
              </div>
            );
          })
        ) : (
          <h3>No products found....</h3>
        )}
      </div>
      {selectedProduct && (
        <div className="selected__product" id="editSection" ref={editSection}>
          <h2>Edit the details here 👇</h2>
          {selectedProductDetails && (
            <div
              key={selectedProductDetails.id}
              className="selectedProduct__product"
            >
              <img src={selectedProductDetails.image[0]} alt="" />
              <div className="selectedProduct__product__details">
                <p>
                  <b> Current productName:</b>
                  <span>{selectedProductDetails.productName}</span>
                </p>
                <input
                  type="text"
                  placeholder={selectedProductDetails.name}
                  value={changedProductName}
                  onChange={(e) => setChangedProductName(e.target.value)}
                />
                <p>
                  <b>Current Desc:</b> {selectedProductDetails.completeDesc}
                </p>
                <input
                  type="text"
                  placeholder=""
                  value={changedProductDesc}
                  onChange={(e) => setChangedProductDesc(e.target.value)}
                />
                <p>
                  <b>Current Status:</b> {selectedProductDetails.status}
                </p>
                <div className="edit__status__container">
                  <label>
                    <input
                      type="radio"
                      value="Available"
                      checked={changedProductStatus === "Available"}
                      onChange={handleStatusChange}
                    />
                    Available
                  </label>

                  <label>
                    <input
                      type="radio"
                      value="outOfStock"
                      checked={changedProductStatus === "outOfStock"}
                      onChange={handleStatusChange}
                    />
                    Out of Stock
                  </label>
                </div>
                <p>
                  <b>Current Price:</b> ₹{selectedProductDetails.price}
                </p>
                <input
                  type="text"
                  placeholder=""
                  value={changedProductPrice}
                  onChange={(e) => setChangedProductPrice(e.target.value)}
                />
                <button onClick={updateDetails}>Save Changes</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EditProducts;
