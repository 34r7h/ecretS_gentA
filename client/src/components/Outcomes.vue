<template>
  <div class="outcomes">
    <div class="outcomes-header">
      <h1>Mission Outcomes</h1>
      <div class="filter-controls">
        <select v-model="selectedFilter" class="filter-select">
          <option value="all">All Outcomes</option>
          <option value="success">Successful Missions</option>
          <option value="failure">Failed Missions</option>
          <option value="my-agents">My Agents</option>
        </select>
      </div>
    </div>

    <div class="outcomes-grid">
      <article 
        v-for="outcome in filteredOutcomes" 
        :key="outcome.id"
        class="outcome-card"
        :class="{ success: outcome.success }"
      >
        <header class="outcome-header">
          <div class="mission-info">
            <h2>{{ outcome.missionType }}</h2>
            <span class="location">{{ outcome.location }}</span>
          </div>
          <div class="outcome-meta">
            <span class="date">{{ formatDate(outcome.timestamp) }}</span>
            <span class="status" :class="{ success: outcome.success }">
              {{ outcome.success ? 'Success' : 'Failed' }}
            </span>
          </div>
        </header>

        <div class="agents-involved">
          <h3>Agents Involved</h3>
          <div class="agent-list">
            <div 
              v-for="agent in outcome.agents" 
              :key="agent.id"
              class="agent-chip"
            >
              <span class="agent-name">{{ agent.name }}</span>
              <span class="agent-type">{{ agent.type }}</span>
            </div>
          </div>
        </div>

        <div class="narrative-section">
          <p class="narrative">{{ outcome.narrative }}</p>
        </div>

        <div class="outcome-details">
          <div class="rewards">
            <h3>Rewards</h3>
            <div class="rewards-grid">
              <div class="reward-item">
                <span class="label">Intel Tokens</span>
                <span class="value">+{{ outcome.rewards.intel }}</span>
              </div>
              <div 
                v-for="(exp, skill) in outcome.rewards.experience" 
                :key="skill"
                class="reward-item"
              >
                <span class="label">{{ skill }}</span>
                <span class="value">+{{ exp }}</span>
              </div>
            </div>
          </div>

          <div class="assets-affected">
            <h3>Assets</h3>
            <div class="assets-grid">
              <div 
                v-for="asset in outcome.assets" 
                :key="asset.id"
                class="asset-item"
                :class="{ gained: asset.gained, lost: asset.lost }"
              >
                <span class="asset-name">{{ asset.name }}</span>
                <span class="asset-status">
                  {{ asset.gained ? 'Gained' : asset.lost ? 'Lost' : 'Used' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <footer class="outcome-footer">
          <div class="intel-total">
            Total Intel: {{ outcome.rewards.intel }}
          </div>
          <button @click="shareOutcome(outcome)" class="share-btn">
            Share
          </button>
        </footer>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMissionStore } from '../state/missions'

const missionStore = useMissionStore()
const selectedFilter = ref('all')

// Mock data for development
const outcomes = computed(() => [
  {
    id: 1,
    missionType: 'Break/steal assets',
    location: 'Tokyo',
    timestamp: new Date().toISOString(),
    success: true,
    agents: [
      { id: 1, name: 'Agent Smith', type: 'OPERATIVE' },
      { id: 2, name: 'Agent Johnson', type: 'HACKER' }
    ],
    narrative: `In a daring nighttime operation, Agent Smith successfully infiltrated the target facility while Agent Johnson disabled the security systems. The team encountered unexpected resistance but managed to extract the target assets with minimal detection. Agent Smith's combat training proved crucial when confronting a security patrol, while Agent Johnson's quick thinking helped them escape through an underground tunnel network.`,
    rewards: {
      intel: 15,
      experience: {
        TECH: 2,
        WEAPONS: 1,
        PLANNING: 2
      }
    },
    assets: [
      { id: 1, name: 'Quantum Encryption Key', gained: true },
      { id: 2, name: 'Stealth Suit', used: true },
      { id: 3, name: 'EMP Device', lost: true }
    ]
  },
  {
    id: 2,
    missionType: 'tap comms',
    location: 'Moscow',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    success: false,
    agents: [
      { id: 2, name: 'Agent Johnson', type: 'HACKER' }
    ],
    narrative: `The mission to tap into the secure communications network failed when Agent Johnson's presence was detected by an advanced AI security system. Despite a valiant effort to bypass the system's defenses, the agent was forced to abort the mission to avoid capture. The experience revealed critical intelligence about the target's cybersecurity capabilities.`,
    rewards: {
      intel: 3,
      experience: {
        TECH: 1,
        PLANNING: 1
      }
    },
    assets: [
      { id: 4, name: 'Neural Interface', used: true }
    ]
  }
])

const filteredOutcomes = computed(() => {
  switch (selectedFilter.value) {
    case 'success':
      return outcomes.value.filter(o => o.success)
    case 'failure':
      return outcomes.value.filter(o => !o.success)
    case 'my-agents':
      return outcomes.value.filter(o => 
        o.agents.some(a => [1, 2].includes(a.id))
      )
    default:
      return outcomes.value
  }
})

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const shareOutcome = (outcome) => {
  // Mock share functionality
  console.log('Sharing outcome:', outcome.id)
}
</script>

<style scoped>
.outcomes {
  padding: 2rem;
}

.outcomes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.filter-select {
  padding: 0.5rem 1rem;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 0.5rem;
  color: white;
}

.outcomes-grid {
  display: grid;
  gap: 2rem;
}

.outcome-card {
  background: #2a2a2a;
  border-radius: 1rem;
  padding: 2rem;
  border-left: 4px solid #666;
}

.outcome-card.success {
  border-left-color: #44ff44;
}

.outcome-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.mission-info h2 {
  margin-bottom: 0.5rem;
}

.location {
  color: #888;
  font-size: 0.9rem;
}

.outcome-meta {
  text-align: right;
}

.date {
  display: block;
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.status {
  padding: 0.25rem 0.5rem;
  background: #ff4444;
  border-radius: 0.25rem;
  font-size: 0.9rem;
}

.status.success {
  background: #44ff44;
  color: #000;
}

.agents-involved {
  margin-bottom: 1.5rem;
}

.agent-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.agent-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #333;
  border-radius: 0.5rem;
}

.agent-type {
  color: #888;
  font-size: 0.9rem;
}

.narrative-section {
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.outcome-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.rewards-grid, .assets-grid {
  display: grid;
  gap: 1rem;
  margin-top: 0.5rem;
}

.reward-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: #333;
  border-radius: 0.5rem;
}

.asset-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: #333;
  border-radius: 0.5rem;
}

.asset-item.gained {
  border-left: 2px solid #44ff44;
}

.asset-item.lost {
  border-left: 2px solid #ff4444;
}

.asset-status {
  color: #888;
  font-size: 0.9rem;
}

.outcome-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid #444;
}

.intel-total {
  font-weight: bold;
}

.share-btn {
  padding: 0.5rem 1rem;
  background: #444;
  border: none;
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.share-btn:hover {
  background: #555;
}

.label {
  color: #888;
}

.value {
  font-weight: bold;
}
</style> 