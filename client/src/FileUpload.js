import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "./FileUpload.css";

const FileUpload = ({ theme, setTheme }) => {
  const [file, setFile] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [users, setUsers] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [receivedFile, setReceivedFile] = useState(null);
  const [paused, setPaused] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const readerRef = useRef(null);
  const socketRef = useRef(null);

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  useEffect(() => {
    socketRef.current = io("http://localhost:5000", {
      auth: { token },
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("✅ Connected to server as", username);
    });

    socket.on("online_users", (userList) => {
      const others = userList.filter((u) => u !== username);
      setUsers(others);
    });

    socket.on("file_received", (data) => {
      setReceivedFile(data);
      alert(`📥 File received from ${data.sender}: ${data.name} (${data.size} bytes)`);

      const blob = new Blob([data.data], { type: data.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.name;
      a.click();
      URL.revokeObjectURL(url);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, username]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setProgress(0);
    setPaused(false);
  };

  const handleUpload = () => {
    if (!file || !recipient) {
      alert("Please select a file and recipient.");
      return;
    }

    const reader = new FileReader();
    readerRef.current = reader;

    reader.onload = () => {
      setUploading(true);
      const fileBuffer = reader.result;

      let fakeProgress = 0;
      const simulate = setInterval(() => {
        fakeProgress += 20;
        setProgress(Math.min(fakeProgress, 100));
        if (fakeProgress >= 100) clearInterval(simulate);
      }, 100);

      socketRef.current.emit("file_upload", {
        name: file.name,
        type: file.type,
        size: file.size,
        fileBuffer,
        recipient,
      });

      setTimeout(() => {
        setUploading(false);
        setFile(null);
        setProgress(100);
        alert("✅ File sent successfully");
      }, 600);
    };

    reader.onerror = () => {
      alert("❌ Error reading file");
      setUploading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const handlePause = () => {
    setPaused(true);
    readerRef.current?.abort();
  };

  const handleCancel = () => {
    setPaused(false);
    setUploading(false);
    setProgress(0);
    setFile(null);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
  <>
    {/* Video Background */}
    <video autoPlay muted loop id="bg-video">
      <source src="/bg.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    {/* Page Content */}
    <div className="history-wrapper">
      <div className="history-overlay">
        {/* Profile Dropdown */}
        <div className="profile-section">
          <div className="profile-dropdown">
            <div className="profile-trigger" onClick={() => setShowMenu(!showMenu)}>
              <div className="profile-avatar-glow profile-avatar-shape">
                {username ? username[0].toUpperCase() : "?"}
              </div>
              <span className="profile-username">{username}</span>
              <div className="dropdown-icon">▼</div>
            </div>
            {showMenu && (
              <div className="dropdown-menu">
                <div className="menu-item" onClick={toggleTheme}>🌓 Toggle Theme</div>
                <div className="menu-item logout" onClick={handleLogout}>🚪 Logout</div>
              </div>
            )}
          </div>
        </div>

        <h1 className="history-title">🚀 Zubeen's File Transfer App</h1>

        {/* Online Users */}
        <div className="card-grid">
          {users.length === 0 ? (
            <p className="history-empty">No other users online.</p>
          ) : (
            users.map((user) => (
              <div
                key={user}
                className={`toggle-card ${recipient === user ? "active" : ""}`}
                onClick={() => setRecipient(user)}
              >
                <div className="card-avatar">{user[0].toUpperCase()}</div>
                <div className="card-info">
                  <strong>{user}</strong>
                  <span>Online</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* File Upload Area */}
        <div className="file-zone">
          <input type="file" onChange={handleFileChange} />
          <p id="filezz">{file ? file.name : "📂 Choose a file to send"}</p>
        </div>

        <div className="actions">
          <button onClick={handleUpload} disabled={!file || uploading}>📤 Upload</button>
          <button onClick={handlePause} disabled={!uploading || paused}>⏸ Pause</button>
          <button onClick={handleCancel}>❌ Cancel</button>
        </div>

        {uploading && (
          <div className="progress">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        )}

        {receivedFile && (
          <div className="received">
            📥 <strong>{receivedFile.name}</strong> received from {receivedFile.sender}
          </div>
        )}

        {/* Footer */}
        <div className="history-footer">
          © 2025 Zubeen Naqvi • <i>"Code. Transfer. Repeat. 💻⚡"</i>
        </div>
      </div>
    </div>
  </>
);
};

export default FileUpload;
