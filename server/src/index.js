import { app } from './server';
import { 
  test, 
  createAgent, 
  joinTeam, 
  getMissions, 
  createMission, 
  assignMission,
  relocateAgent,
  sendMessage,
  getMessages,
  executeAbility,
  processMissionOutcomes,
  createAsset,
  getSeasonStatus,
  addToPot,
  nextPhase,
  distributePrizePool,
  tradeTokens
} from './methods/api';
import { open } from 'lmdb'

const routes = [
  {
    path: '/api/test',
    method: 'get',
    handler: test,
  },
  {
    path: '/api/agent',
    method: 'post',
    handler: createAgent,
  },
  {
    path: '/api/team',
    method: 'post',
    handler: joinTeam,
  },
  {
    path: '/api/missions',
    method: 'get',
    handler: getMissions,
  },
  {
    path: '/api/mission',
    method: 'post',
    handler: createMission,
  },
  {
    path: '/api/mission/assign',
    method: 'post',
    handler: assignMission,
  },
  {
    path: '/api/agent/relocate',
    method: 'post',
    handler: relocateAgent,
  },
  {
    path: '/api/message',
    method: 'post',
    handler: sendMessage,
  },
  {
    path: '/api/messages',
    method: 'get',
    handler: getMessages,
  },
  {
    path: '/api/ability',
    method: 'post',
    handler: executeAbility,
  },
  {
    path: '/api/process-outcomes',
    method: 'post',
    handler: processMissionOutcomes,
  },
  {
    path: '/api/asset',
    method: 'post',
    handler: createAsset,
  },
  {
    path: '/api/season',
    method: 'get',
    handler: getSeasonStatus,
  },
  {
    path: '/api/pot',
    method: 'post',
    handler: addToPot,
  },
  {
    path: '/api/phase',
    method: 'post',
    handler: nextPhase,
  },
  {
    path: '/api/distribute',
    method: 'post',
    handler: distributePrizePool,
  },
  {
    path: '/api/trade',
    method: 'post',
    handler: tradeTokens,
  }
];

routes.forEach(route => app[route.method](route.path, route.handler));
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
