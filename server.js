import express from "express";
import mqtt from "mqtt";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const MQTT_USER = process.env.MQTT_USER;
const MQTT_KEY = process.env.MQTT_KEY;
const MQTT_SERVER = "mqtt://io.adafruit.com";

const client = mqtt.connect(MQTT_SERVER, {
  username: MQTT_USER,
  password: MQTT_KEY,
});

let latestStatus = { distance: null, state: "UNKNOWN" };

client.on("connect", () => {
  console.log("✅ Terhubung ke Adafruit IO MQTT");
  client.subscribe(`${MQTT_USER}/feeds/feeder-status`);
});

client.on("message", (topic, message) => {
  if (topic.endsWith("feeder-status")) {
    try {
      latestStatus = JSON.parse(message.toString());
    } catch (e) {
      console.log("Gagal parse JSON:", message.toString());
    }
  }
});

// Endpoint untuk dashboard
app.get("/status", (req, res) => res.json(latestStatus));

app.post("/feed", (req, res) => {
  client.publish(`${MQTT_USER}/feeds/feeder-command`, "FEED");
  console.log("🐾 Permintaan FEED dari web diteruskan ke MQTT");
  res.json({ success: true, message: "Perintah FEED dikirim" });
});

app.listen(3000, () => console.log("🌐 Server berjalan di port 3000"));
