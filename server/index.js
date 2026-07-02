import dotenv from "dotenv";

const env = dotenv.config();

if (env.parsed?.MONGODB_URI) {
  process.env.MONGODB_URI = env.parsed.MONGODB_URI;
}

if (env.parsed?.MONGODB_DB_NAME) {
  process.env.MONGODB_DB_NAME = env.parsed.MONGODB_DB_NAME;
}

const { createApp } = await import("./app.js");
const { getStoreName } = await import("./config/storeConfig.js");

const port = Number(process.env.PORT || 3001);
const host = process.env.HOST || "0.0.0.0";
const app = createApp();

app.listen(port, host, () => {
  console.log(`${getStoreName()} API escuchando en http://${host}:${port}`);
});
