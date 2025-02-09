import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { open } from "lmdb";

const app = new Elysia()
  .use(cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }))
  .onError(({ code, error, set }) => {
    set.status = code === 'NOT_FOUND' ? 404 : 500;
    return {
      success: false,
      error: error.message
    };
  })
  .onRequest(({ request, set }) => {
    set.headers['Content-Type'] = 'application/json';
  });

export const db = open({
  path: "./data",
  compression: true,
});

if (!db) {
  throw new Error("Failed to initialize database");
}
export { app };

