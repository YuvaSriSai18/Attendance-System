const crypto = require("crypto");

const SECRET_KEY = process.env.QR_SECRET || "supersecretkey123";
const ALGORITHM = "aes-256-cbc";

function encryptPayload(payloadObj) {
  const iv = crypto.randomBytes(16);
  const key = crypto.createHash("sha256").update(SECRET_KEY).digest("base64").substr(0, 32);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(JSON.stringify(payloadObj), "utf8", "base64");
  encrypted += cipher.final("base64");

  const encryptedData = iv.toString("base64") + ":" + encrypted;
  return encryptedData;
}

function decryptPayload(encryptedData) {
  const [ivBase64, encrypted] = encryptedData.split(":");
  const iv = Buffer.from(ivBase64, "base64");
  const key = crypto.createHash("sha256").update(SECRET_KEY).digest("base64").substr(0, 32);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return JSON.parse(decrypted);
}

module.exports = { encryptPayload, decryptPayload };
