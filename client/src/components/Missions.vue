<template>
  <div class="missions">
    <div class="missions-header">
      <h1>Active Missions</h1>
      <div class="phase-info">
        Phase: {{ gameStore.currentPhase }}
      </div>
    </div>

    <!-- World Map -->
    <div class="map-container">
      <div class="world-map">
        <!-- Mock mission locations -->
        <div 
          v-for="mission in availableMissions" 
          :key="mission.id"
          class="mission-marker"
          :style="{ left: mission.coordinates.x + '%', top: mission.coordinates.y + '%' }"
          @click="selectMission(mission)"
        >
          <div class="marker-dot"></div>
          <div class="marker-pulse"></div>
          <div class="marker-tooltip">
            {{ mission.location }}
          </div>
        </div>
      </div>
    </div>

    <!-- Mission Details Modal -->
    <div v-if="selectedMission" class="mission-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ selectedMission.location }}</h2>
          <button @click="selectedMission = null" class="close-btn">&times;</button>
        </div>

        <div class="mission-details">
          <div class="detail-group">
            <span class="label">Type</span>
            <span class="value">{{ selectedMission.type }}</span>
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

        <!-- Agent Assignment -->
        <div class="agent-assignment">
          <h3>Assign Agents</h3>
          <div class="available-agents">
            <div 
              v-for="agent in availableAgents" 
              :key="agent.id"
              class="agent-option"
              :class="{ selected: selectedAgents.includes(agent.id) }"
              @click="toggleAgent(agent)"
            >
              <div class="agent-header">
                <span class="agent-name">{{ agent.name }}</span>
                <span class="agent-type">{{ agent.type }}</span>
              </div>
              <div class="agent-skills">
                <div 
                  v-for="(level, skill) in agent.experience" 
                  :key="skill"
                  class="skill-badge"
                  :class="{ 
                    highlighted: selectedMission.requiredSkills[skill] && 
                    level >= selectedMission.requiredSkills[skill]
                  }"
                >
                  {{ skill }}: {{ level }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mission-actions">
          <button 
            @click="startMission"
            class="start-btn"
            :disabled="selectedAgents.length === 0"
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
import { useMissionStore } from '../state/missions'

const gameStore = useGameStore()
const missionStore = useMissionStore()

const selectedMission = ref(null)
const selectedAgents = ref([])

// Mock data for development
const availableMissions = computed(() => [
  {
    id: 1,
    type: 'Break/steal assets',
    location: 'Tokyo',
    coordinates: { x: 82, y: 35 },
    difficulty: 'Hard',
    rewards: 15,
    requiredSkills: {
      TECH: 5,
      WEAPONS: 3,
      PLANNING: 4
    }
  },
  {
    id: 2,
    type: 'tap comms',
    location: 'Moscow',
    coordinates: { x: 60, y: 25 },
    difficulty: 'Medium',
    rewards: 10,
    requiredSkills: {
      TECH: 6,
      PEOPLE: 3
    }
  },
  {
    id: 3,
    type: 'steal data',
    location: 'New York',
    coordinates: { x: 25, y: 35 },
    difficulty: 'Easy',
    rewards: 8,
    requiredSkills: {
      TECH: 4,
      PLANNING: 3
    }
  }
])

const availableAgents = computed(() => [
  {
    id: 1,
    name: 'Agent Smith',
    type: 'OPERATIVE',
    experience: {
      TECH: 3,
      WEAPONS: 7,
      PEOPLE: 5,
      PLANNING: 4
    }
  },
  {
    id: 2,
    name: 'Agent Johnson',
    type: 'HACKER',
    experience: {
      TECH: 8,
      WEAPONS: 2,
      PEOPLE: 4,
      PLANNING: 6
    }
  }
])

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
  // Mock mission start
  console.log('Starting mission:', {
    mission: selectedMission.value,
    agents: selectedAgents.value
  })
  selectedMission.value = null
  selectedAgents.value = []
}
</script>

<style scoped>
.missions {
  padding: 2rem;
}

.missions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.phase-info {
  padding: 0.5rem 1rem;
  background: #2a2a2a;
  border-radius: 0.5rem;
}

.map-container {
  position: relative;
  width: 100%;
  height: 60vh;
  background: #2a2a2a;
  border-radius: 1rem;
  overflow: hidden;
}

.world-map {
  position: relative;
  width: 100%;
  height: 100%;
  background: url('/world-map-dark.png') no-repeat center center;
  background-size: cover;
}

.mission-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
}

.marker-dot {
  width: 12px;
  height: 12px;
  background: #ff4444;
  border-radius: 50%;
}

.marker-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  background: rgba(255, 68, 68, 0.3);
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
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
  transform: translateX(-50%);
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 0.25rem;
  white-space: nowrap;
  display: none;
}

.mission-marker:hover .marker-tooltip {
  display: block;
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
  background: #2a2a2a;
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

.mission-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.detail-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
  background: #333;
  border-radius: 0.25rem;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  background: #ff4444;
  transition: width 0.3s ease;
}

.agent-assignment {
  margin-top: 1.5rem;
}

.available-agents {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.agent-option {
  background: #333;
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.agent-option:hover {
  background: #444;
}

.agent-option.selected {
  background: #444;
  border: 2px solid #ff4444;
}

.agent-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.agent-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-badge {
  padding: 0.25rem 0.5rem;
  background: #2a2a2a;
  border-radius: 0.25rem;
  font-size: 0.9rem;
}

.skill-badge.highlighted {
  background: #ff4444;
}

.mission-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.start-btn, .cancel-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.start-btn {
  background: #ff4444;
  color: white;
}

.start-btn:hover:not(:disabled) {
  background: #ff6666;
}

.start-btn:disabled {
  background: #666;
  cursor: not-allowed;
}

.cancel-btn {
  background: #444;
  color: white;
}

.cancel-btn:hover {
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