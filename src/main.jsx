import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./index.css";
import App from "./pages/App.jsx";
import Admin from "./pages/Admin.jsx";
import Signin from "./pages/Signin.jsx";

function Root() {
  const [showGenresModal, setShowGenresModal] = useState(false);

  return (
    <BrowserRouter>
      <nav className="p-3 bg-slate-900 flex gap-3 relative z-50">
        <Link className="text-white hover:text-purple-300 font-bold text-lg transition-colors px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700" to="/">Movies</Link>
        <Link className="text-white hover:text-purple-300 font-bold text-lg transition-colors px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700" to="/signin">Admin</Link>
        <button 
          onClick={() => setShowGenresModal(true)}
          className="text-white hover:text-purple-300 font-bold text-lg transition-colors px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 cursor-pointer"
        >
          Genres
        </button>
      </nav>
      {showGenresModal && (
        <GenresModal onClose={() => setShowGenresModal(false)} />
      )}
      <Routes>
        <Route path="/" element={<App onGenreClick={() => setShowGenresModal(true)} />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </BrowserRouter>
  );
}

function GenresModal({ onClose }) {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/movies")
      .then((r) => r.json())
      .then((movies) => {
        const allGenres = new Set();
        movies.forEach((movie) => {
          if (movie.genres) {
            if (Array.isArray(movie.genres)) {
              movie.genres.forEach((g) => allGenres.add(g.trim()));
            } else {
              allGenres.add(movie.genres.trim());
            }
          }
        });
        setGenres(Array.from(allGenres).sort());
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-16">
        <div 
          className="bg-white border-2 border-purple-500/30 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[70vh] overflow-hidden relative z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-purple-200 bg-gradient-to-r from-purple-600 to-purple-700">
            <h2 className="text-2xl font-bold text-white">Genres</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 transition-colors text-3xl font-bold leading-none px-3 py-1 rounded-full hover:bg-white/20"
            >
              ×
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(70vh-80px)] bg-slate-50">
            {loading ? (
              <div className="text-slate-600 text-center py-8">Loading genres...</div>
            ) : genres.length === 0 ? (
              <div className="text-slate-600 text-center py-8">No genres available</div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {genres.map((genre, idx) => (
                  <Link
                    key={idx}
                    className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg border border-purple-700 hover:bg-purple-700 hover:shadow-md transition-all cursor-pointer"
                    to={`/?genre=${genre}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                  >
                  {genre}
                  
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);