const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

const requestLog = {};
const blockedIPs = new Set();
let logs = [];

let humanRequests = 0;
let botRequests = 0;

// 🔐 SECURITY MIDDLEWARE
app.use((req, res, next) => {
  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress;

  const now = Date.now();

  // ✅ Allow dashboard & stats always
  if (req.url === "/dashboard" || req.url === "/api/stats") {
    return next();
  }

  const userAgent = req.headers["user-agent"] || "";

  // 📊 INIT
  if (!requestLog[ip]) requestLog[ip] = [];

  requestLog[ip].push(now);

  // keep last 3 sec
  requestLog[ip] = requestLog[ip].filter(
    (time) => now - time < 3000
  );

  const count = requestLog[ip].length;

  // =========================
  // 🤖 BOT vs 🧑 HUMAN DETECTION
  // =========================

  let type = "HUMAN";

  // BOT rules
  if (
    count > 15 || // high speed
    !userAgent || // no UA
    userAgent.toLowerCase().includes("node") ||
    userAgent.toLowerCase().includes("bot") ||
    userAgent.toLowerCase().includes("attack")
  ) {
    type = "BOT";
  }

  // HUMAN rules
  if (
    userAgent.includes("Mozilla") ||
    userAgent.includes("Chrome") ||
    userAgent.includes("Safari")
  ) {
    if (count < 10) {
      type = "HUMAN";
    }
  }

  // Count stats
  if (type === "BOT") botRequests++;
  else humanRequests++;

  logs.unshift(`${type === "BOT" ? "🤖 BOT" : "🧑 HUMAN"} → ${ip}`);

  console.log(`📊 ${type} → ${ip} (${count})`);

  // =========================
  // 🚫 BLOCK ONLY BOTS
  // =========================
  if (blockedIPs.has(ip) && type === "BOT") {
    console.log("🚫 BLOCKED BOT:", ip);
    return res.status(403).end();
  }

  // =========================
  // 🚨 ATTACK DETECTION
  // =========================
  if (type === "BOT" && count > 20 && !blockedIPs.has(ip)) {
    console.log("🚨 ATTACK DETECTED:", ip);

    blockedIPs.add(ip);
    logs.unshift(`🚨 ATTACK DETECTED → ${ip}`);

    // 🔄 SELF HEAL
    setTimeout(() => {
      blockedIPs.delete(ip);
      logs.unshift(`♻️ SELF HEAL → ${ip}`);
      console.log("✅ UNBLOCKED:", ip);
    }, 10000);
  }

  next();
});

// 🖥️ DASHBOARD
app.get("/dashboard", (req, res) => {
  res.sendFile(__dirname + "/dashboard.html");
});

// 📊 STATS API
app.get("/api/stats", (req, res) => {
  const totalRequests = Object.values(requestLog).reduce(
    (a, b) => a + b.length,
    0
  );

  res.json({
    totalRequests,
    totalIPs: Object.keys(requestLog).length,
    blockedIPs: Array.from(blockedIPs),
    humanRequests,
    botRequests,
    logs: logs.slice(0, 20),
  });
});

// 🔁 PROXY (IMPORTANT: LAST)
app.use(
  "/",
  createProxyMiddleware({
    target: "http://127.0.0.1/FIRST",
    changeOrigin: true,
  })
);

// 🚀 START
app.listen(3000, () => {
  console.log("🛡️ Server running on http://localhost:3000");
});