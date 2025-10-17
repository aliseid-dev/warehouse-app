import { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, doc, updateDoc, getDocs } from "firebase/firestore";
import "../styles/UpdateStock.css";
import MessageBox from "../components/MessageBox";

export default function UpdateStock({ type }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProducts();
  }, [loading]); // refresh products after update

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !quantity) {
      return setMessage({ text: "Please fill all fields", type: "error" });
    }

    setLoading(true);
    const productRef = doc(db, "products", selectedProduct);
    const product = products.find(p => p.id === selectedProduct);

    try {
      let newQuantity =
        type === "increase"
          ? product.quantity + Number(quantity)
          : product.quantity - Number(quantity);

      if (newQuantity < 0) newQuantity = 0;

      await updateDoc(productRef, { quantity: newQuantity });

      setMessage({
        text: `✅ Stock ${type === "increase" ? "added" : "reduced"} successfully!`,
        type: "success",
      });
      setQuantity("");
      setSelectedProduct("");
    } catch (err) {
      console.error(err);
      setMessage({ text: "❌ Failed to update stock.", type: "error" });
    }

    setLoading(false);
  };

  return (
    <div className="update-stock-container">
      {/* Message Box */}
      {message && (
        <MessageBox
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}

      <h3>{type === "increase" ? "Increase Stock" : "Reduce Stock"}</h3>
      <form onSubmit={handleSubmit} className="update-stock-form">
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.quantity})
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading
            ? type === "increase"
              ? "Adding..."
              : "Reducing..."
            : type === "increase"
            ? "Add to Stock"
            : "Reduce Stock"}
        </button>
      </form>
    </div>
  );
}