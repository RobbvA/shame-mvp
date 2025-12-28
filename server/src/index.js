const express = require("express");
const cors = require("cors");
require("dotenv").config();

const habitsRouter = require("./routes/habits");

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

// Routes
app.use("/habits", habitsRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`SHAME server running on http://localhost:${PORT}`);
});
