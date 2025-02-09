import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    currentPhase: 'SETUP', // SETUP, MISSION, OUTCOME
    currentCycle: 1,
    totalCycles: 30,
    phaseTimeRemaining: 0,
    seasonPot: 0,
    teams: {
      CIA: { ability: 'EAGLE EYE', description: '+25% Intel tokens for successful missions for 3 turns' },
      FSB: { ability: 'DOUBLE AGENT', description: 'Steals a target agent from another team' },
      MSS: { ability: 'DRAGON EAR', description: 'Gains access to a player\'s comms for 1 turn' },
      MI6: { ability: 'LICENSE TO SHILL', description: 'Able to kill a target agent of another team' },
      MOSSAD: { ability: 'MIRAGE', description: 'Creates fake INTEL TOKENS to ambush SECRET AGENTS' },
      NINJA: { ability: 'SHADOW', description: 'Obscures all comms for entire team for 2 turns' }
    },
    missionTypes: [
      'Break/steal assets',
      'tap comms',
      'set decoys',
      'steal data',
      'hide data'
    ],
    agentTypes: ['OPERATIVE', 'SURVEILLANCE', 'HACKER'],
    missions: [], // Active missions
    leaderboard: [], // Team rankings
  }),
  
  getters: {
    currentPhaseDisplay: (state) => state.currentPhase,
    cycleProgress: (state) => (state.currentCycle / state.totalCycles) * 100,
  },

  actions: {
    advancePhase() {
      const phases = ['SETUP', 'MISSION', 'OUTCOME']
      const currentIndex = phases.indexOf(this.currentPhase)
      const nextIndex = (currentIndex + 1) % phases.length
      this.currentPhase = phases[nextIndex]
      
      if (nextIndex === 0) {
        this.currentCycle++
      }
    },
    
    updatePhaseTimer(timeRemaining) {
      this.phaseTimeRemaining = timeRemaining
    },
    
    addToSeasonPot(amount) {
      this.seasonPot += amount
    }
  }
}) 