import { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import MessageBox from "../components/MessageBox";
import "../styles/WarehouseManage.css";

export default function WarehouseManage() {
  const [activeTab, setActiveTab] = useState("add");
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // form states
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  // fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchProducts();
  }, [loading]);

  // fetch recent history
  useEffect(() => {
    const fetchHistory = async () => {
      const q = query(
        collection(db, "warehouse_history"),
        orderBy("timestamp", "desc"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      setHistory(snapshot.docs.map((doc) => doc.data()));
    };
    fetchHistory();
  }, [loading]);

  // add new product
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !quantity || !price)
      return setMessage({ text: "Please fill all fields", type: "error" });

    setLoading(true);
    try {
      await addDoc(collection(db, "products"), {
        name,
        quantity: Number(quantity),
        price: Number(price),
        dateAdded: serverTimestamp(),
      });

      // log history
      await addDoc(collection(db, "warehouse_history"), {
        action: "Added New Product",
        productName: name,
        quantity: Number(quantity),
        timestamp: serverTimestamp(),
      });

      setMessage({ text: "✅ Product added successfully", type: "success" });
      setName("");
      setQuantity("");
      setPrice("");
    } catch (err) {
      console.error(err);
      setMessage({ text: "❌ Failed to add product", type: "error" });
    }
    setLoading(false);
  };

  // update stock
  const handleStockUpdate = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !quantity)
      return setMessage({ text: "Please fill all fields", type: "error" });

    const productRef = doc(db, "products", selectedProduct);
    const product = products.find((p) => p.id === selectedProduct);
    let newQty =
      activeTab === "increase"
        ? product.quantity + Number(quantity)
        : product.quantity - Number(quantity);
    if (newQty < 0) newQty = 0;

    setLoading(true);
    try {
      await updateDoc(productRef, { quantity: newQty });

      // log history
      await addDoc(collection(db, "warehouse_history"), {
        action:
          activeTab === "increase" ? "Increased Stock" : "Reduced Stock",
        productName: product.name,
        quantity: Number(quantity),
        timestamp: serverTimestamp(),
      });

      setMessage({
        text:
          activeTab === "increase"
            ? "✅ Stock increased"
            : "✅ Stock reduced",
        type: "success",
      });
      setQuantity("");
      setSelectedProduct("");
    } catch (err) {
      console.error(err);
      setMessage({ text: "❌ Update failed", type: "error" });
    }
    setLoading(false);
  };

  // edit price (without logging history)
  const handleEditPrice = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !price)
      return setMessage({ text: "Please select a product and enter a price", type: "error" });

    setLoading(true);
    try {
      const productRef = doc(db, "products", selectedProduct);
      await updateDoc(productRef, { price: Number(price) });

      setMessage({ text: "✅ Price updated successfully", type: "success" });
      setPrice("");
      setSelectedProduct("");
    } catch (err) {
      console.error(err);
      setMessage({ text: "❌ Price update failed", type: "error" });
    }
    setLoading(false);
  };

  return (
    <div className="warehouse-manage">
      {message && (
        <MessageBox
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}

      {/* Tabs */}
      <div className="manage-tabs">
        <button
          className={activeTab === "add" ? "active" : ""}
          onClick={() => setActiveTab("add")}
        >
          Add Product
        </button>
        <button
          className={activeTab === "increase" ? "active" : ""}
          onClick={() => setActiveTab("increase")}
        >
          Increase Stock
        </button>
        <button
          className={activeTab === "decrease" ? "active" : ""}
          onClick={() => setActiveTab("decrease")}
        >
          Reduce Stock
        </button>
        <button
          className={activeTab === "editPrice" ? "active" : ""}
          onClick={() => setActiveTab("editPrice")}
        >
          Edit Price
        </button>
      </div>

      {/* Form */}
      <div className="manage-card">
        {activeTab === "add" && (
          <form onSubmit={handleAdd}>
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
        )}

        {(activeTab === "increase" || activeTab === "decrease") && (
          <form onSubmit={handleStockUpdate}>
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
                ? "Updating..."
                : activeTab === "increase"
                ? "Increase Stock"
                : "Reduce Stock"}
            </button>
          </form>
        )}

        {activeTab === "editPrice" && (
          <form onSubmit={handleEditPrice}>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Current: {p.price})
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="New Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Price"}
            </button>
          </form>
        )}
      </div>

      {/* Recent History */}
      <div className="history-section">
        <h3>Recent Warehouse Changes</h3>
        <div className="history-list">
          {history.length > 0 ? (
            history.map((h, i) => (
              <div className="history-item" key={i}>
                <div>
                  <strong>{h.action}</strong>
                  <p>{h.productName}</p>
                </div>
                <span className="history-qty">Qty: {h.quantity}</span>
              </div>
            ))
          ) : (
            <p className="no-history">No recent actions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}