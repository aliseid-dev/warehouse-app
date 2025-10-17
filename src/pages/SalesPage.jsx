// src/pages/SalesPage.jsx
import { useState, useEffect, useRef } from "react";
import { db } from "../utils/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";
import Header from "../components/Header";
import MessageBox from "../components/MessageBox";
import "../styles/SalesPage.css";

export default function SalesPage() {
  // --- States ---
  const [source, setSource] = useState("store");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [total, setTotal] = useState(0);
  const [totalManuallyEdited, setTotalManuallyEdited] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [contact, setContact] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("paid");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [sales, setSales] = useState([]);

  const messageRef = useRef(null);

  // --- Fetch Products ---
  useEffect(() => {
    const colName = source === "store" ? "storeProducts" : "products";
    const unsubscribe = onSnapshot(collection(db, colName), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
    });
    return () => unsubscribe();
  }, [source]);

  // --- Auto-calculate Total ---
  useEffect(() => {
    if (!totalManuallyEdited) {
      const prod = products.find((p) => p.id === selectedProduct);
      const qty = Number(quantity) || 0;
      const unitPrice = Number(price) || (prod ? Number(prod.price) || 0 : 0);
      setTotal(qty * unitPrice);
    }
  }, [selectedProduct, quantity, price, products, totalManuallyEdited]);

  // --- Fetch Sales ---
  useEffect(() => {
    const q = query(collection(db, "sales"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSales(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // --- Scroll message into view ---
  useEffect(() => {
    if (message && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [message]);

  // --- Add Sale ---
  const handleAddSale = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !quantity || !customerName || total === 0) {
      setMessage({ type: "error", text: "Please fill all required fields" });
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "sales"), {
        source,
        productId: selectedProduct,
        productName: products.find((p) => p.id === selectedProduct)?.name || "",
        quantity: Number(quantity),
        price: Number(price) || products.find(p => p.id === selectedProduct)?.price || 0,
        total: Number(total),
        customerName,
        contact: contact || "",
        paymentStatus,
        timestamp: new Date(),
      });

      setMessage({ type: "success", text: "✅ Sale recorded successfully" });

      setSelectedProduct("");
      setQuantity("");
      setPrice("");
      setTotal(0);
      setCustomerName("");
      setContact("");
      setPaymentStatus("paid");
      setTotalManuallyEdited(false);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "❌ Failed to record sale" });
    }
    setLoading(false);
  };

  // --- Mark Sale Paid ---
  const handleMarkPaid = async (saleId) => {
    try {
      await updateDoc(doc(db, "sales", saleId), { paymentStatus: "paid" });
      setMessage({ type: "success", text: "✅ Sale marked as paid" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "❌ Failed to mark as paid" });
    }
  };

  const unpaidSales = sales.filter((s) => s.paymentStatus === "credit");

  return (
    <>
      {/* Header separated at top */}
      <div className="sales-header-wrapper">
        <Header title="Sales" />
      </div>

      {/* Main content below header */}
      <div className="sales-page-container">
        <div className="sales-page-content">
          {/* Sale Form */}
          <div className="sales-form-container">
            <h2>Record a Sale</h2>
            <form onSubmit={handleAddSale} className="sales-form">
              {/* Source */}
              <label>
                Source
                <select value={source} onChange={(e) => setSource(e.target.value)}>
                  <option value="store">Store</option>
                  <option value="warehouse">Warehouse</option>
                </select>
              </label>

              {/* Product */}
              <label>
                Product
                <select
                  value={selectedProduct}
                  onChange={(e) => {
                    setSelectedProduct(e.target.value);
                    setTotalManuallyEdited(false);
                    setPrice("");
                  }}
                >
                  <option value="">Select Product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.quantity})
                    </option>
                  ))}
                </select>
              </label>

              {/* Quantity */}
              <label>
                Quantity
                <input
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  min="1"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </label>

              {/* Price */}
              <label>
                Price per Unit (Can override default)
                <input
                  type="number"
                  placeholder="Price"
                  value={price}
                  min="0"
                  onChange={(e) => {
                    setPrice(e.target.value);
                    setTotalManuallyEdited(false);
                  }}
                />
              </label>

              {/* Total */}
              <label>
                Total
                <input type="number" value={total} readOnly />
              </label>

              {/* Customer Name */}
              <label>
                Customer Name
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </label>

              {/* Contact Info */}
              <label>
                Contact Info (Optional)
                <input
                  type="text"
                  placeholder="Contact Info"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </label>

              {/* Payment Status */}
              <label>
                Payment Status
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                >
                  <option value="paid">Paid</option>
                  <option value="credit">Credit</option>
                </select>
              </label>

              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Record Sale"}
              </button>
            </form>
          </div>

          {/* Message Box */}
          {message && (
            <div ref={messageRef}>
              <MessageBox
                message={message.text}
                type={message.type}
                onClose={() => setMessage(null)}
              />
            </div>
          )}

          {/* Unpaid Sales */}
          <div className="sales-table-container">
            <h3>Unpaid Sales</h3>
            {unpaidSales.length > 0 ? (
              <table className="sales-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {unpaidSales.map((s) => (
                    <tr key={s.id}>
                      <td>{s.customerName}</td>
                      <td>{s.productName}</td>
                      <td>{s.quantity}</td>
                      <td>${s.total}</td>
                      <td>
                        <button onClick={() => handleMarkPaid(s.id)}>
                          Mark as Paid
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No unpaid sales</p>
            )}
          </div>

          {/* All Sales */}
          <div className="sales-table-container">
            <h3>All Sales</h3>
            {sales.length > 0 ? (
              <table className="sales-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((s) => (
                    <tr key={s.id}>
                      <td>{new Date(s.timestamp.seconds * 1000).toLocaleString()}</td>
                      <td>{s.customerName}</td>
                      <td>{s.quantity}</td>
                      <td>${s.price}</td>
                      <td>${s.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No sales recorded yet</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}