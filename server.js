// server.js
require("dotenv").config();
const express = require("express");
const mqtt = require("mqtt");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // agar index.html, style.css, script.js bisa diload

// ---- Konfigurasi MQTT (Adafruit IO) ----
const MQTT_USER = process.env.MQTT_USER;
const MQTT_KEY = process.env.MQTT_KEY;
const MQTT_FEED_STATE = `${MQTT_USER}/feeds/feeder-state`;
const MQTT_FEED_DISTANCE = `${MQTT_USER}/feeds/feeder-distance`;
const MQTT_FEED_FEEDNOW = `${MQTT_USER}/feeds/feeder-feednow`;

// ---- Koneksi ke Adafruit IO ----
const client = mqtt.connect(`mqtts://io.adafruit.com`, {
  username: MQTT_USER,
  password: MQTT_KEY
});

let feederState = "Unknown";
let feederDistance = "--";

client.on("connect", () => {
  console.log("✅ Connected to Adafruit IO MQTT");
  client.subscribe([MQTT_FEED_STATE, MQTT_FEED_DISTANCE], (err) => {
    if (!err) console.log("📡 Subscribed to feeder topics");
  });
});

client.on("message", (topic, message) => {
  const data = message.toString();
  if (topic === MQTT_FEED_STATE) feederState = data;
  if (topic === MQTT_FEED_DISTANCE) feederDistance = data;
});

// ---- REST API ----

// Dapatkan status dari MQTT
app.get("/status", (req, res) => {
  res.json({
    state: feederState,
    distance: feederDistance
  });
});

// Kirim perintah FEED ke ESP32
app.post("/feed", (req, res) => {
  client.publish(MQTT_FEED_FEEDNOW, "1");
  console.log("🍖 Feed Now command sent!");
  res.json({ success: true });
});

// ---- Jalankan server ----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
