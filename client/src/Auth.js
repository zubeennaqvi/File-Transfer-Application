import React, { useState } from "react";

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setUsername("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!username || !password) {
    alert("Please fill in all fields.");
    return;
  }

  const endpoint = isLogin ? "login" : "register";
  const res = await fetch(`http://localhost:5000/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Authentication failed");
    return;
  }

  if (isLogin) {
    localStorage.setItem("token", data.token);
 localStorage.setItem("username", data.username);
    onLogin(); // Callback to navigate to dashboard
  } else {
    alert("Registration successful! You can now log in.");
    setIsLogin(true);
  }
};

  return (
    <div style={styles.wrapper}>
      <video autoPlay muted loop id="bg-video">
  <source src="/login-bg.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

      <div style={styles.overlay} />
      <form onSubmit={handleSubmit} style={styles.form} className="fade-in">
        <h2 style={styles.title}>{isLogin ? "🔐 Login" : "📝 Register"}</h2>

        <input
          type="text"
          placeholder="👤 Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="🔒 Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          {isLogin ? "Login" : "Register"}
        </button>

        <p style={styles.toggleText}>
          {isLogin ? "New user?" : "Already have an account?"}{" "}
          <span onClick={toggleMode} style={styles.link}>
            {isLogin ? "Register here" : "Login here"}
          </span>
        </p>
      </form>

      {/* Animation keyframe in global scope */}
     <style>{`
  #bg-video {
    position: fixed;
    top: 0;
    left: 0;
    min-width: 100%;
    min-height: 100%;
    object-fit: cover;
    z-index: -2;
    opacity: 1;
    pointer-events: none;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .fade-in {
    animation: fadeIn 1s ease forwards;
  }
`}</style>

    </div>
  );
};

const styles = {
  wrapper: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  form: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: "400px",
    background: "rgba(255, 255, 255, 0.95)",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    animation: "fadeIn 1s ease",
  },
  title: {
    marginBottom: "10px",
    textAlign: "center",
    fontSize: "24px",
    color: "#333",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    transition: "border 0.3s",
    outline: "none",
  },
  button: {
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    transition: "background 0.3s",
  },
  toggleText: {
    textAlign: "center",
    fontSize: "0.9em",
    color: "#555",
  },
  link: {
    color: "#007bff",
    cursor: "pointer",
    fontWeight: "bold",
    marginLeft: "5px",
    transition: "color 0.3s",
  },
};

export default Auth;
