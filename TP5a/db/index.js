import Database from "better-sqlite3";
import { nanoid } from "nanoid";
import { readFileSync } from "node:fs";

// Ouvre la base de données (persiste sur le disque)
const database = new Database("database.sqlite");

// Initialise la base de données avec le schéma SQL
export function initializeDatabase() {
  const schema = readFileSync("db/links.sql", "utf8");
  database.exec(schema); // Exécute le SQL pour créer les tables si nécessaire
  console.log("Base de données initialisée.");
}

/**
 * Retourne des informations sur la base de données SQLite
 */
export function getServerStats() {
  const sqliteVersion = database
    .pragma("compile_options")
    .find((opt) => opt.compile_options.startsWith("COMPILER="));
  const pageSize = database.pragma("page_size")[0].page_size;
  const journalMode = database.pragma("journal_mode")[0].journal_mode;
  const foreignKeysEnabled = database.pragma("foreign_keys")[0].foreign_keys;

  return {
    sqliteVersion: sqliteVersion || "Unknown",
    databaseFile: database.name, // Nom du fichier de la base de données
    currentTimestamp: new Date().toISOString(), // Timestamp actuel
    pageSize: pageSize, // Taille des pages en bytes
    journalMode: journalMode, // Mode de journalisation (WAL, DELETE, etc.)
    foreignKeysEnabled: !!foreignKeysEnabled, // Vérifie si les clés étrangères sont activées
  };
}

/**
 * Retourne des statistiques sur les liens
 */
export function getAllLinksStats() {
  return database.prepare("SELECT COUNT(*) as links_count FROM links").get();
}

/**
 * Récupère un lien à partir de son URL courte
 */
export function getLinkByShort(short) {
  return database.prepare("SELECT * FROM links WHERE short = ?").get(short);
}

/**
 * Crée un lien court à partir d'une URL longue
 */
export function createLink(uri, expires) {
  // expires rajouté à l'exo TP5a 4
  const short = nanoid(8);
  const secret_key = nanoid(12); // ajouté à l'exo TP5a 3
  /* original */
  // database.prepare("INSERT INTO links (short, long, expires) VALUES (?, ?)").run(short, uri);
  // --
  // Ajouté à l'exo TP5a 3 :
  // database
  //   .prepare("INSERT INTO links (short, long, secret_key) VALUES (?, ?, ?)")
  //   .run(short, uri, secret_key);
  // --
  // Ajouté à l'exo TP5a 4 :
  database
    .prepare("INSERT INTO links (short, long, secret_key, expires_at) VALUES (?, ?, ?, ?)")
    .run(short, uri, secret_key, expires);

  return { short, long: uri, secret_key: secret_key, visits: 0 };
}

/**
 *
 * Correction TP5a exo 2
 *
 * Met à jour le nombre de visites et le timestamp du dernier accès
 */
export function updateVisit(short) {
  database
    .prepare(
      "UPDATE links SET visits = visits + 1, last_visited_at = datetime('now', 'utc') WHERE short = ?",
    )
    .run(short);
}

/**
 *
 * Correction TP5a exo 3
 *
 * Met à jour le nombre de visites et le timestamp du dernier accès
 */
export function deleteLinkByShort(short) {
  return database.prepare("DELETE FROM links WHERE short = ?").run(short);
}

/**
 *
 * Correction TP5a exo 4
 *
 * On efface les liens expirés
 */
export async function cleanLinks() {
  const stmt = database.prepare(`
    DELETE FROM links
    WHERE expires_at < datetime('now')
    RETURNING *;
  `);
  const result = stmt.all();
  return result;
}

/**
 * Ferme la connexion à la base de données proprement (optionnel)
 */
export function end() {
  database.close();
  console.log("Base de données fermée.");
}
