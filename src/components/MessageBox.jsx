import React, { useEffect } from "react";
import "../styles/MessageBox.css";

export default function MessageBox({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // auto close after 3 seconds

    return () => clearTimeout(timer); // cleanup if unmounted
  }, [onClose]);

  return (
    <div className={`message-box ${type}`}>
      <span className="message-text">{message}</span>
      <button className="close-btn" onClick={onClose}>
        &times;
      </button>
    </div>
  );
}