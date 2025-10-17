// src/components/TransferStock.jsx
import { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import MessageBox from "./MessageBox";
import "../styles/TransferStock.css";

export default function TransferStock() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [recentTransfers, setRecentTransfers] = useState([]);

  // Fetch warehouse products for dropdown
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
    });
    return () => unsubscribe();
  }, []);

  // Fetch recent transfer history
  useEffect(() => {
    const q = query(
      collection(db, "transfer_history"),
      orderBy("timestamp", "desc"),
      limit(5)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRecentTransfers(snapshot.docs.map((doc) => doc.data()));
    });
    return () => unsubscribe();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    const qty = Number(quantity);
    if (!selectedProduct || isNaN(qty) || qty <= 0) {
      setMessage({ type: "error", text: "Please select a product and enter a valid quantity" });
      return;
    }

    setLoading(true);

    try {
      // Get warehouse product
      const productRef = doc(db, "products", selectedProduct);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        setMessage({ type: "error", text: "Product not found in warehouse" });
        setLoading(false);
        return;
      }

      const product = productSnap.data();

      if (qty > product.quantity) {
        setMessage({ type: "error", text: "Not enough stock in warehouse" });
        setLoading(false);
        return;
      }

      // Decrease warehouse stock
      await updateDoc(productRef, { quantity: product.quantity - qty });

      // Add or update in storeProducts
      const storeRef = doc(db, "storeProducts", selectedProduct);
      const storeSnap = await getDoc(storeRef);
      const storeQuantity = storeSnap.exists() ? storeSnap.data().quantity : 0;

      await setDoc(
        storeRef,
        {
          name: product.name,
          price: product.price ?? 0,
          quantity: storeQuantity + qty,
          transferredAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Log transfer history
      await setDoc(doc(collection(db, "transfer_history")), {
        productId: selectedProduct,
        productName: product.name,
        quantity: qty,
        timestamp: serverTimestamp(),
      });

      setMessage({ type: "success", text: "✅ Stock transferred successfully!" });
      setSelectedProduct("");
      setQuantity("");
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "❌ Transfer failed" });
    }

    setLoading(false);
  };

  return (
    <div className="transfer-stock-page">
      {message && <MessageBox message={message.text} type={message.type} onClose={() => setMessage(null)} />}

      <form className="transfer-form" onSubmit={handleTransfer}>
        <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
          <option value="">Select Warehouse Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.quantity})
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity to transfer"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Transferring..." : "Transfer Stock"}
        </button>
      </form>

      {/* Recent Transfers */}
      <div className="recent-transfers">
        <h3>Recent Transfers</h3>
        {recentTransfers.length > 0 ? (
          recentTransfers.map((t, i) => (
            <div className="transfer-item" key={i}>
              <div>
                <strong>{t.productName}</strong> - Qty: {t.quantity}
              </div>
              <span>{t.timestamp?.toDate ? t.timestamp.toDate().toLocaleString() : new Date().toLocaleString()}</span>
            </div>
          ))
        ) : (
          <p>No recent transfers</p>
        )}
      </div>
    </div>
  );
}