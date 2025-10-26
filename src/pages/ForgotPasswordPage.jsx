import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../utils/firebase";
import { Link } from "react-router-dom";
import "../styles/Auth.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset link sent to your email.");
    } catch (err) {
      setError("Unable to send reset email. Check the address and try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Reset Password</h2>
        <p className="auth-subtitle">We’ll send you a reset link</p>

        <form onSubmit={handleReset} className="auth-form">
          <input
            type="email"
            placeholder="Email address"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="error-text">{error}</p>}
          {message && <p className="success-text">{message}</p>}
          <button type="submit" className="auth-btn">Send Link</button>
        </form>

        <div className="auth-links">
          <Link to="/login" className="auth-link">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}