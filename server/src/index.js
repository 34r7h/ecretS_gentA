import { app } from './server';
import { test } from './methods/api';
import { open } from 'lmdb'

const routes = [
  {
    path: '/api/test',
    method: 'get',
    handler: test,
  }
];

routes.forEach(route => app[route.method](route.path, route.handler));
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
