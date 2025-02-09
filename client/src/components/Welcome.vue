<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <h1>ecretS gentA</h1>
      <h2>Season 1: Chain of Espionage</h2>

      <div class="auth-container">
        <div class="auth-tabs">
          <button 
            :class="['tab-btn', { active: activeTab === 'signin' }]"
            @click="activeTab = 'signin'"
          >
            Sign In
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'signup' }]"
            @click="activeTab = 'signup'"
          >
            Sign Up
          </button>
        </div>

        <!-- Sign In Form -->
        <form v-if="activeTab === 'signin'" @submit.prevent="handleSignIn" class="auth-form">
          <div class="form-group">
            <label for="signin-email">Email</label>
            <input 
              id="signin-email"
              v-model="signinForm.email"
              type="email"
              required
            />
          </div>
          <div class="form-group">
            <label for="signin-password">Password</label>
            <input 
              id="signin-password"
              v-model="signinForm.password"
              type="password"
              required
            />
          </div>
          <button type="submit" class="submit-btn">Sign In</button>
        </form>

        <!-- Sign Up Form -->
        <form v-else @submit.prevent="handleSignUp" class="auth-form">
          <div class="form-group">
            <label for="signup-email">Email</label>
            <input 
              id="signup-email"
              v-model="signupForm.email"
              type="email"
              required
            />
          </div>
          <div class="form-group">
            <label for="signup-password">Password</label>
            <input 
              id="signup-password"
              v-model="signupForm.password"
              type="password"
              required
            />
          </div>
          <div class="form-group">
            <label for="team">Choose Your Team</label>
            <select id="team" v-model="signupForm.team" required>
              <option value="">Select a team</option>
              <option v-for="(ability, team) in teamAbilities" :key="team" :value="team">
                {{ team }} - {{ ability.description }}
              </option>
            </select>
          </div>
          <button type="submit" class="submit-btn">Sign Up</button>
        </form>
      </div>

      <!-- Season Info -->
      <div class="season-info">
        <h3>Current Season Status</h3>
        <div class="season-stats">
          <div class="stat">
            <span class="label">Cycle</span>
            <span class="value">{{ gameStore.currentCycle }}/{{ gameStore.totalCycles }}</span>
          </div>
          <div class="stat">
            <span class="label">Phase</span>
            <span class="value">{{ gameStore.currentPhase }}</span>
          </div>
          <div class="stat">
            <span class="label">Season Pot</span>
            <span class="value">{{ gameStore.seasonPot }} BASE</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../state/user'
import { useGameStore } from '../state/game'

const router = useRouter()
const userStore = useUserStore()
const gameStore = useGameStore()

const activeTab = ref('signin')

const signinForm = ref({
  email: '',
  password: ''
})

const signupForm = ref({
  email: '',
  password: '',
  team: ''
})

const teamAbilities = {
  CIA: { description: 'EAGLE EYE - +25% Intel tokens for successful missions for 3 turns' },
  FSB: { description: 'DOUBLE AGENT - Steals a target agent from another team' },
  MSS: { description: 'DRAGON EAR - Gains access to a player\'s comms for 1 turn' },
  MI6: { description: 'LICENSE TO SHILL - Able to kill a target agent of another team' },
  MOSSAD: { description: 'MIRAGE - Creates fake INTEL TOKENS to ambush SECRET AGENTS' },
  NINJA: { description: 'SHADOW - Obscures all comms for entire team for 2 turns' }
}

const handleSignIn = async () => {
  try {
    // Mock authentication for now
    userStore.setUser({
      id: 'mock-user-id',
      email: signinForm.value.email
    })
    router.push('/dashboard')
  } catch (error) {
    console.error('Sign in failed:', error)
  }
}

const handleSignUp = async () => {
  try {
    // Mock authentication for now
    userStore.setUser({
      id: 'mock-user-id',
      email: signupForm.value.email
    })
    userStore.setTeam(signupForm.value.team)
    router.push('/dashboard')
  } catch (error) {
    console.error('Sign up failed:', error)
  }
}
</script>

<style scoped>
.welcome-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  padding: 2rem;
}

.welcome-content {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  max-width: 500px;
  width: 100%;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
  background: linear-gradient(45deg, #ff4444, #ff44ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #888;
}

.auth-container {
  margin-bottom: 2rem;
}

.auth-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.tab-btn {
  flex: 1;
  padding: 0.75rem;
  background: transparent;
  border: 1px solid #444;
  color: #fff;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: #444;
}

.auth-form {
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

input, select {
  padding: 0.75rem;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 0.5rem;
  color: #fff;
}

.submit-btn {
  padding: 0.75rem;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background: #ff6666;
}

.season-info {
  border-top: 1px solid #444;
  padding-top: 1rem;
}

.season-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.label {
  color: #888;
  font-size: 0.9rem;
}

.value {
  font-size: 1.2rem;
  font-weight: bold;
}
</style> 