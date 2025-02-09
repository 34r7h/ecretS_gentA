<template>
  <div class="agent-manager">
    <div class="agent-header">
      <h1>Agent Management</h1>
      <button @click="showCreateForm = true" class="create-btn" v-if="!showCreateForm">
        Create New Agent
      </button>
    </div>

    <!-- Create Agent Form -->
    <div v-if="showCreateForm" class="create-form">
      <h2>Create New Agent</h2>
      <form @submit.prevent="handleCreateAgent">
        <div class="form-group">
          <label for="agent-name">Agent Name</label>
          <input 
            id="agent-name"
            v-model="newAgent.name"
            type="text"
            required
          />
        </div>

        <div class="form-group">
          <label for="agent-bio">Agent Bio</label>
          <textarea 
            id="agent-bio"
            v-model="newAgent.bio"
            rows="3"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label for="agent-type">Agent Type</label>
          <select 
            id="agent-type"
            v-model="newAgent.type"
            required
          >
            <option value="">Select type</option>
            <option v-for="type in agentTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-btn">Create Agent</button>
          <button type="button" @click="showCreateForm = false" class="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Agent List -->
    <div class="agents-grid">
      <div v-for="agent in userAgents" :key="agent.id" class="agent-card">
        <div class="agent-info">
          <h3>{{ agent.name }}</h3>
          <span class="agent-type">{{ agent.type }}</span>
        </div>

        <p class="agent-bio">{{ agent.bio }}</p>

        <!-- Characteristics -->
        <div class="stats-section">
          <h4>Characteristics</h4>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">IQ</span>
              <div class="stat-bar">
                <div 
                  class="stat-fill"
                  :style="{ width: agent.characteristics.IQ + '%' }"
                ></div>
              </div>
              <span class="stat-value">{{ agent.characteristics.IQ }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">CHARISMA</span>
              <div class="stat-bar">
                <div 
                  class="stat-fill"
                  :style="{ width: agent.characteristics.CHARISMA + '%' }"
                ></div>
              </div>
              <span class="stat-value">{{ agent.characteristics.CHARISMA }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">TOUGHNESS</span>
              <div class="stat-bar">
                <div 
                  class="stat-fill"
                  :style="{ width: agent.characteristics.TOUGHNESS + '%' }"
                ></div>
              </div>
              <span class="stat-value">{{ agent.characteristics.TOUGHNESS }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">LUCK</span>
              <div class="stat-bar">
                <div 
                  class="stat-fill"
                  :style="{ width: agent.characteristics.LUCK + '%' }"
                ></div>
              </div>
              <span class="stat-value">{{ agent.characteristics.LUCK }}</span>
            </div>
          </div>
        </div>

        <!-- Experience -->
        <div class="stats-section">
          <h4>Experience</h4>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">TECH</span>
              <div class="stat-bar">
                <div 
                  class="stat-fill"
                  :style="{ width: (agent.experience.TECH * 10) + '%' }"
                ></div>
              </div>
              <span class="stat-value">{{ agent.experience.TECH }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">WEAPONS</span>
              <div class="stat-bar">
                <div 
                  class="stat-fill"
                  :style="{ width: (agent.experience.WEAPONS * 10) + '%' }"
                ></div>
              </div>
              <span class="stat-value">{{ agent.experience.WEAPONS }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">PEOPLE</span>
              <div class="stat-bar">
                <div 
                  class="stat-fill"
                  :style="{ width: (agent.experience.PEOPLE * 10) + '%' }"
                ></div>
              </div>
              <span class="stat-value">{{ agent.experience.PEOPLE }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">PLANNING</span>
              <div class="stat-bar">
                <div 
                  class="stat-fill"
                  :style="{ width: (agent.experience.PLANNING * 10) + '%' }"
                ></div>
              </div>
              <span class="stat-value">{{ agent.experience.PLANNING }}</span>
            </div>
          </div>
        </div>

        <!-- Assets -->
        <div class="assets-section">
          <h4>Assets ({{ agent.assets.length }}/3)</h4>
          <div class="assets-grid">
            <div 
              v-for="asset in agent.assets" 
              :key="asset.id"
              class="asset-item"
            >
              {{ asset.name }}
            </div>
            <router-link 
              v-if="agent.assets.length < 3"
              to="/assets"
              class="add-asset-btn"
            >
              Add Asset
            </router-link>
          </div>
        </div>

        <div class="agent-footer">
          <span class="intel-count">
            {{ agent.intelTokens }} INTEL
          </span>
          <span class="status" :class="{ active: agent.onMission }">
            {{ agent.onMission ? 'On Mission' : 'Available' }}
          </span>
        </div>
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

const showCreateForm = ref(false)
const newAgent = ref({
  name: '',
  bio: '',
  type: ''
})

const agentTypes = ['OPERATIVE', 'SURVEILLANCE', 'HACKER']

// Mock data for development
const userAgents = computed(() => [
  {
    id: 1,
    name: 'Agent Smith',
    type: 'OPERATIVE',
    bio: 'A skilled operative with years of field experience.',
    characteristics: {
      IQ: 85,
      CHARISMA: 70,
      TOUGHNESS: 90,
      LUCK: 65
    },
    experience: {
      TECH: 3,
      WEAPONS: 7,
      PEOPLE: 5,
      PLANNING: 4
    },
    assets: [
      { id: 1, name: 'Encrypted Laptop' },
      { id: 2, name: 'Stealth Suit' }
    ],
    intelTokens: 5,
    onMission: false
  },
  {
    id: 2,
    name: 'Agent Johnson',
    type: 'HACKER',
    bio: 'Expert in cyber operations and digital infiltration.',
    characteristics: {
      IQ: 95,
      CHARISMA: 60,
      TOUGHNESS: 50,
      LUCK: 75
    },
    experience: {
      TECH: 8,
      WEAPONS: 2,
      PEOPLE: 4,
      PLANNING: 6
    },
    assets: [
      { id: 3, name: 'Quantum Computer' }
    ],
    intelTokens: 3,
    onMission: true
  }
])

const handleCreateAgent = () => {
  // Mock agent creation
  console.log('Creating agent:', newAgent.value)
  showCreateForm.value = false
  newAgent.value = {
    name: '',
    bio: '',
    type: ''
  }
}
</script>

<style scoped>
.agent-manager {
  padding: 2rem;
}

.agent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.create-btn {
  padding: 0.75rem 1.5rem;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-btn:hover {
  background: #ff6666;
}

.create-form {
  background: #2a2a2a;
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #888;
}

input, textarea, select {
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
  margin-top: 1.5rem;
}

.submit-btn, .cancel-btn {
  padding: 0.75rem 1.5rem;
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

.agents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.agent-card {
  background: #2a2a2a;
  border-radius: 1rem;
  padding: 1.5rem;
}

.agent-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.agent-type {
  padding: 0.25rem 0.5rem;
  background: #333;
  border-radius: 0.25rem;
  font-size: 0.9rem;
}

.agent-bio {
  color: #888;
  margin-bottom: 1.5rem;
}

.stats-section {
  margin-bottom: 1.5rem;
}

.stats-section h4 {
  margin-bottom: 1rem;
}

.stats-grid {
  display: grid;
  gap: 1rem;
}

.stat-item {
  display: grid;
  grid-template-columns: 100px 1fr auto;
  align-items: center;
  gap: 1rem;
}

.stat-bar {
  height: 0.5rem;
  background: #333;
  border-radius: 0.25rem;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  background: #ff4444;
  transition: width 0.3s ease;
}

.assets-section {
  margin-bottom: 1.5rem;
}

.assets-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.asset-item {
  padding: 0.5rem;
  background: #333;
  border-radius: 0.5rem;
  text-align: center;
  font-size: 0.9rem;
}

.add-asset-btn {
  padding: 0.5rem;
  background: #444;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  text-align: center;
  transition: background-color 0.2s;
}

.add-asset-btn:hover {
  background: #555;
}

.agent-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #444;
}

.intel-count {
  font-weight: bold;
}

.status {
  padding: 0.25rem 0.5rem;
  background: #444;
  border-radius: 0.25rem;
  font-size: 0.9rem;
}

.status.active {
  background: #ff4444;
}
</style> 