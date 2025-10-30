const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static(__dirname)); // untuk serve index.html, style.css, script.js

let feederState = "Ready";
let lastDistance = "--";

app.post("/status", (req, res) => {
  const { distance } = req.body;
  lastDistance = distance;
  res.json({ success: true });
});

app.get("/status", (req, res) => {
  res.json({ state: feederState, distance: lastDistance });
});

app.post("/feed", (req, res) => {
  feederState = "Feeding...";
  setTimeout(() => feederState = "Ready", 3000);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
