import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { open } from "lmdb";

const app = new Elysia();

const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsConfig));

// const dbInstance = open({
//   path: process.env.DB_PATH || 'data/db',
//   compression: true,
//   encoding: 'json',
// });

export const db = open({
  path: "./data",
  compression: true,
});
if (!db) {
  throw new Error("Failed to initialize database");
}

export { app };
