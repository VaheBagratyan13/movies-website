import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

export default function App({ onGenreClick }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/movies`)
      .then((r) => r.json())
      .then(setMovies)
      .catch(console.error);
  }, []);

  const handleGenreClick = (e, genre) => {
    e.preventDefault();
    e.stopPropagation();
    if (onGenreClick) {
      onGenreClick();
    }
  };

  return (
    <>
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl font-extrabold text-white mb-12 tracking-tight text-center">
          Movies <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Collection</span>
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {movies.map((m) => (
            <Link to={m.movie_link} target="_blank" rel="noopener noreferrer" key={m.id}>
            <div className="group cursor-pointer">
              <div className="relative  bg-slate-800 rounded-2xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 transform hover:-translate-y-3 overflow-hidden border border-slate-700/50">
                {m.poster ? (
                  <div className="relative  aspect-[2/3] overflow-hidden bg-slate-700">
                    <img 
                      src={m.poster} 
                      alt={m.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  </div>
                ) : (
                  <div className="aspect-[2/3] bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center">
                    <span className="text-slate-400 text-sm font-medium">No Poster</span>
                  </div>
                )}
                <div className="p-6 bg-gradient-to-b  from-slate-800 to-slate-900">
                  <div className="mb-3">
                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-purple-300 transition-colors">
                      {m.title}
                    </h3>
                    {m.year && (
                      <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-semibold rounded-full border border-purple-500/30">
                        {m.year}
                      </span>
                    )}
                  </div>
                  {m.genres && m.genres.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {Array.isArray(m.genres) ? m.genres.map((genre, idx) => (
                        <span 
                          key={idx} 
                          onClick={(e) => handleGenreClick(e, genre)}
                          className="px-2.5 py-1 bg-slate-700/50 text-slate-300 text-xs font-medium rounded-md border border-slate-600/50 hover:bg-purple-600/30 hover:border-purple-500/50 hover:text-purple-200 transition-colors cursor-pointer"
                        >
                          {genre.trim()}
                        </span>
                      )) : (
                        <span 
                          onClick={(e) => handleGenreClick(e, m.genres)}
                          className="px-2.5 py-1 bg-slate-700/50 text-slate-300 text-xs font-medium rounded-md border border-slate-600/50 hover:bg-purple-600/30 hover:border-purple-500/50 hover:text-purple-200 transition-colors cursor-pointer"
                        >
                          {m.genres}
                        </span>
                      )}
                    </div>
                  )}
                  {m.description && (
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 font-normal">
                      {m.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}
