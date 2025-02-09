<template>
  <div class="missions">
    <div class="missions-header">
      <h1>Global Operations</h1>
      <div class="mission-filters">
        <button 
          v-for="status in ['All', 'Available', 'In Progress', 'Completed']"
          :key="status"
          :class="['filter-btn', { active: currentFilter === status }]"
          @click="currentFilter = status"
        >
          {{ status }}
        </button>
      </div>
    </div>

    <!-- World Map -->
    <div class="map-container">
      <div class="map-overlay"></div>
      <div class="world-map">
        <div 
          v-for="mission in filteredMissions" 
          :key="mission.id"
          class="mission-marker"
          :class="[mission.status.toLowerCase(), { active: selectedMission?.id === mission.id }]"
          :style="{ left: mission.coordinates.x + '%', top: mission.coordinates.y + '%' }"
          @click="selectMission(mission)"
        >
          <div class="marker-dot"></div>
          <div class="marker-pulse"></div>
          <div class="marker-tooltip">
            <div class="tooltip-header">
              <span class="location">{{ mission.location }}</span>
              <span class="type">{{ mission.type }}</span>
            </div>
            <div class="tooltip-rewards">
              <span class="intel-icon">🔷</span> {{ mission.rewards }} INTEL
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mission Details Modal -->
    <div v-if="selectedMission" class="mission-modal">
      <div class="modal-content">
        <div class="modal-header">
          <div class="mission-title">
            <h2>{{ selectedMission.location }}</h2>
            <span class="mission-type">{{ selectedMission.type }}</span>
          </div>
          <button @click="selectedMission = null" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="mission-details">
          <div class="detail-group">
            <span class="label">Status</span>
            <span class="value" :class="selectedMission.status">
              {{ selectedMission.status }}
            </span>
          </div>
          <div class="detail-group">
            <span class="label">Difficulty</span>
            <span class="value">{{ selectedMission.difficulty }}</span>
          </div>
          <div class="detail-group">
            <span class="label">Reward</span>
            <span class="value">{{ selectedMission.rewards }} INTEL</span>
          </div>
        </div>

        <div class="required-skills">
          <h3>Required Skills</h3>
          <div class="skills-grid">
            <div 
              v-for="(level, skill) in selectedMission.requiredSkills" 
              :key="skill"
              class="skill-item"
            >
              <span class="skill-name">{{ skill }}</span>
              <div class="skill-bar">
                <div 
                  class="skill-fill"
                  :style="{ width: (level * 10) + '%' }"
                ></div>
              </div>
              <span class="skill-level">{{ level }}</span>
            </div>
          </div>
        </div>

        <div class="agent-assignment">
          <h3>Available Agents</h3>
          <div class="available-agents">
            <div 
              v-for="agent in availableAgents" 
              :key="agent.id"
              class="agent-card"
              :class="{ selected: selectedAgents.includes(agent.id) }"
              @click="toggleAgent(agent)"
            >
              <div class="agent-header">
                <span class="agent-name">{{ agent.name }}</span>
                <span class="agent-type">{{ agent.type }}</span>
              </div>
              <div class="agent-skills">
                <div 
                  v-for="(level, skill) in agent.skills" 
                  :key="skill"
                  class="skill-badge"
                  :class="{ 
                    matched: selectedMission.requiredSkills[skill] && 
                    level >= selectedMission.requiredSkills[skill]
                  }"
                >
                  {{ skill }}: {{ level }}
                </div>
              </div>
              <div class="agent-status">
                {{ agent.status }}
              </div>
            </div>
          </div>
        </div>

        <div class="mission-actions">
          <button 
            @click="startMission"
            class="start-btn"
            :disabled="!canStartMission"
          >
            Start Mission
          </button>
          <button @click="selectedMission = null" class="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '../state/game'
import { useUserStore } from '../state/user'

const gameStore = useGameStore()
const userStore = useUserStore()

const selectedMission = ref(null)
const selectedAgents = ref([])
const currentFilter = ref('All')

// Mock mission data
const missions = ref([
  {
    id: 1,
    type: 'Asset Extraction',
    location: 'Tokyo',
    coordinates: { x: 82, y: 35 },
    difficulty: 'Hard',
    status: 'Available',
    rewards: 15,
    requiredSkills: {
      TECH: 5,
      WEAPONS: 3,
      PLANNING: 4
    }
  },
  {
    id: 2,
    type: 'Intelligence Gathering',
    location: 'Moscow',
    coordinates: { x: 60, y: 25 },
    difficulty: 'Medium',
    status: 'In Progress',
    rewards: 10,
    requiredSkills: {
      TECH: 6,
      PEOPLE: 3
    }
  },
  {
    id: 3,
    type: 'Data Breach',
    location: 'New York',
    coordinates: { x: 25, y: 35 },
    difficulty: 'Easy',
    status: 'Available',
    rewards: 8,
    requiredSkills: {
      TECH: 4,
      PLANNING: 3
    }
  }
])

const filteredMissions = computed(() => {
  if (currentFilter.value === 'All') return missions.value
  return missions.value.filter(m => m.status === currentFilter.value)
})

// Mock agent data
const availableAgents = ref([
  {
    id: 1,
    name: 'Agent Smith',
    type: 'Field Operative',
    status: 'Available',
    skills: {
      TECH: 3,
      WEAPONS: 7,
      PEOPLE: 5,
      PLANNING: 4
    }
  },
  {
    id: 2,
    name: 'Agent Johnson',
    type: 'Cyber Specialist',
    status: 'Available',
    skills: {
      TECH: 8,
      WEAPONS: 2,
      PEOPLE: 4,
      PLANNING: 6
    }
  }
])

const canStartMission = computed(() => {
  if (!selectedMission.value || selectedAgents.value.length === 0) return false
  
  // Check if selected agents meet the required skills
  const totalSkills = {}
  selectedAgents.value.forEach(agentId => {
    const agent = availableAgents.value.find(a => a.id === agentId)
    if (agent) {
      Object.entries(agent.skills).forEach(([skill, level]) => {
        totalSkills[skill] = (totalSkills[skill] || 0) + level
      })
    }
  })

  return Object.entries(selectedMission.value.requiredSkills).every(
    ([skill, required]) => (totalSkills[skill] || 0) >= required
  )
})

const selectMission = (mission) => {
  selectedMission.value = mission
  selectedAgents.value = []
}

const toggleAgent = (agent) => {
  const index = selectedAgents.value.indexOf(agent.id)
  if (index === -1) {
    selectedAgents.value.push(agent.id)
  } else {
    selectedAgents.value.splice(index, 1)
  }
}

const startMission = () => {
  if (!canStartMission.value) return
  
  // Update mission status
  const mission = missions.value.find(m => m.id === selectedMission.value.id)
  if (mission) {
    mission.status = 'In Progress'
  }

  // Update agent status
  selectedAgents.value.forEach(agentId => {
    const agent = availableAgents.value.find(a => a.id === agentId)
    if (agent) {
      agent.status = 'On Mission'
    }
  })

  selectedMission.value = null
  selectedAgents.value = []
}
</script>

<style scoped>
.missions {
  height: 100vh;
  padding: 2rem;
  background: var(--background-color);
}

.missions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.mission-filters {
  display: flex;
  gap: 1rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  background: var(--secondary-color);
  color: var(--text-color);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn.active {
  background: var(--accent-color);
  color: white;
}

.map-container {
  position: relative;
  width: 100%;
  height: 60vh;
  background: var(--background);
  border-radius: 1rem;
  overflow: hidden;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/world-map-dark.svg') no-repeat center center;
  background-size: cover;
  opacity: 0.15;
  filter: saturate(0.5) brightness(0.8);
}

.world-map {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    rgba(0, 0, 0, 0.7),
    rgba(0, 0, 0, 0.5)
  );
}

.mission-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 2;
}

.marker-dot {
  width: 12px;
  height: 12px;
  background: var(--accent-color);
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
}

.marker-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.mission-marker.active .marker-dot {
  transform: scale(1.2);
  background: var(--primary-color);
  border-color: var(--accent-color);
}

.mission-marker:hover .marker-dot {
  transform: scale(1.2);
  border-color: var(--accent-color);
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

.marker-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid var(--accent-color);
  border-radius: 0.5rem;
  padding: 0.75rem;
  width: max-content;
  pointer-events: none;
  opacity: 0;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

.mission-marker:hover .marker-tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(-8px);
}

.tooltip-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.location {
  font-weight: bold;
  color: var(--accent-color);
}

.type {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.tooltip-rewards {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--accent-color);
}

.intel-icon {
  font-size: 1.2rem;
}

.mission-modal {
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
  background: var(--background-color);
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.mission-title {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mission-type {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: var(--text-color);
}

.mission-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--secondary-color);
  border-radius: 0.5rem;
}

.detail-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.value {
  font-weight: bold;
}

.value.Available {
  color: var(--success-color);
}

.value.In Progress {
  color: var(--warning-color);
}

.value.Completed {
  color: var(--info-color);
}

.skills-grid {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.skill-item {
  display: grid;
  grid-template-columns: 100px 1fr auto;
  align-items: center;
  gap: 1rem;
}

.skill-bar {
  height: 0.5rem;
  background: var(--secondary-color);
  border-radius: 0.25rem;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  background: var(--accent-color);
  transition: width 0.3s ease;
}

.agent-assignment {
  margin-top: 2rem;
}

.available-agents {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.agent-card {
  background: var(--secondary-color);
  padding: 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.agent-card:hover {
  transform: translateY(-2px);
}

.agent-card.selected {
  border-color: var(--accent-color);
}

.agent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.agent-name {
  font-weight: bold;
}

.agent-type {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.agent-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.skill-badge {
  padding: 0.25rem 0.5rem;
  background: var(--background-color);
  border-radius: 0.25rem;
  font-size: 0.9rem;
}

.skill-badge.matched {
  background: var(--success-color);
  color: white;
}

.agent-status {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.mission-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.start-btn, .cancel-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.start-btn {
  background: var(--accent-color);
  color: white;
}

.start-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.start-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-btn {
  background: var(--secondary-color);
  color: var(--text-color);
}

.cancel-btn:hover {
  background: var(--border-color);
}
</style> 