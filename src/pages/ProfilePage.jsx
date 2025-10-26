import { useState } from "react";
import { auth } from "../utils/firebase";
import { signOut } from "firebase/auth";
import Header from "../components/Header";
import "../styles/ProfilePage.css";

export default function ProfilePage() {
  const user = auth.currentUser;
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    tinNumber: "",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setEditing(false);
    alert("✅ Profile updated successfully (not saved to Firebase yet)");
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      await signOut(auth);
      window.location.href = "/login";
    }
  };

  return (
    <div className="profile-container">
      <Header title="Profile" />

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                profile.name || "User"
              )}&background=0D8ABC&color=fff`}
              alt="Profile"
            />
          </div>

          <h2>{profile.name || "No Name"}</h2>
          <p className="profile-email">{profile.email}</p>

          {!editing ? (
            <>
              <div className="profile-info">
                <div className="info-row">
                  <strong>📞 Phone:</strong>{" "}
                  <span>{profile.phone || "Not set"}</span>
                </div>
                <div className="info-row">
                  <strong>🧾 TIN Number:</strong>{" "}
                  <span>{profile.tinNumber || "Not set"}</span>
                </div>
              </div>

              <button className="edit-btn" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <div className="profile-form">
                <label>
                  Name
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Phone
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  TIN Number
                  <input
                    type="text"
                    name="tinNumber"
                    value={profile.tinNumber}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className="profile-actions">
                <button className="save-btn" onClick={handleSave}>
                  Save
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}