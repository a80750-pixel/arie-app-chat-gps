import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { init, listMessages, insertMessage, deleteMessage, toggleLike, addComment, addReport } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json({ limit: "6mb" }));

app.get("/api/messages", async (_req, res) => {
  try {
    res.json(await listMessages());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error" });
  }
});

app.post("/api/messages", async (req, res) => {
  try {
    const message = await insertMessage(req.body);
    res.status(201).json(message);
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

app.delete("/api/messages/:id", async (req, res) => {
  try {
    const ok = await deleteMessage(req.params.id, String(req.query.authorId || ""));
    if (!ok) return res.status(403).json({ error: "not_owner" });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error" });
  }
});

app.post("/api/messages/:id/like", async (req, res) => {
  try {
    const message = await toggleLike(req.params.id, String(req.body.deviceId || ""));
    if (!message) return res.status(404).json({ error: "not_found" });
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error" });
  }
});

app.post("/api/messages/:id/comments", async (req, res) => {
  try {
    const message = await addComment(req.params.id, req.body);
    if (!message) return res.status(404).json({ error: "not_found" });
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error" });
  }
});

app.post("/api/messages/:id/report", async (req, res) => {
  try {
    const message = await addReport(req.params.id, String(req.body.deviceId || ""));
    if (!message) return res.status(404).json({ error: "not_found" });
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error" });
  }
});

const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));
app.use((req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const port = process.env.PORT || 3000;
init()
  .then(() => {
    app.listen(port, () => console.log(`[spotmessage] listening on :${port}`));
  })
  .catch((err) => {
    console.error("[spotmessage] failed to init database", err);
    process.exit(1);
  });
