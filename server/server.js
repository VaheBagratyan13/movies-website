import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ ok: true, db: rows[0].ok });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});


app.get("/api/movies", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM movies ORDER BY created_at DESC");
    
    const movies = rows.map((m) => ({
      ...m,
      genres: m.genres ? m.genres.split(",").map((g) => g.trim()) : []
    }));
    res.json(movies);
  } catch (e) {
    console.error("Error fetching movies:", e);
    res.status(500).json({ error: e.message });
  }
});


app.post("/api/movies", async (req, res) => {
  try {
        const { title, year, poster, movie_link, description, genres } = req.body;
    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }

    const genresStr = Array.isArray(genres) ? genres.join(",") : genres || "";

        
    try {
      const [result] = await pool.query(
        "INSERT INTO movies (title, year, poster, movie_link, description, genres) VALUES (?, ?, ?, ?, ?, ?)",
        [title, year || null, poster || null, movie_link || null, description || null, genresStr]
      );
      const [rows] = await pool.query("SELECT * FROM movies WHERE id = ?", [result.insertId]);
      return res.status(201).json(rows[0]);
    } catch (insertError) {
      
      if (insertError.message && insertError.message.includes("Unknown column 'movie_link'")) {
        console.log("movie_link column not found, inserting without movie_link column");
        const [result] = await pool.query(
          "INSERT INTO movies (title, year, poster, description, genres) VALUES (?, ?, ?, ?, ?)",
          [title, year || null, poster || null, movie_link || null, description || null, genresStr]
        );
        const [rows] = await pool.query("SELECT * FROM movies WHERE id = ?", [result.insertId]);
        return res.status(201).json(rows[0]);
      }
        throw insertError;
    }
  } catch (e) {
    console.error("Error adding movie:", e);
    res.status(500).json({ 
      error: e.message,
      hint: e.message && e.message.includes("movie_link") 
        ? "Add the 'movie_link' column to your database: ALTER TABLE movies ADD COLUMN movie_link VARCHAR(500) NULL;"
        : "Check server console for details"
    });
  }
});

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
