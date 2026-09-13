const { spawn } = require('child_process');
const https = require('https');

const port = process.env.PORT || '3000';
console.log(`Starting Next.js production server on port ${port}...`);

const nextApp = spawn('npx', ['next', 'start', '-p', port], {
  stdio: 'inherit',
  env: { ...process.env, PORT: port }
});

// === KEEP-ALIVE PING MESH (Prevents Render Sleep 24/7) ===
const pingUrls = [
  'https://aura-talisman.onrender.com',
  'https://dovile-jewellery.onrender.com/api/health',
  'https://ltt-ecommerce.onrender.com',
];

const pingAll = () => {
  pingUrls.forEach((url) => {
    try {
      https.get(url, (res) => {
        console.log(`[Keep-Alive] Ping ${url}: ${res.statusCode}`);
      }).on('error', (err) => {
        console.log(`[Keep-Alive] Ping notice ${url}: ${err.message}`);
      });
    } catch (e) {}
  });
};

setTimeout(pingAll, 45000);
setInterval(pingAll, 8 * 60 * 1000);

process.on('SIGTERM', () => {
  nextApp.kill();
  process.exit(0);
});

process.on('SIGINT', () => {
  nextApp.kill();
  process.exit(0);
});
