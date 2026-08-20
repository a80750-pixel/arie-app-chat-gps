import pg from "pg";

const DATABASE_URL = process.env.DATABASE_URL;
const REPORT_HIDE_THRESHOLD = 3;

let pool = null;
let memMessages = [];

if (DATABASE_URL) {
  pool = new pg.Pool({
    connectionString: DATABASE_URL,
    ssl: DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false },
  });
}

function rowToMessage(row) {
  return {
    id: row.id,
    authorId: row.author_id,
    authorName: row.author_name,
    lat: Number(row.lat),
    lng: Number(row.lng),
    title: row.title || "",
    text: row.text,
    tag: row.tag,
    photo: row.photo || undefined,
    createdAt: Number(row.created_at),
    expiresAt: row.expires_at !== null ? Number(row.expires_at) : null,
    likes: row.likes,
    comments: row.comments,
    reports: row.reports,
  };
}

export async function init() {
  if (!pool) {
    console.log(
      "[spotmessage] No DATABASE_URL set - using in-memory storage (resets on restart, not shared across instances). Attach a Postgres database for real shared, persistent storage.",
    );
    return;
  }
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      lat DOUBLE PRECISION NOT NULL,
      lng DOUBLE PRECISION NOT NULL,
      title TEXT DEFAULT '',
      text TEXT NOT NULL,
      tag TEXT NOT NULL DEFAULT 'message',
      photo TEXT,
      created_at BIGINT NOT NULL,
      expires_at BIGINT,
      likes JSONB NOT NULL DEFAULT '[]',
      comments JSONB NOT NULL DEFAULT '[]',
      reports JSONB NOT NULL DEFAULT '[]'
    );
  `);
  console.log("[spotmessage] Connected to Postgres, messages table ready.");
}

function visible(m, now) {
  return (m.expiresAt === null || m.expiresAt > now) && m.reports.length < REPORT_HIDE_THRESHOLD;
}

export async function listMessages() {
  const now = Date.now();
  if (!pool) {
    return memMessages.filter((m) => visible(m, now));
  }
  const { rows } = await pool.query("SELECT * FROM messages ORDER BY created_at DESC");
  return rows.map(rowToMessage).filter((m) => visible(m, now));
}

export async function insertMessage(input) {
  const text = String(input.text || "").trim().slice(0, 500);
  if (!text) {
    const err = new Error("empty_text");
    err.status = 400;
    throw err;
  }
  const message = {
    id: input.id,
    authorId: input.authorId,
    authorName: input.authorName,
    lat: Number(input.lat),
    lng: Number(input.lng),
    title: String(input.title || "").trim().slice(0, 80),
    text,
    tag: input.tag,
    photo: input.photo,
    createdAt: Date.now(),
    expiresAt: input.expiresAt ?? null,
    likes: [],
    comments: [],
    reports: [],
  };

  if (!pool) {
    memMessages.push(message);
    return message;
  }
  await pool.query(
    `INSERT INTO messages (id, author_id, author_name, lat, lng, title, text, tag, photo, created_at, expires_at, likes, comments, reports)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'[]','[]','[]')`,
    [
      message.id,
      message.authorId,
      message.authorName,
      message.lat,
      message.lng,
      message.title,
      message.text,
      message.tag,
      message.photo || null,
      message.createdAt,
      message.expiresAt,
    ],
  );
  return message;
}

export async function deleteMessage(id, authorId) {
  if (!pool) {
    const before = memMessages.length;
    memMessages = memMessages.filter((m) => !(m.id === id && m.authorId === authorId));
    return memMessages.length < before;
  }
  const { rowCount } = await pool.query("DELETE FROM messages WHERE id=$1 AND author_id=$2", [id, authorId]);
  return rowCount > 0;
}

export async function toggleLike(id, deviceId) {
  if (!pool) {
    const m = memMessages.find((x) => x.id === id);
    if (!m) return null;
    const idx = m.likes.indexOf(deviceId);
    if (idx >= 0) m.likes.splice(idx, 1);
    else m.likes.push(deviceId);
    return m;
  }
  const { rows } = await pool.query("SELECT likes FROM messages WHERE id=$1", [id]);
  if (!rows.length) return null;
  const likes = rows[0].likes.includes(deviceId)
    ? rows[0].likes.filter((l) => l !== deviceId)
    : [...rows[0].likes, deviceId];
  const { rows: updated } = await pool.query("UPDATE messages SET likes=$1 WHERE id=$2 RETURNING *", [
    JSON.stringify(likes),
    id,
  ]);
  return rowToMessage(updated[0]);
}

export async function addComment(id, input) {
  const text = String(input.text || "").trim().slice(0, 300);
  if (!text) return null;
  const comment = {
    id: input.id,
    authorId: input.authorId,
    authorName: input.authorName,
    text,
    createdAt: Date.now(),
  };
  if (!pool) {
    const m = memMessages.find((x) => x.id === id);
    if (!m) return null;
    m.comments.push(comment);
    return m;
  }
  const { rows } = await pool.query("SELECT comments FROM messages WHERE id=$1", [id]);
  if (!rows.length) return null;
  const comments = [...rows[0].comments, comment];
  const { rows: updated } = await pool.query("UPDATE messages SET comments=$1 WHERE id=$2 RETURNING *", [
    JSON.stringify(comments),
    id,
  ]);
  return rowToMessage(updated[0]);
}

export async function addReport(id, deviceId) {
  if (!pool) {
    const m = memMessages.find((x) => x.id === id);
    if (!m) return null;
    if (!m.reports.includes(deviceId)) m.reports.push(deviceId);
    return m;
  }
  const { rows } = await pool.query("SELECT reports FROM messages WHERE id=$1", [id]);
  if (!rows.length) return null;
  const reports = rows[0].reports.includes(deviceId) ? rows[0].reports : [...rows[0].reports, deviceId];
  const { rows: updated } = await pool.query("UPDATE messages SET reports=$1 WHERE id=$2 RETURNING *", [
    JSON.stringify(reports),
    id,
  ]);
  return rowToMessage(updated[0]);
}
