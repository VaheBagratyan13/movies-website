import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./index.css";
import App from "./pages/App.jsx";
import Admin from "./pages/Admin.jsx";
import Signin from "./pages/Signin.jsx";

function Root() {
  return (
    <BrowserRouter>
      <nav className="p-3 bg-slate-900 flex gap-3 relative z-50">
        <Link className="text-white hover:text-purple-300 font-bold text-lg transition-colors px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700" to="/">Movies</Link>
        <Link className="text-white hover:text-purple-300 font-bold text-lg transition-colors px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700" to="/signin">Admin</Link>
      </nav>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);