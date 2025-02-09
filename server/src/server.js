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


export const db = open({
  path: "./data",
  compression: true,
});
if (!db) {
  throw new Error("Failed to initialize database");
}

export { app };
