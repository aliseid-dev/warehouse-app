// src/components/StoreProducts.jsx
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
    <div className="store-products-list">
      <div className="product-table">
        <div className="product-row header">
          <div>Name</div>
          <div>Price</div>
          <div>Quantity</div>
        </div>

        {products.length > 0 ? (
          products.map((p) => (
            <div key={p.id} className="product-row">
              <div>{p.name}</div>
              <div>${p.price}</div>
              <div>{p.quantity}</div>
            </div>
          ))
        ) : (
          <p className="empty-text">No products in store yet.</p>
        )}
      </div>
    </div>
  );
};

export default StoreProducts;