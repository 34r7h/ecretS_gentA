import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export const useMissionStore = defineStore('missions', {
  state: () => ({
    missions: [], // Active missions
    missionHistory: [], // Completed missions
    outcomes: [], // Mission outcomes with narratives
  }),

  getters: {
    getActiveMissionsByLocation: (state) => (location) => {
      return state.missions.filter(mission => mission.location === location)
    },

    getMissionOutcome: (state) => (missionId) => {
      return state.outcomes.find(outcome => outcome.missionId === missionId)
    },

    getAvailableMissions: (state) => {
      return state.missions.filter(mission => !mission.isCompleted)
    }
  },

  actions: {
    createMission({ type, location, difficulty, requiredSkills, rewards }) {
      const newMission = {
        id: uuidv4(),
        type,
        location,
        difficulty,
        requiredSkills,
        rewards,
        assignedAgents: [],
        isCompleted: false,
        startTime: null,
        endTime: null
      }

      this.missions.push(newMission)
      return newMission.id
    },

    assignAgentsToMission(missionId, agentIds) {
      const mission = this.missions.find(m => m.id === missionId)
      if (mission) {
        mission.assignedAgents = agentIds
        mission.startTime = new Date().toISOString()
      }
    },

    completeMission(missionId, success, narrative) {
      const mission = this.missions.find(m => m.id === missionId)
      if (mission) {
        mission.isCompleted = true
        mission.endTime = new Date().toISOString()

        const outcome = {
          missionId,
          success,
          narrative,
          timestamp: new Date().toISOString()
        }

        this.outcomes.push(outcome)
        this.missionHistory.push({...mission})
        this.missions = this.missions.filter(m => m.id !== missionId)
      }
    },

    generateMockOutcome(missionId) {
      // For development/testing, generate mock outcomes
      const outcomes = [
        'The mission was a stunning success!',
        'Despite heavy resistance, the team prevailed.',
        'The operation failed spectacularly.',
        'A surprising turn of events led to partial success.'
      ]
      
      return outcomes[Math.floor(Math.random() * outcomes.length)]
    }
  }
}) 