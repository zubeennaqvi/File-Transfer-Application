import React, { useState } from "react";
import Auth from "./Auth";
import FileUpload from "./FileUpload";
import History from "./History";

const App = () => {
  const [authenticated, setAuthenticated] = useState(!!localStorage.getItem("token"));
  const [theme, setTheme] = useState("dark");

  const handleLogin = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setAuthenticated(false);
  };

  return (
    <div>
      {authenticated ? (
        <>
          <FileUpload theme={theme} setTheme={setTheme} onLogout={handleLogout} />
          <History theme={theme} setTheme={setTheme} onLogout={handleLogout} />
        </>
      ) : (
        <Auth onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
