import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api"; 

export default function Admin() {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [poster, setPoster] = useState("");
  const [movie_link, setMovie_link] = useState("");
  const [description, setDescription] = useState("");
  const [genres, setGenres] = useState(""); // строкой, потом разобьём
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMovies = () => {
    fetch(`${API_URL}/movies`)
      .then((r) => r.json())
      .then(setMovies)
      .catch(console.error);
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // genres => ["action","drama"]
    const genresArray = genres
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);

    const res = await fetch(`${API_URL}/movies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        year: year ? Number(year) : null,
        poster,
        movie_link,
        description,
        genres: genresArray
      })
    });

    if (res.ok) {
      setTitle("");
      setYear("");
      setPoster("");
      setMovie_link("");
      setDescription("");
      setGenres("");
      loadMovies();
    } else {
      const err = await res.json().catch(() => ({}));
      alert("Error: " + (err.message || res.status));
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <form onSubmit={handleSubmit} className="max-w-md w-full flex flex-col gap-5 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-700/50">
        <h2 className="text-3xl font-bold text-white mb-1 tracking-tight leading-tight">Add movie</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title *"
          required
          className="w-full px-4 py-2.5 border border-slate-600/50 bg-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-white placeholder:text-slate-400 font-normal leading-normal"
        />
        <input
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Year"
          type="number"
          className="w-full px-4 py-2.5 border border-slate-600/50 bg-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-white placeholder:text-slate-400 font-normal leading-normal"
        />
        <input
          value={poster}
          onChange={(e) => setPoster(e.target.value)}
          placeholder="Poster URL"
          className="w-full px-4 py-2.5 border border-slate-600/50 bg-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-white placeholder:text-slate-400 font-normal leading-normal"
        />
        <input
          value={movie_link}
          onChange={(e) => setMovie_link(e.target.value)}
          placeholder="Link"
          className="w-full px-4 py-2.5 border border-slate-600/50 bg-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-white placeholder:text-slate-400 font-normal leading-normal"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows={4}
          className="w-full px-4 py-2.5 border border-slate-600/50 bg-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none text-white placeholder:text-slate-400 font-normal leading-relaxed"
        />
        <input
          value={genres}
          onChange={(e) => setGenres(e.target.value)}
          placeholder="Genres (через запятую): action, drama"
          className="w-full px-4 py-2.5 border border-slate-600/50 bg-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-white placeholder:text-slate-400 font-normal leading-normal"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>

      <div className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-700/50">
        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight leading-tight">
          Movies <span className="text-purple-400">({movies.length})</span>
        </h2>
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          {movies.map((m) => (
            <div
              key={m.id}
              className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-xl p-4 border border-slate-600/50 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 flex items-start gap-4 backdrop-blur-sm"
            >
              {m.poster ? (
                <div className="relative w-28 h-40 flex-shrink-0 rounded-lg overflow-hidden shadow-xl border-2 border-slate-600/50 hover:border-purple-400/50 transition-all duration-300">
                  <img 
                    src={m.poster} 
                    alt={m.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="w-28 h-40 flex-shrink-0 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-xl border-2 border-slate-600/50">
                  <span className="text-slate-400 text-xs text-center px-2 font-medium">No Poster</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-white leading-tight tracking-tight mb-1">{m.title}</h3>
                  {m.year && (
                    <span className="inline-block px-2.5 py-0.5 bg-purple-500/20 text-purple-300 text-sm font-semibold rounded-md border border-purple-500/30">
                      {m.year}
                    </span>
                  )}
                </div>
                {m.genres && m.genres.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {Array.isArray(m.genres) ? m.genres.map((genre, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-600/50 text-slate-300 text-xs font-medium rounded border border-slate-500/50">
                        {genre.trim()}
                      </span>
                    )) : (
                      <span className="px-2 py-0.5 bg-slate-600/50 text-slate-300 text-xs font-medium rounded border border-slate-500/50">
                        {m.genres}
                      </span>
                    )}
                  </div>
                )}
                {m.description && (
                  <p className="text-slate-400 text-sm leading-relaxed font-normal">{m.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
