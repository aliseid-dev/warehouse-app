import React, { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import "../styles/StoreProducts.css";

const StoreProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "storeProducts"), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(items);
    });
    return () => unsub();
  }, []);

  return (
    <div className="store-products-container">
      <h2>Store Products</h2>
      {products.length > 0 ? (
        <div className="table-wrapper">
          <table className="store-products-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price ($)</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.price}</td>
                  <td>{p.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="empty-text">No products in store yet.</p>
      )}
    </div>
  );
};

export default StoreProducts;