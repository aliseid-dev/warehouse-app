// src/pages/ProductList.jsx
import { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import "../styles/ProductList.css";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(items);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="product-table-container">
      {products.length > 0 ? (
        <table className="sales-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>${p.price}</td>
                <td>{p.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
}