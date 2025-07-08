import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { format } from "timeago.js";
import "./FileUpload.css";

const socket = io("http://localhost:5000", {
  auth: {
    token: localStorage.getItem("token"),
  },
});

const History = ({ theme, setTheme, onLogout }) => {
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [showSent, setShowSent] = useState(true);
  const username = localStorage.getItem("username");
  const [showMenu, setShowMenu] = useState(false);


  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5000/history", {
          headers: { Authorization: token },
        });
        const data = await res.json();
        setSent(data.sent);
        setReceived(data.received);
      } catch (err) {
        console.error("Failed to fetch history", err);
      }
    };

    fetchHistory();
  }, []);

  const getIcon = (type) => {
    if (type?.startsWith("image/")) return "🖼";
    if (type?.startsWith("video/")) return "🎥";
    if (type === "application/pdf") return "📄";
    if (type?.startsWith("audio/")) return "🎵";
    return "📁";
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="history-wrapper" data-theme={theme}>
      <div className="history-overlay">
        <div className="profile-section">
  <div className="profile-dropdown">
    <div className="profile-trigger" onClick={() => setShowMenu(prev => !prev)}>
      <div className="profile-avatar-glow profile-avatar-shape">
        {username ? username[0].toUpperCase() : "?"}
      </div>
      <span className="profile-username">{username}</span>
      <div className="dropdown-icon">▼</div>
    </div>

    {showMenu && (
      <div className="dropdown-menu">
        <div className="menu-item" onClick={toggleTheme}>🌓 Toggle Theme</div>
        <div className="menu-item logout" onClick={onLogout}>🚪 Logout</div>
      </div>
    )}
  </div>
</div>


        <h1 className="history-title">📚 File History</h1>

        <div className="card-grid">
          <div
            className={`toggle-card ${showSent ? "active" : ""}`}
            onClick={() => setShowSent(true)}
          >
            📤 Sent Files
          </div>
          <div
            className={`toggle-card ${!showSent ? "active" : ""}`}
            onClick={() => setShowSent(false)}
          >
            📥 Received Files
          </div>
        </div>

        {showSent ? (
          sent.length === 0 ? (
            <p className="history-empty">No files sent yet.</p>
          ) : (
            sent.map((file, idx) => (
              <div key={idx} className="history-card">
                <div>
                  <span className="file-icon">{getIcon(file.type)}</span>
                  <strong>{file.name}</strong> → <span className="recipient">{file.recipient}</span>
                  <div className="timestamp">{format(file.timestamp)}</div>
                </div>
                <div>{Math.round(file.size / 1024)} KB</div>
              </div>
            ))
          )
        ) : (
          received.length === 0 ? (
            <p className="history-empty">No files received yet.</p>
          ) : (
            received.map((file, idx) => (
              <div key={idx} className="history-card">
                <div>
                  <span className="file-icon">{getIcon(file.type)}</span>
                  <strong>{file.name}</strong> ← <span className="sender">{file.sender}</span>
                  <div className="timestamp">{format(file.timestamp)}</div>
                </div>
                <div>{Math.round(file.size / 1024)} KB</div>
              </div>
            ))
          )
        )}

        <div className="history-footer">
          © 2025 Zubeen Naqvi • <i>"Code. Transfer. Repeat. 💻⚡"</i>
        </div>
      </div>
    </div>
  );
};

export default History;
