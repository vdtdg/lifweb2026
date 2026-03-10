-- Supprime la table si elle existe déjà
-- DROP TABLE IF EXISTS links;

-- Crée la table links avec SQLite-compatible types
CREATE TABLE IF NOT EXISTS links (
  short TEXT PRIMARY KEY,
  long TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now', 'utc')) NOT NULL, 
  last_visited_at TEXT DEFAULT NULL, -- ajouté TP5a exo 2
  visits INTEGER DEFAULT 0 NOT NULL, 
  secret_key TEXT DEFAULT NULL, -- ajouté TP5a exo 3
  expires_at TEXT DEFAULT NULL  -- ajouté TP5a exo 4
);