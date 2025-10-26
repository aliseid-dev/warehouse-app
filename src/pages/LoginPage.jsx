import { useState, useEffect } from "react";
import { auth } from "../utils/firebase";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import "../styles/Auth.css";

const LoginPage = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        window.location.href = "/dashboard";
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailOrUsername,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError("⚠️ Please verify your email before logging in.");
        await signOut(auth);
        return;
      }

      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Log in to your Flash Stock account</p>

        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="text"
            placeholder="Email or Username"
            className="input-field"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
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

          {/* Remember Me toggle */}
          <div className="remember-me">
            <label className="switch">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
            <span className="remember-text">Remember Me</span>
          </div>

          {/* Links */}
          <div className="auth-links">
            <a href="/signup" className="signup-link">
              Create an account
            </a>
            <a href="/forgot-password" className="forgot-link">
              Forgot Password?
            </a>
          </div>

          {error && <p className="error-text">{error}</p>}
          {info && <p className="success-text">{info}</p>}

          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;