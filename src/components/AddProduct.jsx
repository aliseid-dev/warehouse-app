import { useState } from "react";
import { db } from "../utils/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "../styles/ManagePages.css";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !quantity || !price) return alert("Please fill all fields");

    setLoading(true);
    try {
      await addDoc(collection(db, "products"), {
        name,
        category: "Building Materials", // default category
        quantity: Number(quantity),
        price: Number(price),
        dateAdded: serverTimestamp(),
      });

      alert("✅ Product added successfully!");
      setName("");
      setQuantity("");
      setPrice("");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to add product.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
}