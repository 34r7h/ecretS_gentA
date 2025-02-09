import { app } from './server.js';
import { test } from './methods/api.js';

const routes = [
  {
    path: '/api/test',
    method: 'get',
    handler: test,
  }
];

routes.forEach(route => app[route.method](route.path, route.handler));
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

export default app.fetch;

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});