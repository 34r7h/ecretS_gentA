import { app } from "./server.js";
import { test } from "./methods/api.js";

const routes = [
  {
    path: "/api/test",
    method: "get",
    handler: test,
  },
];

routes.forEach((route) => app[route.method](route.path, route.handler));
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

Bun.serve({
  fetch: app.fetch,
  port: port,
});
console.log(`Server running on port ${port}`);