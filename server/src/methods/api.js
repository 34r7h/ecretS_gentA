import { db } from '../server';
import { generateMissionOutcome, generateAgentBackstory, generateAsset } from './llm';
import { agentKit } from './agents';

export const test = () => {
  return { success: true, msg: 'test ok 200 bishes' };
};

export const createAgent = async (c) => {
  try {
    const { name, bio, team, type } = c.body;
    const agentId = await agentKit.createAgent(name, bio, team, type);
    return { success: true, agentId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const joinTeam = async (c) => {
  try {
    const { team, address } = c.body;
    await db.put(`team:${address}`, team);
    return { success: true, team };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getMissions = async () => {
  try {
    const missions = await db.get('missions') || {};
    return { success: true, missions };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createMission = async (c) => {
  try {
    const { location, type, reward, requiredSkills, duration } = c.body;
    const missions = await db.get('missions') || {};
    const missionId = await agentKit.createMission(location, reward, requiredSkills, duration);
    missions[missionId] = { 
      id: missionId, 
      type, 
      location, 
      reward, 
      requiredSkills, 
      startTime: Date.now(), 
      endTime: Date.now() + duration, 
      isComplete: false 
    };
    await db.put('missions', missions);
    return { success: true, missionId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const assignMission = async (c) => {
  try {
    const { missionId, agentIds } = c.body;
    const missions = await db.get('missions') || {};
    const mission = missions[missionId];
    if (!mission) throw new Error('Mission not found');
    
    mission.assignedAgents = agentIds;
    await db.put('missions', missions);
    return { success: true, mission };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const relocateAgent = async (c) => {
  try {
    const { agentId, location } = c.body;
    const agents = await db.get('agents') || {};
    const agent = agents[agentId];
    if (!agent) throw new Error('Agent not found');
    
    agent.location = location;
    await db.put('agents', agents);
    return { success: true, agent };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const sendMessage = async (c) => {
  try {
    const { to, content } = c.body;
    const messages = await db.get('messages') || [];
    const message = {
      id: Date.now().toString(),
      from: c.headers.authorization,
      to,
      content,
      timestamp: Date.now(),
      isRead: false
    };
    messages.push(message);
    await db.put('messages', messages);
    return { success: true, message };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getMessages = async (c) => {
  try {
    const address = c.headers.authorization;
    const messages = await db.get('messages') || [];
    const filtered = messages.filter(m => m.to === address || m.from === address);
    return { success: true, messages: filtered };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const executeAbility = async (c) => {
  try {
    const { ability, target } = c.body;
    const address = c.headers.authorization;
    const team = await db.get(`team:${address}`);
    
    // Implement team abilities
    switch (team) {
      case 'CIA':
        // EAGLE EYE - +25% Intel tokens for successful missions for 3 turns
        break;
      case 'FSB':
        // DOUBLE AGENT - Steals a target agent
        break;
      case 'MSS':
        // DRAGON EAR - gains access to comms
        break;
      case 'MI6':
        // LICENSE TO SHILL - kills target agent
        break;
      case 'MOSSAD':
        // MIRAGE - creates fake intel
        break;
      case 'NINJA':
        // SHADOW - obscures comms
        break;
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const processMissionOutcomes = async () => {
  try {
    const missions = await db.get('missions') || {};
    const agents = await db.get('agents') || {};
    
    for (const mission of Object.values(missions)) {
      if (!mission.isComplete && mission.endTime <= Date.now()) {
        const outcome = await generateMissionOutcome(mission, agents);
        mission.isComplete = true;
        // Update agent skills based on outcome
        for (const agentId of mission.assignedAgents) {
          const agent = agents[agentId];
          if (agent && outcome.success) {
            agent.tech += outcome.techGain || 0;
            agent.weapons += outcome.weaponsGain || 0;
            agent.people += outcome.peopleGain || 0;
            agent.planning += outcome.planningGain || 0;
          }
        }
      }
    }
    
    await db.put('missions', missions);
    await db.put('agents', agents);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createAsset = async (c) => {
  try {
    const { type } = c.body;
    const asset = await generateAsset(type);
    const assets = await db.get('assets') || {};
    const assetId = Date.now().toString();
    assets[assetId] = { ...asset, id: assetId };
    await db.put('assets', assets);
    return { success: true, asset: assets[assetId] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getSeasonStatus = async () => {
  try {
    const status = await db.get('season') || {
      currentCycle: 1,
      currentPhase: 'SETUP',
      pot: 0,
      startTime: Date.now(),
      endTime: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
    };
    return { success: true, status };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const addToPot = async (c) => {
  try {
    const { amount } = c.body;
    const status = await db.get('season') || { pot: 0 };
    status.pot += amount;
    await db.put('season', status);
    return { success: true, pot: status.pot };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const nextPhase = async () => {
  try {
    const status = await db.get('season');
    const phases = ['SETUP', 'MISSION', 'OUTCOME'];
    const currentPhaseIndex = phases.indexOf(status.currentPhase);
    
    if (currentPhaseIndex === phases.length - 1) {
      status.currentPhase = phases[0];
      status.currentCycle += 1;
      if (status.currentCycle > 30) {
        return distributePrizePool();
      }
    } else {
      status.currentPhase = phases[currentPhaseIndex + 1];
    }
    
    await db.put('season', status);
    return { success: true, status };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const distributePrizePool = async () => {
  try {
    const status = await db.get('season');
    const agents = await db.get('agents') || {};
    const teams = {};
    
    // Calculate team scores
    Object.values(agents).forEach(agent => {
      if (!teams[agent.team]) teams[agent.team] = 0;
      teams[agent.team] += agent.intelTokens || 0;
    });
    
    // Sort teams by score
    const sortedTeams = Object.entries(teams)
      .sort(([,a], [,b]) => b - a)
      .map(([team]) => team);
    
    const payouts = {
      [sortedTeams[0]]: status.pot * 0.3, // 1st place - 30%
      [sortedTeams[1]]: status.pot * 0.2, // 2nd place - 20%
      [sortedTeams[2]]: status.pot * 0.1, // 3rd place - 10%
    };
    
    // Distribute remaining 40% based on individual intel tokens
    const totalIntelTokens = Object.values(agents)
      .reduce((sum, agent) => sum + (agent.intelTokens || 0), 0);
    
    Object.values(agents).forEach(agent => {
      const share = ((agent.intelTokens || 0) / totalIntelTokens) * (status.pot * 0.4);
      if (!payouts[agent.owner]) payouts[agent.owner] = 0;
      payouts[agent.owner] += share;
    });
    
    return { success: true, payouts };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const tradeTokens = async (c) => {
  try {
    const { fromAgentId, toAgentId, amount } = c.body;
    const agents = await db.get('agents') || {};
    const fromAgent = agents[fromAgentId];
    const toAgent = agents[toAgentId];
    
    if (!fromAgent || !toAgent) throw new Error('Agent not found');
    if ((fromAgent.intelTokens || 0) < amount) throw new Error('Insufficient tokens');
    
    fromAgent.intelTokens = (fromAgent.intelTokens || 0) - amount;
    toAgent.intelTokens = (toAgent.intelTokens || 0) + amount;
    
    await db.put('agents', agents);
    return { success: true, fromAgent, toAgent };
  } catch (error) {
    return { success: false, error: error.message };
  }
};