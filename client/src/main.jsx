import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "prismjs/themes/prism-tomorrow.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import "./styles/index.css";

const AppShell = () => {
  const { isDark } = useTheme();

  return (
    <>
      <App />
      <ToastContainer position="top-right" autoClose={2200} theme={isDark ? "dark" : "light"} />
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
