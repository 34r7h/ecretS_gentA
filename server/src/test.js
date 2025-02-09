import { app } from './server';

const createRequest = (method, path, body = null, headers = {}) => {
  const url = new URL(path, 'http://localhost:3001');
  const init = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };
  if (body) {
    init.body = JSON.stringify(body);
  }
  return new Request(url, init);
};

const testEndpoints = async () => {
  console.log('Testing endpoints...\n');

  // Test season status
  console.log('1. Getting season status...');
  const season = await app.handle(
    createRequest('GET', '/api/season')
  ).then(res => res.json());
  console.log('Season:', season, '\n');

  // Test team joining
  console.log('2. Joining team...');
  const team = await app.handle(
    createRequest('POST', '/api/team', {
      team: 'CIA',
      address: '0x123'
    })
  ).then(res => res.json());
  console.log('Team:', team, '\n');

  // Test agent creation
  console.log('3. Creating agent...');
  const agent = await app.handle(
    createRequest('POST', '/api/agent', {
      name: 'Agent Smith',
      bio: 'Master of disguise',
      team: 'CIA',
      type: 'OPERATIVE'
    })
  ).then(res => res.json());
  console.log('Agent:', agent, '\n');

  // Test mission creation
  console.log('4. Creating mission...');
  const mission = await app.handle(
    createRequest('POST', '/api/mission', {
      location: 'Moscow',
      type: 'BREAK_STEAL',
      reward: 100,
      requiredSkills: ['tech', 'weapons'],
      duration: 86400000 // 24 hours
    })
  ).then(res => res.json());
  console.log('Mission:', mission, '\n');

  // Test asset creation
  console.log('5. Creating asset...');
  const asset = await app.handle(
    createRequest('POST', '/api/asset', {
      type: 'OPERATIVE'
    })
  ).then(res => res.json());
  console.log('Asset:', asset, '\n');

  // Test message sending
  console.log('6. Sending message...');
  const message = await app.handle(
    createRequest('POST', '/api/message', {
      to: '0x456',
      content: 'Let\'s form an alliance'
    }, {
      authorization: '0x123'
    })
  ).then(res => res.json());
  console.log('Message:', message, '\n');

  // Test phase transition
  console.log('7. Transitioning phase...');
  const phase = await app.handle(
    createRequest('POST', '/api/phase')
  ).then(res => res.json());
  console.log('Phase:', phase, '\n');

  console.log('All tests completed!');
};

testEndpoints().catch(console.error); 