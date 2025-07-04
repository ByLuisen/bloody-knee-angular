const fs = require("fs");
const path = require("path");

const envFile = path.join(__dirname, "../src/environments/environment.prod.ts");
let content = fs.readFileSync(envFile, "utf8");

content = content
  .replace(/%%BLOODY_KNEE_API_URL$$/g, process.env.BLOODY_KNEE_API_URL || "")
  .replace(/%%DOMAIN%%/g, process.env.DOMAIN || "")
  .replace(/%%SPA_CLIENT_ID%%/g, process.env.SPA_CLIENT_ID || "");

fs.writeFileSync(envFile, content, "utf8");
