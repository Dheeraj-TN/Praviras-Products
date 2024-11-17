/* eslint-disable no-unused-vars */
import { useState } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import "./InputProducts.css";
import toast, { Toaster } from "react-hot-toast";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
function InputProducts() {
  const [imgFiles, setImgfiles] = useState([]);
  const [imgFileNames, setImgfileNames] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [videoFileName, setVideoFileName] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  // const [rating, setRating] = useState("");
  // const [desc, setDesc] = useState("");
  const [completeDesc, setCompleteDesc] = useState("");
  const [status, setStatus] = useState("");
  const [editStatus, setEditStatus] = useState("Available");
  const [editProductStatus, setEditProductStatus] = useState("");
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState("");
  const [deleteProductList, setDeleteProductList] = useState([]);
  const necklaceRef = collection(db, "Necklases");
  const earringRef = collection(db, "Earrings");
  const braceletRef = collection(db, "Bracelet");
  const clipsPinsRef = collection(db, "ClipsPins");
  const fingerRingsRef = collection(db, "FingerRings");
  const navigate = useNavigate();
  // const handleSelectChange = (e) => {
  //   setCategory(e.target.value);
  // };
  const handleCheckBoxChange = (e) => {
    const { value, checked } = event.target;

    setCategory((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };
  // console.log("The categories to be inserted: ", category);

  const handleStatusChange = (e) => {
    setEditStatus(e.target.value);
  };
  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    setImgfiles((prevImages) => [...prevImages, ...selectedImages]);
    const imageNames = selectedImages.map((image) => image.name);
    setImgfileNames((prevFileNames) => [...prevFileNames, ...imageNames]);
  };
  const handleVideoChange = (e) => {
    const selectedVideo = e.target.files[0];
    setVideoFile(selectedVideo);
    setVideoFileName(selectedVideo.name);
  };
  const handleDeleteProduct = async () => {
    if (!deleteProduct) return;
    console.log("delete is clicked");
    console.log("product name: ", deleteProduct);
    if (
      deleteProduct.includes("Necklace".toLowerCase()) ||
      deleteProduct.includes("Chain".toLowerCase())
    ) {
      const q = query(necklaceRef);
      const splitProductName = deleteProduct.split(" ")[0];
      onSnapshot(q, (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((item) => item.productName.includes(splitProductName));
        setDeleteProductList(data);
      });
      return;
    }
    if (deleteProduct.includes("Earring".toLowerCase())) {
      const q = query(earringRef);
      const splitProductName = deleteProduct.split(" ")[0];
      onSnapshot(q, (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((item) => item.productName.includes(splitProductName));
        setDeleteProductList(data);
      });
      return;
    }

    if (deleteProduct.includes("Bracelet".toLowerCase())) {
      const q = query(braceletRef);
      const splitProductName = deleteProduct.split(" ")[0];
      onSnapshot(q, (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((item) => item.productName.includes(splitProductName));
        setDeleteProductList(data);
      });
      return;
    }
    if (
      deleteProduct.includes(
        "Clips" ||
          "Center" ||
          "Handmade" ||
          "Saree" ||
          "Hair" ||
          "Pins".toLowerCase()
      )
    ) {
      const q = query(clipsPinsRef);
      const splitProductName = deleteProduct.split(" ")[0];
      onSnapshot(q, (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((item) => item.productName.includes(splitProductName));
        setDeleteProductList(data);
      });
      return;
    }
    setDeleteProduct("");
  };
  const handleProductStatus = async () => {
    console.log(
      "the status is set to: ",
      editStatus,
      " and the product name is: ",
      editProductStatus
    );
    if (!editStatus) {
      toast.error("Fill the product name");
      return;
    }
    if (!editProductStatus) {
      toast.error("Select the status");
      return;
    }
    if (
      editProductStatus.toLowerCase().includes("Neckalce") ||
      editProductStatus.toLowerCase().includes("Chain")
    ) {
      const q = query(
        necklaceRef,
        where("productName", "==", editProductStatus)
      );
      const data = getDocs(q);
      await data.then((snapshot) => {
        snapshot.forEach((doc) => {
          updateDoc(doc.ref, {
            status: editStatus,
          });
        });
      });
      toast.success("Status was updated");
      setEditProductStatus("");
      return;
    }
    if (editProductStatus.toLowerCase().includes("Bracelet")) {
      console.log("product name: ", editProductStatus);
      const q = query(
        braceletRef,
        where("productName", "==", editProductStatus)
      );
      const data = getDocs(q);
      await data.then((snapshot) => {
        console.log("reached update");
        snapshot.forEach((doc) => {
          updateDoc(doc.ref, {
            status: editStatus,
          });
          console.log("done with");
        });
      });
      toast.success("Status was updated");
      setEditProductStatus("");
      return;
    }
  };
  const upload = async (e) => {
    e.preventDefault();
    if (!productName || !price || !status || !completeDesc || !category) {
      toast.error("Fill all the fields");
      return;
    }
    if (imgFiles.length === 0) {
      toast.error("Select atleast one image");
      return;
    }
    if (category.length === 0) {
      toast.error("Select atleast one category");
      return;
    }
    const uniqueId = uuidv4();
    setLoading(true);

    const toastId = toast.loading("Uploading....");

    const imageURLs = [];
    let videoDownloadURL = "";
    try {
      if (videoFile) {
        const storageRef = ref(storage, `${category}/${videoFile.name}`);
        await uploadBytes(storageRef, videoFile);
        videoDownloadURL = await getDownloadURL(storageRef);
      }
      for (const image of imgFiles) {
        const storageRef = ref(storage, `${category}/${image.name}`);
        await uploadBytes(storageRef, image);
        const downloadURL = await getDownloadURL(storageRef);
        imageURLs.push(downloadURL);
      }

      for (const productCategory of category) {
        await setDoc(doc(db, productCategory, uniqueId), {
          image: imageURLs,
          video: videoDownloadURL,
          productName: productName,
          price: price,
          // rating: rating,
          // desc: desc,
          completeDesc: completeDesc,
          status: status,
          category: productCategory,
          uniqueId: uniqueId,
          timestamp: new Date(),
        });

        await setDoc(doc(db, "Products", uniqueId), {
          productType: productCategory,
          productName: productName,
          price: price,
          uniqueId: uniqueId,
          timestamp: new Date(),
        });
      }
      toast.dismiss(toastId);
      setImgfiles([]);
      setImgfileNames([]);
      setVideoFile(null);
      setVideoFileName("");
      setProductName("");
      setPrice("");
      setStatus("");
      setCompleteDesc("");
      setCategory([]);
      setVideoFileName("");
      setImgfileNames("");
      toast.success("Uploaded successfully");
    } catch (error) {
      console.log("Error: ", error);
      toast.dismiss(toastId);
      setLoading(false);
      toast.error("Error in uploading");
    }
  };
  const deleteItem = (id) => {
    if (
      deleteProduct.includes("Bracelet".toLowerCase()) ||
      deleteProduct.includes("Kada".toLowerCase()) ||
      deleteProduct.includes("Stainless Steel Bracelet".toLowerCase())
    ) {
      const q = query(braceletRef, where("uniqueId", "==", id));
      const data = getDocs(q);
      data.then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.ref);
          deleteDoc(doc.ref);
          toast.success("Product Deleted successfully");
          console.log("Product deleted from db");
        });
      });
    }
    if (
      deleteProduct.includes("Necklace".toLowerCase()) ||
      deleteProduct.includes("chain".toLowerCase()) ||
      deleteProduct.includes("pendant".toLowerCase()) ||
      deleteProduct.includes("layered".toLowerCase())
    ) {
      const q = query(necklaceRef, where("uniqueId", "==", id));
      const data = getDocs(q);
      data.then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.ref);
          deleteDoc(doc.ref);
          toast.success("Product Deleted successfully");
          console.log("Product deleted from db");
        });
      });
    }
    if (
      deleteProduct.includes("Hoops".toLowerCase()) ||
      deleteProduct.includes("Studs".toLowerCase()) ||
      deleteProduct.includes("Statement".toLowerCase()) ||
      deleteProduct.includes("Traditional".toLowerCase())
    ) {
      const q = query(earringRef, where("uniqueId", "==", id));
      const data = getDocs(q);
      data.then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.ref);
          deleteDoc(doc.ref);
          toast.success("Product Deleted successfully");
          console.log("Product deleted from db");
        });
      });
    }
    if (
      deleteProduct.includes("Center".toLowerCase()) ||
      deleteProduct.includes("Handmade".toLowerCase()) ||
      deleteProduct.includes("Saree".toLowerCase()) ||
      deleteProduct.includes("Hair".toLowerCase())
    ) {
      const q = query(clipsPinsRef, where("uniqueId", "==", id));
      const data = getDocs(q);
      data.then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.ref);
          deleteDoc(doc.ref);
          toast.success("Product Deleted successfully");
          console.log("Product deleted from db");
        });
      });
    }
    if (deleteProduct.includes("Finger".toLowerCase())) {
      const q = query(fingerRingsRef, where("uniqueId", "==", id));
      const data = getDocs(q);
      data.then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.ref);
          deleteDoc(doc.ref);
          toast.success("Product Deleted successfully");
          console.log("Product deleted from db");
        });
      });
    }
    const q2 = query(collection(db, "Products"), where("uniqueId", "==", id));
    const data2 = getDocs(q2);
    data2.then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc.ref);
        deleteDoc(doc.ref);
        toast.success("Product Deleted successfully");
        console.log("Product deleted from product db");
      });
    });
  };
  return (
    <>
      <div className="input__products">
        <Toaster />
        <HomeOutlined className="home__icon" onClick={() => navigate("/")} />
        <h3>Enter the product details to be uploaded </h3>
        <form>
          <p>Product name:</p>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="enter product name"
          />
          <p>Enter Price:</p>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="enter price"
          />
          {/* <p>Enter rating</p>
          <input
            type="text"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="enter rating"
          /> */}
          {/* <p>Enter one line description</p>
          <input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="enter one line desc"
          /> */}
          <p>Enter complete description</p>
          <textarea
            placeholder="Enter the complete description"
            value={completeDesc}
            onChange={(e) => setCompleteDesc(e.target.value)}
            rows={5}
          />
          <p>Select the category</p>

          <div className="product-categories">
            <label>
              <input
                type="checkbox"
                value="NewArrivals"
                onChange={handleCheckBoxChange}
              />
              NewArrivals
            </label>
            <label>
              <input
                type="checkbox"
                value="Necklases"
                onChange={handleCheckBoxChange}
              />
              Necklaces
            </label>
            <label>
              <input
                type="checkbox"
                value="Earrings"
                onChange={handleCheckBoxChange}
              />
              Earrings
            </label>
            <label>
              <input
                type="checkbox"
                value="Bracelet"
                onChange={handleCheckBoxChange}
              />
              Bracelets
            </label>
            <label>
              <input
                type="checkbox"
                value="ClipsPins"
                onChange={handleCheckBoxChange}
              />
              ClipsPins
            </label>
            <label>
              <input
                type="checkbox"
                value="FingerRings"
                onChange={handleCheckBoxChange}
              />
              FingerRings
            </label>
          </div>
          <p>Status of the stock</p>
          <select onChange={(e) => setStatus(e.target.value)}>
            <option value="Available">Available</option>
            <option value="outOfStock">Out of Stock</option>
            <option value="NewArrival">New Arrival</option>
          </select>
          <p>Place the images</p>
          <input type="file" multiple onChange={handleImageChange} />
          <p>Place the video</p>
          <input type="file" onChange={handleVideoChange} />

          {/* <button onClick={uploadData}>Upload</button> */}
        </form>
        {/* review of what all was enetered */}
        <div className="entered__details">
          <h3>Verify the Entered Details</h3>
          <p>
            <strong>Product Name:</strong> {productName}
          </p>
          <p>
            <strong>Price: </strong>
            {price}
          </p>
          <p>
            <strong>Status:</strong>
            {status}
          </p>
          <p>
            <strong>Complete Desc:</strong> {completeDesc}
          </p>
          <p>
            <strong>Category:</strong> {category.join(", ")}
          </p>
          <div className="file__names">
            <p>
              <strong>Selected File Names:</strong>
            </p>
            <ul>
              {imgFileNames &&
                imgFileNames.map((fileName, index) => (
                  <li key={index}>{fileName}</li>
                ))}
            </ul>
            <ul style={{ listStyle: "none" }}>
              <li style={{ listStyle: "none" }}>{videoFileName}</li>
            </ul>
          </div>
          <div className="image__preview" style={{ border: "1px solid black" }}>
            {imgFiles &&
              imgFiles.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Image ${index}`}
                  className="preview__image"
                  style={{ width: "100px", height: "100px" }}
                />
              ))}
            <video>
              <source src={videoFile} type="video/mp4" />
            </video>
          </div>
        </div>
        <button onClick={upload} disabled={loading} className="upload__button">
          Upload
        </button>
      </div>
      {/* delete any product */}
      <div className="delete__product">
        <h3>Delete product</h3>
        <p>Enter the complete product name to delete: </p>
        <div className="delete__product__container">
          <input
            type="text"
            onChange={(e) => setDeleteProduct(e.target.value)}
            value={deleteProduct}
          ></input>
          <button onClick={handleDeleteProduct}>Search Product</button>
        </div>
        <div className="delete__products__container__list">
          {deleteProductList && (
            <div className="delete__products__list">
              {deleteProductList.map((item) => (
                <div key={item.id} className="single__delete__product">
                  <img
                    src={item.image[0]}
                    alt=""
                    style={{ width: "120px", height: "120px" }}
                  />
                  <div className="delete__product__details">
                    <p>Product name: {item.productName}</p>
                    <p>Price: {item.price}</p>
                    <p>Product ID: {item.id}</p>
                  </div>
                  <button
                    onClick={() => {
                      console.log(
                        "The item that has to be deleted is : ",
                        item.id
                      ),
                        deleteItem(item.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* edit status */}
      {/* <div className="edit__product__status">
        <h3>Edit the product status</h3>

        <div className="edit__product__status__container">
          <div className="edit__product__productName">
            <p>Enter the product name to edit the status: </p>
            <input
              type="text"
              onChange={(e) => setEditProductStatus(e.target.value)}
              value={editProductStatus}
            ></input>
          </div>
          <p>Set the status: </p>
          <div className="edit__status__container">
            <label>
              <input
                type="radio"
                value="Available"
                checked={editStatus === "Available"}
                onChange={handleStatusChange}
              />
              Available
            </label>

            <label>
              <input
                type="radio"
                value="outOfStock"
                checked={editStatus === "outOfStock"}
                onChange={handleStatusChange}
              />
              Out of Stock
            </label>
          </div>
          <button onClick={handleProductStatus}>Edit Status</button>
        </div>
      </div> */}
    </>
  );
}

export default InputProducts;
