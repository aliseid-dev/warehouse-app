import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [timer, setTimer] = useState(30); // 30 seconds cooldown
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await sendEmailVerification(user);
      setVerificationSent(true);
      setCanResend(false);
      setTimer(30); // start timer
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResendVerification = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        setCanResend(false);
        setTimer(30); // reset timer
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Timer countdown effect
  useEffect(() => {
    let interval;
    if (verificationSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else if (timer === 0 && verificationSent) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [verificationSent, timer]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        {!verificationSent ? (
          <>
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">Set up your Flash Stock login</p>
            <form onSubmit={handleSignup} className="auth-form">
              <input
                type="email"
                placeholder="Email address"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="error-text">{error}</p>}
              <button type="submit" className="auth-btn">
                Sign Up
              </button>
            </form>
            <div className="auth-links">
              <Link to="/login" className="auth-link">
                Back to Login
              </Link>
            </div>
          </>
        ) : (
          <div className="verify-email-section">
            <div className="verify-card">
              <div className="verify-icon">📧</div>
              <h2 className="verify-title">Almost there!</h2>
              <p className="verify-text">
                We’ve sent a verification email to <strong>{email}</strong>.<br />
                Please check your inbox and click the link to activate your account.
              </p>
              <button
                onClick={handleResendVerification}
                className="resend-btn"
                disabled={!canResend}
              >
                {canResend ? "Resend Verification" : `Resend in ${timer}s`}
              </button>
              <Link to="/login" className="back-login-link">
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}