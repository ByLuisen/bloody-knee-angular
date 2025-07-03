const fs = require("fs");
const path = require("path");

const envFile = path.join(__dirname, "../src/environments/environment.prod.ts");
let content = fs.readFileSync(envFile, "utf8");

content = content
  .replace(/__BLOODY_KNEE_API_URL__/g, process.env.BLOODY_KNEE_API_URL || "")
  .replace(/__DOMAIN__/g, process.env.DOMAIN || "")
  .replace(/__SPA_CLIENT_ID__/g, process.env.SPA_CLIENT_ID || "");

fs.writeFileSync(envFile, content, "utf8");
