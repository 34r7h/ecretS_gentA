import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export const useAgentStore = defineStore('agents', {
  state: () => ({
    agents: [], // List of all player's agents
    selectedAgent: null,
  }),

  getters: {
    getAgentsByLocation: (state) => (location) => {
      return state.agents.filter(agent => agent.location === location)
    },
    
    getAgentsByType: (state) => (type) => {
      return state.agents.filter(agent => agent.type === type)
    },

    getAvailableAgents: (state) => {
      return state.agents.filter(agent => !agent.onMission)
    }
  },

  actions: {
    createAgent({ name, bio, type, team, location }) {
      // Generate random scores for immutable characteristics
      const characteristics = {
        IQ: Math.floor(Math.random() * 100),
        CHARISMA: Math.floor(Math.random() * 100),
        TOUGHNESS: Math.floor(Math.random() * 100),
        LUCK: Math.floor(Math.random() * 100)
      }

      // Initialize mutable experience scores
      const experience = {
        TECH: 0,
        WEAPONS: 0,
        PEOPLE: 0,
        PLANNING: 0
      }

      const newAgent = {
        id: uuidv4(),
        name,
        bio,
        type,
        team,
        location,
        characteristics,
        experience,
        assets: [],
        intelTokens: 0,
        onMission: false,
        isAlive: true
      }

      this.agents.push(newAgent)
      return newAgent.id
    },

    assignAsset(agentId, asset) {
      const agent = this.agents.find(a => a.id === agentId)
      if (agent && agent.assets.length < 3) {
        agent.assets.push(asset)
        return true
      }
      return false
    },

    increaseExperience(agentId, skill) {
      const agent = this.agents.find(a => a.id === agentId)
      if (agent && agent.experience[skill] !== undefined) {
        agent.experience[skill]++
      }
    },

    relocateAgent(agentId, newLocation) {
      const agent = this.agents.find(a => a.id === agentId)
      if (agent) {
        agent.location = newLocation
      }
    },

    setMissionStatus(agentId, status) {
      const agent = this.agents.find(a => a.id === agentId)
      if (agent) {
        agent.onMission = status
      }
    },

    addIntelTokens(agentId, amount) {
      const agent = this.agents.find(a => a.id === agentId)
      if (agent) {
        agent.intelTokens += amount
      }
    },

    eliminateAgent(agentId) {
      const agent = this.agents.find(a => a.id === agentId)
      if (agent) {
        agent.isAlive = false
        agent.assets = [] // Burn assets when agent dies
      }
    }
  }
}) 