<template>
  <div class="profile">
    <div class="profile-header">
      <div class="player-info">
        <h1>Agent Profile</h1>
        <div class="team-badge">
          {{ userStore.team }}
          <div class="ability-tooltip">
            {{ teamAbilities[userStore.team]?.description }}
          </div>
        </div>
      </div>
      <div class="ability-status">
        <span class="ability-name">{{ teamAbilities[userStore.team]?.name }}</span>
        <button 
          class="use-ability-btn"
          :disabled="!canUseAbility"
          @click="useTeamAbility"
        >
          Use Team Ability
        </button>
      </div>
    </div>

    <div class="profile-grid">
      <!-- Stats Overview -->
      <div class="profile-card">
        <h2>Season Stats</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">Total Intel</span>
            <span class="stat-value">{{ playerStats.totalIntel }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Successful Missions</span>
            <span class="stat-value">{{ playerStats.successfulMissions }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Failed Missions</span>
            <span class="stat-value">{{ playerStats.failedMissions }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Active Agents</span>
            <span class="stat-value">{{ playerStats.activeAgents }}</span>
          </div>
        </div>
      </div>

      <!-- Team Rankings -->
      <div class="profile-card">
        <h2>Team Rankings</h2>
        <div class="rankings-list">
          <div 
            v-for="team in teamRankings" 
            :key="team.name"
            class="ranking-item"
            :class="{ 'current-team': team.name === userStore.team }"
          >
            <span class="rank">#{{ team.rank }}</span>
            <span class="team-name">{{ team.name }}</span>
            <span class="team-intel">{{ team.intel }} INTEL</span>
          </div>
        </div>
      </div>

      <!-- Active Alliances -->
      <div class="profile-card">
        <h2>Active Alliances</h2>
        <div class="alliances-list">
          <div 
            v-for="alliance in activeAlliances" 
            :key="alliance.id"
            class="alliance-item"
          >
            <div class="alliance-info">
              <span class="team-name">{{ alliance.team }}</span>
              <span class="duration">{{ formatDuration(alliance.duration) }}</span>
            </div>
            <button 
              @click="terminateAlliance(alliance)"
              class="terminate-btn"
            >
              Terminate
            </button>
          </div>
          <button 
            @click="showAllianceForm = true"
            class="request-alliance-btn"
          >
            Request Alliance
          </button>
        </div>
      </div>

      <!-- Alliance Requests -->
      <div class="profile-card">
        <h2>Alliance Requests</h2>
        <div class="requests-list">
          <div 
            v-for="request in allianceRequests" 
            :key="request.id"
            class="request-item"
          >
            <div class="request-info">
              <span class="team-name">{{ request.team }}</span>
              <span class="timestamp">{{ formatTime(request.timestamp) }}</span>
            </div>
            <div class="request-actions">
              <button 
                @click="acceptAlliance(request)"
                class="accept-btn"
              >
                Accept
              </button>
              <button 
                @click="rejectAlliance(request)"
                class="reject-btn"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Alliance Request Modal -->
    <div v-if="showAllianceForm" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Request Alliance</h2>
          <button @click="showAllianceForm = false" class="close-btn">&times;</button>
        </div>

        <form @submit.prevent="handleAllianceRequest" class="alliance-form">
          <div class="form-group">
            <label for="team">Select Team</label>
            <select 
              id="team"
              v-model="allianceForm.team"
              required
            >
              <option value="">Choose a team</option>
              <option 
                v-for="team in availableTeams" 
                :key="team"
                :value="team"
              >
                {{ team }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="message">Message</label>
            <textarea 
              id="message"
              v-model="allianceForm.message"
              rows="3"
              placeholder="Propose terms of alliance..."
              required
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="submit-btn">Send Request</button>
            <button 
              type="button" 
              @click="showAllianceForm = false"
              class="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../state/user'

const userStore = useUserStore()
const showAllianceForm = ref(false)

const allianceForm = ref({
  team: '',
  message: ''
})

const teamAbilities = {
  CIA: { 
    name: 'EAGLE EYE',
    description: '+25% Intel tokens for successful missions for 3 turns'
  },
  FSB: { 
    name: 'DOUBLE AGENT',
    description: 'Steals a target agent from another team'
  },
  MSS: { 
    name: 'DRAGON EAR',
    description: 'Gains access to a player\'s comms for 1 turn'
  },
  MI6: { 
    name: 'LICENSE TO SHILL',
    description: 'Able to kill a target agent of another team'
  },
  MOSSAD: { 
    name: 'MIRAGE',
    description: 'Creates fake INTEL TOKENS to ambush SECRET AGENTS'
  },
  NINJA: { 
    name: 'SHADOW',
    description: 'Obscures all comms for entire team for 2 turns'
  }
}

// Mock data for development
const playerStats = computed(() => ({
  totalIntel: 156,
  successfulMissions: 12,
  failedMissions: 3,
  activeAgents: 4
}))

const teamRankings = computed(() => [
  { rank: 1, name: 'CIA', intel: 450 },
  { rank: 2, name: 'MSS', intel: 380 },
  { rank: 3, name: 'MI6', intel: 320 },
  { rank: 4, name: 'NINJA', intel: 280 },
  { rank: 5, name: 'FSB', intel: 250 },
  { rank: 6, name: 'MOSSAD', intel: 220 }
])

const activeAlliances = computed(() => [
  {
    id: 1,
    team: 'MI6',
    duration: 172800000 // 48 hours in milliseconds
  },
  {
    id: 2,
    team: 'NINJA',
    duration: 86400000 // 24 hours in milliseconds
  }
])

const allianceRequests = computed(() => [
  {
    id: 1,
    team: 'MSS',
    timestamp: new Date().toISOString()
  }
])

const availableTeams = computed(() => 
  Object.keys(teamAbilities).filter(team => 
    team !== userStore.team && 
    !activeAlliances.value.some(a => a.team === team)
  )
)

const canUseAbility = computed(() => true) // Mock ability cooldown check

const formatDuration = (ms) => {
  const hours = Math.floor(ms / 3600000)
  return `${hours}h remaining`
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

const useTeamAbility = () => {
  // Mock ability usage
  console.log('Using team ability:', teamAbilities[userStore.team].name)
}

const terminateAlliance = (alliance) => {
  // Mock alliance termination
  console.log('Terminating alliance with:', alliance.team)
}

const acceptAlliance = (request) => {
  // Mock alliance acceptance
  console.log('Accepting alliance with:', request.team)
}

const rejectAlliance = (request) => {
  // Mock alliance rejection
  console.log('Rejecting alliance with:', request.team)
}

const handleAllianceRequest = () => {
  // Mock alliance request
  console.log('Requesting alliance:', allianceForm.value)
  showAllianceForm.value = false
  allianceForm.value = {
    team: '',
    message: ''
  }
}
</script>

<style scoped>
.profile {
  padding: 2rem;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 1rem;
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

.ability-status {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.use-ability-btn {
  padding: 0.5rem 1rem;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.use-ability-btn:hover:not(:disabled) {
  background: #ff6666;
}

.use-ability-btn:disabled {
  background: #666;
  cursor: not-allowed;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.profile-card {
  background: #2a2a2a;
  border-radius: 1rem;
  padding: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-label {
  color: #888;
  font-size: 0.9rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
}

.rankings-list {
  margin-top: 1rem;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #333;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}

.ranking-item.current-team {
  background: #444;
  border: 1px solid #ff4444;
}

.rank {
  font-weight: bold;
  color: #888;
}

.team-intel {
  margin-left: auto;
  font-weight: bold;
}

.alliances-list, .requests-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.alliance-item, .request-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #333;
  border-radius: 0.5rem;
}

.alliance-info, .request-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.duration, .timestamp {
  color: #888;
  font-size: 0.9rem;
}

.request-actions {
  display: flex;
  gap: 0.5rem;
}

.terminate-btn, .reject-btn {
  padding: 0.5rem 1rem;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.terminate-btn:hover, .reject-btn:hover {
  background: #ff6666;
}

.accept-btn {
  padding: 0.5rem 1rem;
  background: #44ff44;
  color: #000;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.accept-btn:hover {
  background: #66ff66;
}

.request-alliance-btn {
  padding: 0.75rem;
  background: #444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.request-alliance-btn:hover {
  background: #555;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: #2a2a2a;
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 1.5rem;
  cursor: pointer;
}

.alliance-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  color: #888;
}

select, textarea {
  width: 100%;
  padding: 0.75rem;
  background: #333;
  border: 1px solid #444;
  border-radius: 0.5rem;
  color: white;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.submit-btn, .cancel-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn {
  background: #ff4444;
  color: white;
}

.submit-btn:hover {
  background: #ff6666;
}

.cancel-btn {
  background: #444;
  color: white;
}

.cancel-btn:hover {
  background: #555;
}
</style> 