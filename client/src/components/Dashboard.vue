<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Welcome, Agent</h1>
      <div class="team-badge">
        {{ userStore.team }}
        <div class="ability-tooltip">
          {{ teamAbilities[userStore.team]?.description }}
        </div>
      </div>
    </header>

    <div class="dashboard-grid">
      <!-- Season Status -->
      <div class="dashboard-card">
        <h2>Season Status</h2>
        <div class="status-grid">
          <div class="status-item">
            <span class="label">Cycle</span>
            <span class="value">{{ gameStore.currentCycle }}/{{ gameStore.totalCycles }}</span>
          </div>
          <div class="status-item">
            <span class="label">Phase</span>
            <span class="value">{{ gameStore.currentPhase }}</span>
          </div>
          <div class="status-item">
            <span class="label">Season Pot</span>
            <span class="value">{{ gameStore.seasonPot }} BASE</span>
          </div>
        </div>
      </div>

      <!-- Your Agents -->
      <div class="dashboard-card">
        <h2>Your Agents</h2>
        <div class="agents-list">
          <div v-for="agent in userAgents" :key="agent.id" class="agent-item">
            <div class="agent-header">
              <span class="agent-name">{{ agent.name }}</span>
              <span class="agent-type">{{ agent.type }}</span>
            </div>
            <div class="agent-stats">
              <div class="stat">
                <span class="label">Intel</span>
                <span class="value">{{ agent.intelTokens }}</span>
              </div>
              <div class="stat">
                <span class="label">Status</span>
                <span class="value">{{ agent.onMission ? 'On Mission' : 'Available' }}</span>
              </div>
            </div>
          </div>
          <router-link to="/agent" class="create-agent-btn">
            Create New Agent
          </router-link>
        </div>
      </div>

      <!-- Active Missions -->
      <div class="dashboard-card">
        <h2>Active Missions</h2>
        <div class="missions-list">
          <div v-for="mission in activeMissions" :key="mission.id" class="mission-item">
            <div class="mission-header">
              <span class="mission-type">{{ mission.type }}</span>
              <span class="mission-location">{{ mission.location }}</span>
            </div>
            <div class="mission-details">
              <div class="agents-assigned">
                Agents: {{ mission.assignedAgents.length }}
              </div>
              <div class="mission-reward">
                Reward: {{ mission.rewards }} INTEL
              </div>
            </div>
          </div>
          <router-link to="/missions" class="view-missions-btn">
            View All Missions
          </router-link>
        </div>
      </div>

      <!-- Recent Outcomes -->
      <div class="dashboard-card">
        <h2>Recent Outcomes</h2>
        <div class="outcomes-list">
          <div v-for="outcome in recentOutcomes" :key="outcome.missionId" class="outcome-item">
            <p class="outcome-narrative">{{ outcome.narrative }}</p>
            <span class="outcome-time">{{ formatTime(outcome.timestamp) }}</span>
          </div>
          <router-link to="/outcomes" class="view-outcomes-btn">
            View All Outcomes
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '../state/user'
import { useGameStore } from '../state/game'
import { useMissionStore } from '../state/missions'

const userStore = useUserStore()
const gameStore = useGameStore()
const missionStore = useMissionStore()

const teamAbilities = {
  CIA: { description: 'EAGLE EYE - +25% Intel tokens for successful missions for 3 turns' },
  FSB: { description: 'DOUBLE AGENT - Steals a target agent from another team' },
  MSS: { description: 'DRAGON EAR - Gains access to a player\'s comms for 1 turn' },
  MI6: { description: 'LICENSE TO SHILL - Able to kill a target agent of another team' },
  MOSSAD: { description: 'MIRAGE - Creates fake INTEL TOKENS to ambush SECRET AGENTS' },
  NINJA: { description: 'SHADOW - Obscures all comms for entire team for 2 turns' }
}

// Mock data for development
const userAgents = computed(() => [
  {
    id: 1,
    name: 'Agent Smith',
    type: 'OPERATIVE',
    intelTokens: 5,
    onMission: false
  },
  {
    id: 2,
    name: 'Agent Johnson',
    type: 'HACKER',
    intelTokens: 3,
    onMission: true
  }
])

const activeMissions = computed(() => [
  {
    id: 1,
    type: 'Break/steal assets',
    location: 'Tokyo',
    assignedAgents: [2],
    rewards: 10
  }
])

const recentOutcomes = computed(() => [
  {
    missionId: 'mock-1',
    narrative: 'Agent Smith successfully infiltrated the target facility and extracted valuable intel.',
    timestamp: new Date().toISOString()
  }
])

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString()
}
</script>

<style scoped>
.dashboard {
  padding: 2rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.team-badge {
  position: relative;
  padding: 0.5rem 1rem;
  background: #2a2a2a;
  border-radius: 0.5rem;
  cursor: help;
}

.ability-tooltip {
  position: absolute;
  top: 100%;
  right: 0;
  background: #333;
  padding: 0.5rem;
  border-radius: 0.5rem;
  width: 200px;
  display: none;
  z-index: 10;
}

.team-badge:hover .ability-tooltip {
  display: block;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.dashboard-card {
  background: #2a2a2a;
  border-radius: 1rem;
  padding: 1.5rem;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.agents-list, .missions-list, .outcomes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.agent-item, .mission-item {
  background: #333;
  padding: 1rem;
  border-radius: 0.5rem;
}

.agent-header, .mission-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.agent-stats, .mission-details {
  display: flex;
  gap: 1rem;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.outcome-item {
  background: #333;
  padding: 1rem;
  border-radius: 0.5rem;
}

.outcome-narrative {
  margin-bottom: 0.5rem;
}

.outcome-time {
  font-size: 0.8rem;
  color: #888;
}

.create-agent-btn, .view-missions-btn, .view-outcomes-btn {
  display: block;
  text-align: center;
  padding: 0.75rem;
  background: #444;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.create-agent-btn:hover, .view-missions-btn:hover, .view-outcomes-btn:hover {
  background: #555;
}

.label {
  color: #888;
  font-size: 0.9rem;
}

.value {
  font-weight: bold;
}
</style> 