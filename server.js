import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = Number(process.env.PORT || 3000);
const adminEmail = "iamadvikgoyal@gmail.com";

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "application/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
]);

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function generateRecoveryCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "MH-";
  for (let index = 0; index < 8; index += 1) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return code;
}

async function sendRecoveryEmail(email, code) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "MealHealth <onboarding@resend.dev>";

  if (!apiKey) {
    const error = new Error(
      "Email service is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL, then run npm start."
    );
    error.code = "EMAIL_SERVICE_NOT_CONFIGURED";
    throw error;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "MealHealth recovery code",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6">
          <h2>MealHealth recovery code</h2>
          <p>Your recovery code is:</p>
          <p style="font-size:24px;font-weight:bold;letter-spacing:2px">${code}</p>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
      text: `Your MealHealth recovery code is ${code}. It expires in 10 minutes.`,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.message || "Failed to send recovery email.");
  }

  return payload;
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function staticPath(urlPath) {
  if (urlPath === "/") return "/index.html";
  return urlPath;
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "POST" && requestUrl.pathname === "/api/recovery/send") {
    try {
      const body = await readBody(req);
      const email = String(body.email || "").trim().toLowerCase();

      if (email !== adminEmail) {
        return sendJson(res, 400, { error: "Enter the correct admin email." });
      }

      const code = generateRecoveryCode();
      const expiresAt = Date.now() + 10 * 60 * 1000;
      await sendRecoveryEmail(email, code);

      return sendJson(res, 200, {
        ok: true,
        code,
        expiresAt,
      });
    } catch (error) {
      const statusCode = error?.code === "EMAIL_SERVICE_NOT_CONFIGURED" ? 503 : 500;
      return sendJson(res, statusCode, {
        error: error?.message || "Unable to send recovery email.",
      });
    }
  }

  const filePath = path.join(__dirname, decodeURIComponent(staticPath(requestUrl.pathname)));
  const ext = path.extname(filePath).toLowerCase();
  const contentType = contentTypes.get(ext) || "application/octet-stream";

  try {
    const file = await readFile(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(file);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

server.listen(port, () => {
  console.log(`MealHealth server running on http://localhost:${port}`);
});
