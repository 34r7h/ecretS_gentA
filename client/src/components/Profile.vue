<template>
  <div class="profile" :style="{ background: userStore.currentTheme.background }">
    <div class="profile-header">
      <div class="player-info">
        <div class="player-avatar">
          <!-- Team-based avatar background -->
          <div class="avatar-frame" :style="{ background: userStore.currentTheme.primary }">
            {{ userStore.currentUser?.name?.[0]?.toUpperCase() }}
          </div>
        </div>
        <div class="player-details">
          <h1>{{ userStore.currentUser?.name }}</h1>
          <div class="team-badge" :style="{ background: userStore.currentTheme.secondary }">
            {{ userStore.team }}
            <div class="ability-tooltip">
              {{ userStore.getTeamAbility?.description }}
            </div>
          </div>
        </div>
      </div>
      <div class="player-stats">
        <div class="stat-card">
          <span class="stat-value">{{ playerStats.totalIntel }}</span>
          <span class="stat-label">Intel Tokens</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ playerStats.agentCount }}</span>
          <span class="stat-label">Agents</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ playerStats.successRate }}%</span>
          <span class="stat-label">Success Rate</span>
        </div>
      </div>
    </div>

    <div class="profile-content">
      <!-- Activity Feed -->
      <div class="activity-feed">
        <h2>Recent Activity</h2>
        <div class="activity-list">
          <div v-for="activity in recentActivity" :key="activity.id" class="activity-card">
            <div class="activity-header">
              <span class="activity-type" :class="activity.type">{{ activity.type }}</span>
              <span class="activity-time">{{ formatTime(activity.timestamp) }}</span>
            </div>
            <p class="activity-description">{{ activity.description }}</p>
            <div v-if="activity.outcome" class="activity-outcome" :class="activity.outcome.success ? 'success' : 'failure'">
              {{ activity.outcome.description }}
            </div>
          </div>
        </div>
      </div>

      <!-- Agent Roster -->
      <div class="agent-roster">
        <h2>Agent Roster</h2>
        <div class="roster-grid">
          <div v-for="agent in playerAgents" :key="agent.id" class="agent-card">
            <div class="agent-header">
              <h3>{{ agent.name }}</h3>
              <span class="agent-type">{{ agent.type }}</span>
            </div>
            <div class="agent-status" :class="{ active: agent.onMission }">
              {{ agent.onMission ? 'On Mission' : 'Available' }}
            </div>
            <div class="agent-intel">
              <span class="intel-icon">🔷</span>
              {{ agent.intelTokens }} INTEL
            </div>
          </div>
        </div>
      </div>

      <!-- Alliance Network -->
      <div class="alliance-network">
        <h2>Alliance Network</h2>
        <div class="network-grid">
          <div class="active-alliances">
            <h3>Active Alliances</h3>
            <div class="alliance-list">
              <div v-for="alliance in activeAlliances" :key="alliance.id" class="alliance-card">
                <div class="alliance-info">
                  <span class="team-name">{{ alliance.team }}</span>
                  <span class="alliance-duration">{{ formatDuration(alliance.duration) }}</span>
                </div>
                <button @click="terminateAlliance(alliance)" class="terminate-btn">
                  Terminate
                </button>
              </div>
            </div>
          </div>
          <div class="alliance-requests">
            <h3>Pending Requests</h3>
            <div class="request-list">
              <div v-for="request in allianceRequests" :key="request.id" class="request-card">
                <div class="request-info">
                  <span class="team-name">{{ request.team }}</span>
                  <span class="request-time">{{ formatTime(request.timestamp) }}</span>
                </div>
                <div class="request-actions">
                  <button @click="acceptAlliance(request)" class="accept-btn">Accept</button>
                  <button @click="rejectAlliance(request)" class="reject-btn">Reject</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button @click="showAllianceForm = true" class="new-alliance-btn">
          Propose New Alliance
        </button>
      </div>
    </div>

    <!-- Alliance Proposal Modal -->
    <div v-if="showAllianceForm" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Propose Alliance</h2>
          <button @click="showAllianceForm = false" class="close-btn">&times;</button>
        </div>
        <form @submit.prevent="handleAllianceProposal" class="alliance-form">
          <div class="form-group">
            <label for="team">Select Team</label>
            <select id="team" v-model="allianceForm.team" required>
              <option value="">Choose a team</option>
              <option v-for="team in availableTeams" :key="team" :value="team">
                {{ team }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="terms">Alliance Terms</label>
            <textarea 
              id="terms"
              v-model="allianceForm.terms"
              rows="3"
              placeholder="Propose your terms for the alliance..."
              required
            ></textarea>
          </div>
          <div class="form-group">
            <label for="duration">Proposed Duration (cycles)</label>
            <input 
              id="duration"
              type="number"
              v-model="allianceForm.duration"
              min="1"
              max="10"
              required
            />
          </div>
          <div class="form-actions">
            <button type="submit" class="submit-btn">Send Proposal</button>
            <button type="button" @click="showAllianceForm = false" class="cancel-btn">
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
import { useGameStore } from '../state/game'

const userStore = useUserStore()
const gameStore = useGameStore()
const showAllianceForm = ref(false)

const allianceForm = ref({
  team: '',
  terms: '',
  duration: 3
})

// Mock data for development
const playerStats = computed(() => ({
  totalIntel: 156,
  agentCount: 4,
  successRate: 75
}))

const recentActivity = computed(() => [
  {
    id: 1,
    type: 'MISSION',
    timestamp: new Date().toISOString(),
    description: 'Deployed Agent Smith to infiltrate target facility in Tokyo',
    outcome: {
      success: true,
      description: 'Successfully extracted target data and acquired 15 INTEL'
    }
  },
  {
    id: 2,
    type: 'ALLIANCE',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    description: 'Formed alliance with MI6 team',
  },
  {
    id: 3,
    type: 'AGENT',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    description: 'Recruited new HACKER agent: Ghost Protocol',
  }
])

const playerAgents = computed(() => [
  {
    id: 1,
    name: 'Agent Smith',
    type: 'OPERATIVE',
    onMission: true,
    intelTokens: 45
  },
  {
    id: 2,
    name: 'Ghost Protocol',
    type: 'HACKER',
    onMission: false,
    intelTokens: 30
  }
])

const activeAlliances = computed(() => [
  {
    id: 1,
    team: 'MI6',
    duration: 172800000 // 48 hours
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
  Object.keys(userStore.teamThemes).filter(team => 
    team !== userStore.team && 
    !activeAlliances.value.some(a => a.team === team)
  )
)

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  if (diff < 3600000) { // Less than 1 hour
    const minutes = Math.floor(diff / 60000)
    return `${minutes}m ago`
  } else if (diff < 86400000) { // Less than 24 hours
    const hours = Math.floor(diff / 3600000)
    return `${hours}h ago`
  } else {
    return date.toLocaleDateString()
  }
}

const formatDuration = (ms) => {
  const hours = Math.floor(ms / 3600000)
  return `${hours}h remaining`
}

const terminateAlliance = (alliance) => {
  console.log('Terminating alliance with:', alliance.team)
}

const acceptAlliance = (request) => {
  console.log('Accepting alliance with:', request.team)
}

const rejectAlliance = (request) => {
  console.log('Rejecting alliance with:', request.team)
}

const handleAllianceProposal = () => {
  console.log('Proposing alliance:', allianceForm.value)
  showAllianceForm.value = false
  allianceForm.value = {
    team: '',
    terms: '',
    duration: 3
  }
}
</script>

<style scoped>
.profile {
  min-height: 100vh;
  padding: 2rem;
  color: white;
}

.profile-header {
  background: var(--secondary-color);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
}

.player-info {
  display: flex;
  gap: 2rem;
}

.player-avatar {
  width: 100px;
  height: 100px;
}

.avatar-frame {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
}

.player-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.team-badge {
  position: relative;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: help;
  display: inline-block;
}

.ability-tooltip {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--secondary-color);
  padding: 0.5rem;
  border-radius: 0.5rem;
  width: 200px;
  display: none;
  z-index: 10;
  margin-top: 0.5rem;
}

.team-badge:hover .ability-tooltip {
  display: block;
}

.player-stats {
  display: flex;
  gap: 1rem;
}

.stat-card {
  background: var(--primary-color);
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.profile-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.activity-feed {
  grid-column: 1;
  background: var(--secondary-color);
  border-radius: 1rem;
  padding: 1.5rem;
}

.agent-roster {
  grid-column: 2;
  grid-row: 1 / 3;
  background: var(--secondary-color);
  border-radius: 1rem;
  padding: 1.5rem;
  height: fit-content;
}

.alliance-network {
  grid-column: 1;
  background: var(--secondary-color);
  border-radius: 1rem;
  padding: 1.5rem;
}

.roster-grid {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.agent-card {
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.activity-card {
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.activity-type {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.9rem;
}

.activity-type.MISSION {
  background: var(--accent-color);
}

.activity-type.ALLIANCE {
  background: var(--primary-color);
}

.activity-type.AGENT {
  background: #44ff44;
  color: black;
}

.activity-time {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.activity-outcome {
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
}

.activity-outcome.success {
  background: rgba(68, 255, 68, 0.2);
  color: #44ff44;
}

.activity-outcome.failure {
  background: rgba(255, 68, 68, 0.2);
  color: #ff4444;
}

.agent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.agent-type {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.agent-status {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background: #44ff44;
  color: black;
  display: inline-block;
  margin-bottom: 0.5rem;
}

.agent-status.active {
  background: var(--accent-color);
  color: white;
}

.agent-intel {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.network-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 1rem;
}

.alliance-card, .request-card {
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alliance-info, .request-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.team-name {
  font-weight: bold;
}

.alliance-duration, .request-time {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
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

.accept-btn {
  padding: 0.5rem 1rem;
  background: #44ff44;
  color: black;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.new-alliance-btn {
  margin-top: 1rem;
  width: 100%;
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
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
  background: var(--secondary-color);
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
  color: rgba(255, 255, 255, 0.6);
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
  color: rgba(255, 255, 255, 0.8);
}

select, textarea, input {
  width: 100%;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  background: var(--accent-color);
  color: white;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}
</style> 