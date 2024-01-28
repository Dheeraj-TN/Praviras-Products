import { useState } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import "./InputProducts.css";
import toast, { Toaster } from "react-hot-toast";
function InputProducts() {
  const [imgFiles, setImgfiles] = useState([]);
  const [imgFileNames, setImgfileNames] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [videoFileName, setVideoFileName] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
  const [desc, setDesc] = useState("");
  const [completeDesc, setCompleteDesc] = useState("");
  const [status, setStatus] = useState("");
  const [editStatus, setEditStatus] = useState("Available");
  const [editProductStatus, setEditProductStatus] = useState("");
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState("");
  const necklaceRef = collection(db, "Necklases");
  const earringRef = collection(db, "Earrings");
  const braceletRef = collection(db, "Bracelet");
  const ringRef = collection(db, "Ring");
  const handleSelectChange = (e) => {
    setCategory(e.target.value);
  };
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
    if (deleteProduct.includes("Necklace") || deleteProduct.includes("Chain")) {
      const q = query(necklaceRef, where("productName", "==", deleteProduct));
      const data = getDocs(q);
      //console.log("data: ", data);
      await data.then((snapshot) => {
        snapshot.forEach((doc) => {
          deleteDoc(doc.ref);
          toast.success("Product Deleted successfully");
          console.log("Product deleted from db");
        });
      });
      return;
    }
    if (deleteProduct.includes("Earrings")) {
      const q = query(earringRef, where("productName", "==", deleteProduct));
      const data = getDocs(q);
      //console.log("data: ", data);
      await data.then((snapshot) => {
        snapshot.forEach((doc) => {
          deleteDoc(doc.ref);
          toast.success("Product Deleted successfully");
          console.log("Product deleted from db");
        });
      });
      return;
    }
    if (deleteProduct.includes("Bracelet")) {
      const q = query(braceletRef, where("productName", "==", deleteProduct));
      const data = getDocs(q);
      //console.log("data: ", data);
      await data.then((snapshot) => {
        snapshot.forEach((doc) => {
          deleteDoc(doc.ref);
          toast.success("Product Deleted successfully");
          console.log("Product deleted from db");
        });
      });
      return;
    }
    if (deleteProduct.includes("Ring")) {
      const q = query(ringRef, where("productName", "==", deleteProduct));
      const data = getDocs(q);
      //console.log("data: ", data);
      await data.then((snapshot) => {
        snapshot.forEach((doc) => {
          deleteDoc(doc.ref);
          toast.success("Product Deleted successfully");
          console.log("Product deleted from db");
        });
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
    const uniqueId = uuidv4();
    console.log("Unique id: ", uniqueId);
    const imageURLs = [];
    let videoDownloadURL = "";
    // get the url of video
    setLoading(true);
    if (loading) {
      toast.loading("Hold on ...");
    }
    // toast.loading("Hold on...");
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
    setLoading(false);
    if (imageURLs.length === imgFiles.length) {
      setLoading(true);
      if (loading) {
        toast.loading("Alomst done...");
      }
      await setDoc(doc(db, category, uniqueId), {
        image: imageURLs,
        video: videoDownloadURL,
        productName: productName,
        price: price,
        rating: rating,
        desc: desc,
        completeDesc: completeDesc,
        status: status,
        category: category,
        uniqueId: uniqueId,
      });
      await setDoc(doc(db, "Products", uniqueId), {
        productType: category,
      });
      setLoading(false);
      toast.success("Uploaded successfully");
      setImgfiles([]);
      setImgfileNames([]);
      setVideoFile(null);
      setVideoFileName("");
      setProductName("");
      setPrice("");
      setRating("");
      setDesc("");
      setStatus("");
      setCompleteDesc("");
      setCategory([]);
      setVideoFileName("");
      setImgfileNames("");
    }
  };
  return (
    <>
      <div className="input__products">
        <Toaster />
        <h2>Enter the product details to be uploaded </h2>
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
          <p>Enter rating</p>
          <input
            type="text"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="enter rating"
          />
          <p>Enter one line description</p>
          <input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="enter one line desc"
          />
          <p>Enter complete description</p>
          <textarea
            placeholder="Enter the complete description"
            value={completeDesc}
            onChange={(e) => setCompleteDesc(e.target.value)}
            rows={5}
          />
          <p>Select the category</p>
          <select multiple value={category} onChange={handleSelectChange}>
            <option value="NewArrivals">NewArrivals</option>
            <option value="Necklases">Necklases</option>
            <option value="Earrings">Earrings</option>
            <option value="Bracelet">Bracelet</option>
            <option value="Ring">Ring</option>
          </select>
          <p>Status of the stock</p>
          <input
            type="text"
            placeholder="Available / outOfStock"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          <p>Place the images</p>
          <input type="file" multiple onChange={handleImageChange} />
          <p>Place the video</p>
          <input type="file" onChange={handleVideoChange} />
          <button onClick={upload}>Upload Files</button>
          {/* <button onClick={uploadData}>Upload</button> */}
        </form>

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
            <strong>Rating:</strong> {rating}
          </p>
          <p>
            <strong>Desc:</strong> {desc}
          </p>
          <p>
            <strong>Status:</strong>
            {status}
          </p>
          <p>
            <strong>Complete Desc:</strong> {completeDesc}
          </p>
          <p>
            <strong>Category:</strong> {category}
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
            <ul>
              <li>{videoFileName}</li>
            </ul>
          </div>
          <div className="image__preview">
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
      </div>
      {/* delete any product */}
      <div className="delete__product">
        <h2>Delete the product</h2>
        <p>Enter the product name to delete: </p>
        <div className="delete__product__container">
          <input
            type="text"
            onChange={(e) => setDeleteProduct(e.target.value)}
            value={deleteProduct}
          ></input>
          <button onClick={handleDeleteProduct}>Delete Product</button>
        </div>
      </div>
      <div className="edit__product__status">
        <h2>Edit the product status</h2>

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
      </div>
    </>
  );
}

export default InputProducts;
