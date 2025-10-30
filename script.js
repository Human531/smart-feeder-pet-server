// Ganti sesuai dengan akun kamu
const AIO_USERNAME = "First_Last_156";
const AIO_KEY = "aio_wmPN101jgw4DQtm8hMcRhBFQMis";

// Koneksi MQTT ke Adafruit IO (pakai WebSocket)
const client = new AdafruitMQTTClient({
  username: AIO_USERNAME,
  key: AIO_KEY
});

const feedDistance = `${AIO_USERNAME}/feeds/status`;
const feedCommand = `${AIO_USERNAME}/feeds/command`;

client.on("connect", () => {
  console.log("Terhubung ke Adafruit IO!");
  client.subscribe(feedDistance);
});

client.on("message", (topic, message) => {
  if (topic === feedDistance) {
    document.getElementById("distance").innerText = message;
  }
});

function feedNow() {
  client.publish(feedCommand, "FEED");
  document.getElementById("state").innerText = "Feeding...";
  setTimeout(() => {
    document.getElementById("state").innerText = "Ready";
  }, 3000);
}
