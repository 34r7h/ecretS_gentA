<template>
  <div class="assets">
    <div class="assets-header">
      <h1>Assets Management</h1>
      <button @click="showCreateForm = true" class="create-btn" v-if="!showCreateForm">
        Create New Asset
      </button>
    </div>

    <!-- Create Asset Form -->
    <div v-if="showCreateForm" class="create-form">
      <h2>Create New Asset</h2>
      <form @submit.prevent="handleCreateAsset">
        <div class="form-group">
          <label for="asset-name">Asset Name</label>
          <input 
            id="asset-name"
            v-model="newAsset.name"
            type="text"
            required
          />
        </div>

        <div class="form-group">
          <label for="asset-description">Description</label>
          <textarea 
            id="asset-description"
            v-model="newAsset.description"
            rows="3"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label for="asset-type">Asset Type</label>
          <select 
            id="asset-type"
            v-model="newAsset.type"
            required
          >
            <option value="">Select type</option>
            <option v-for="type in assetTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-btn">Create Asset</button>
          <button type="button" @click="showCreateForm = false" class="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Asset Grid -->
    <div class="assets-grid">
      <div v-for="asset in userAssets" :key="asset.id" class="asset-card">
        <div class="asset-header">
          <h3>{{ asset.name }}</h3>
          <span class="asset-type">{{ asset.type }}</span>
        </div>

        <p class="asset-description">{{ asset.description }}</p>

        <div class="asset-stats">
          <div class="stat-item">
            <span class="stat-label">Rarity</span>
            <div class="rarity-indicator" :class="asset.rarity.toLowerCase()">
              {{ asset.rarity }}
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-label">Status</span>
            <span class="status" :class="{ assigned: asset.assignedTo }">
              {{ asset.assignedTo ? 'Assigned' : 'Available' }}
            </span>
          </div>
        </div>

        <div v-if="asset.bonuses" class="asset-bonuses">
          <h4>Bonuses</h4>
          <div class="bonuses-grid">
            <div 
              v-for="(value, stat) in asset.bonuses" 
              :key="stat"
              class="bonus-item"
            >
              <span class="bonus-label">{{ stat }}</span>
              <span class="bonus-value">+{{ value }}</span>
            </div>
          </div>
        </div>

        <div class="asset-actions">
          <button 
            v-if="!asset.assignedTo"
            @click="assignAsset(asset)"
            class="assign-btn"
          >
            Assign to Agent
          </button>
          <button 
            v-else
            @click="unassignAsset(asset)"
            class="unassign-btn"
          >
            Unassign
          </button>
        </div>
      </div>
    </div>

    <!-- Assignment Modal -->
    <div v-if="showAssignModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Assign Asset</h2>
          <button @click="showAssignModal = false" class="close-btn">&times;</button>
        </div>

        <div class="agent-list">
          <div 
            v-for="agent in availableAgents" 
            :key="agent.id"
            class="agent-option"
            @click="handleAssignAsset(agent)"
          >
            <div class="agent-info">
              <span class="agent-name">{{ agent.name }}</span>
              <span class="agent-type">{{ agent.type }}</span>
            </div>
            <div class="asset-count">
              Assets: {{ agent.assets.length }}/3
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../state/user'

const userStore = useUserStore()
const showCreateForm = ref(false)
const showAssignModal = ref(false)
const selectedAsset = ref(null)

const newAsset = ref({
  name: '',
  description: '',
  type: ''
})

const assetTypes = ['TECH', 'WEAPON', 'GADGET', 'VEHICLE', 'INTEL']

// Mock data for development
const userAssets = computed(() => [
  {
    id: 1,
    name: 'Quantum Encryption Key',
    type: 'TECH',
    description: 'Advanced encryption device capable of breaking most security systems.',
    rarity: 'RARE',
    bonuses: {
      TECH: 3,
      PLANNING: 1
    },
    assignedTo: null
  },
  {
    id: 2,
    name: 'Stealth Suit',
    type: 'GADGET',
    description: 'Advanced camouflage suit that adapts to any environment.',
    rarity: 'EPIC',
    bonuses: {
      WEAPONS: 2,
      LUCK: 2
    },
    assignedTo: 1
  },
  {
    id: 3,
    name: 'Neural Interface',
    type: 'TECH',
    description: 'Direct brain-computer interface for rapid hacking.',
    rarity: 'LEGENDARY',
    bonuses: {
      TECH: 5,
      IQ: 3
    },
    assignedTo: null
  }
])

const availableAgents = computed(() => [
  {
    id: 1,
    name: 'Agent Smith',
    type: 'OPERATIVE',
    assets: [{ id: 2 }]
  },
  {
    id: 2,
    name: 'Agent Johnson',
    type: 'HACKER',
    assets: []
  }
])

const handleCreateAsset = () => {
  // Mock asset creation
  console.log('Creating asset:', newAsset.value)
  showCreateForm.value = false
  newAsset.value = {
    name: '',
    description: '',
    type: ''
  }
}

const assignAsset = (asset) => {
  selectedAsset.value = asset
  showAssignModal.value = true
}

const unassignAsset = (asset) => {
  // Mock unassign
  console.log('Unassigning asset:', asset.id)
}

const handleAssignAsset = (agent) => {
  if (selectedAsset.value) {
    // Mock assign
    console.log('Assigning asset:', selectedAsset.value.id, 'to agent:', agent.id)
    showAssignModal.value = false
    selectedAsset.value = null
  }
}
</script>

<style scoped>
.assets {
  padding: 2rem;
}

.assets-header {
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

.assets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.asset-card {
  background: #2a2a2a;
  border-radius: 1rem;
  padding: 1.5rem;
}

.asset-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.asset-type {
  padding: 0.25rem 0.5rem;
  background: #333;
  border-radius: 0.25rem;
  font-size: 0.9rem;
}

.asset-description {
  color: #888;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.asset-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rarity-indicator {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  text-align: center;
  font-size: 0.9rem;
}

.rarity-indicator.common {
  background: #666;
}

.rarity-indicator.rare {
  background: #4444ff;
}

.rarity-indicator.epic {
  background: #aa44ff;
}

.rarity-indicator.legendary {
  background: #ffaa44;
}

.status {
  padding: 0.25rem 0.5rem;
  background: #44ff44;
  border-radius: 0.25rem;
  text-align: center;
  font-size: 0.9rem;
  color: #000;
}

.status.assigned {
  background: #ff4444;
  color: white;
}

.asset-bonuses {
  margin-bottom: 1.5rem;
}

.bonuses-grid {
  display: grid;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.bonus-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: #333;
  border-radius: 0.5rem;
}

.asset-actions {
  display: flex;
  gap: 1rem;
}

.assign-btn, .unassign-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.assign-btn {
  background: #44ff44;
  color: #000;
}

.assign-btn:hover {
  background: #66ff66;
}

.unassign-btn {
  background: #ff4444;
  color: white;
}

.unassign-btn:hover {
  background: #ff6666;
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

.agent-list {
  display: grid;
  gap: 1rem;
}

.agent-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #333;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.agent-option:hover {
  background: #444;
}

.agent-info {
  display: flex;
  gap: 1rem;
}

.agent-type {
  color: #888;
}

.asset-count {
  color: #888;
  font-size: 0.9rem;
}
</style> 