// script.js
const API_BASE = "https://your-railway-url.up.railway.app"; // 🔁 Ganti dengan URL Railway kamu

async function loadStatus() {
  try {
    const res = await fetch(API_BASE + "/status");
    const data = await res.json();
    document.getElementById("state").innerText = data.state;
    document.getElementById("distance").innerText = data.distance ?? "--";
  } catch (err) {
    document.getElementById("state").innerText = "Disconnected";
    document.getElementById("distance").innerText = "--";
  }
}

async function feedNow() {
  try {
    await fetch(API_BASE + "/feed", { method: "POST" });
    alert("Perintah FEED dikirim!");
  } catch (err) {
    alert("Gagal mengirim perintah FEED");
  }
}

setInterval(loadStatus, 5000);
loadStatus();
