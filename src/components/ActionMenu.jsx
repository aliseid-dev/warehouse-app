import { useState, useRef, useEffect } from "react";
import "../styles/ActionMenu.css";

export default function ActionMenu({ sale, onMarkPaid, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="action-menu" ref={menuRef}>
      <button
        className="action-menu-button"
        onClick={() => setOpen((prev) => !prev)}
      >
        ⋮
      </button>

      {open && (
        <div className="action-menu-dropdown">
          <button
            onClick={() => {
              setOpen(false);
              onMarkPaid(); // just call parent handler
            }}
          >
            Mark as Paid
          </button>

          <button
            onClick={() => {
              onDelete(sale.id);
              setOpen(false);
            }}
          >
            Delete Sale
          </button>
        </div>
      )}
    </div>
  );
}