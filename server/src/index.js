import { app } from './server';
import { create, read, update, remove, readAll } from './methods/db';
import { start as scan } from './methods/scan';
import { create as createUser, update as updateUser, remove as removeUser, login } from './methods/users';
import { calculateUserPoints, calculateSystemPoints, getLeaderboard } from './methods/calculate';
import { payout } from './methods/payout';
import { Context } from 'elysia';
import { Elysia } from 'elysia';

const routes = [
  {
    path: '/db/create',
    method: 'post',
    handler: create,
  }
];

routes.forEach(route => app[route.method](route.path, route.handler));
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
