const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Healthcheck
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "shame-server",
  });
});

// MVP placeholder routes
app.post("/habits", (req, res) => {
  res.status(501).json({ error: "Not implemented yet" });
});

app.post("/habits/:id/logs", (req, res) => {
  res.status(501).json({ error: "Not implemented yet" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`SHAME server running on http://localhost:${PORT}`);
});
