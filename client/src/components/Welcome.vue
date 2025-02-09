<template>
  <div class="welcome">
    <div class="welcome-content">
      <div class="branding">
        <div class="game-title">
          <span class="title-part">ecret</span>
          <span class="title-part accent">S</span>
          <span class="title-part">gent</span>
          <span class="title-part accent">A</span>
        </div>
        <div class="season-title">Season 1: Chain of Espionage</div>
      </div>

      <div class="auth-container" v-if="!userStore.isAuthenticated">
        <div class="auth-tabs">
          <button 
            :class="['tab-btn', { active: authMode === 'signin' }]"
            @click="authMode = 'signin'"
          >
            Sign In
          </button>
          <button 
            :class="['tab-btn', { active: authMode === 'signup' }]"
            @click="authMode = 'signup'"
          >
            Sign Up
          </button>
        </div>

        <form @submit.prevent="handleAuth" class="auth-form">
          <div class="form-group" v-if="authMode === 'signup'">
            <label for="username">Username</label>
            <input 
              id="username"
              v-model="authForm.username"
              type="text"
              required
              placeholder="Choose your codename"
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email"
              v-model="authForm.email"
              type="email"
              required
              placeholder="Enter your email"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password"
              v-model="authForm.password"
              type="password"
              required
              placeholder="Enter your password"
            />
          </div>

          <div class="form-group" v-if="authMode === 'signup'">
            <label for="team">Choose Your Agency</label>
            <select 
              id="team"
              v-model="authForm.team"
              required
            >
              <option value="">Select your team</option>
              <option v-for="(team, name) in teams" :key="name" :value="name">
                {{ name }} - {{ team.description }}
              </option>
            </select>
          </div>

          <button type="submit" class="submit-btn">
            {{ authMode === 'signin' ? 'Sign In' : 'Create Account' }}
          </button>

          <div class="auth-error" v-if="authError">
            {{ authError }}
          </div>
        </form>
      </div>

      <div class="game-stats" v-if="!userStore.isAuthenticated">
        <div class="stat">
          <div class="stat-value">{{ stats.activePlayers }}</div>
          <div class="stat-label">Active Players</div>
        </div>
        <div class="stat">
          <div class="stat-value">{{ stats.activeAgents }}</div>
          <div class="stat-label">Agents Deployed</div>
        </div>
        <div class="stat">
          <div class="stat-value">{{ stats.totalMissions }}</div>
          <div class="stat-label">Missions Complete</div>
        </div>
      </div>

      <div class="features">
        <div class="feature" v-for="(feature, index) in features" :key="index">
          <div class="feature-icon">{{ feature.icon }}</div>
          <div class="feature-content">
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../state/user'

const router = useRouter()
const userStore = useUserStore()

const authMode = ref('signin')
const authError = ref('')

const authForm = reactive({
  username: '',
  email: '',
  password: '',
  team: ''
})

const teams = {
  CIA: { 
    description: 'Masters of Intelligence Gathering',
    ability: 'EAGLE EYE'
  },
  FSB: { 
    description: 'Experts in Counter-Intelligence',
    ability: 'DOUBLE AGENT'
  },
  MSS: { 
    description: 'Digital Warfare Specialists',
    ability: 'DRAGON EAR'
  },
  MI6: { 
    description: 'Elite Covert Operations',
    ability: 'LICENSE TO SHILL'
  },
  MOSSAD: { 
    description: 'Strategic Deception Experts',
    ability: 'MIRAGE'
  },
  NINJA: { 
    description: 'Shadow Operations Masters',
    ability: 'SHADOW'
  }
}

const stats = reactive({
  activePlayers: Math.floor(Math.random() * 500) + 500,
  activeAgents: Math.floor(Math.random() * 1000) + 1000,
  totalMissions: Math.floor(Math.random() * 5000) + 5000
})

const features = [
  {
    icon: '🎭',
    title: 'Manage Your Agency',
    description: 'Recruit and train elite agents with unique abilities and specializations.'
  },
  {
    icon: '🌐',
    title: 'Global Operations',
    description: 'Deploy agents on covert missions across a dynamic world map.'
  },
  {
    icon: '🤝',
    title: 'Form Alliances',
    description: 'Create strategic partnerships with other players for high-stakes missions.'
  },
  {
    icon: '💰',
    title: 'Season Rewards',
    description: 'Compete for massive intel rewards in seasonal competitions.'
  }
]

const handleAuth = async () => {
  try {
    authError.value = ''
    
    if (authMode.value === 'signin') {
      // Mock sign in - replace with actual auth
      await userStore.setUser({
        id: 1,
        name: authForm.email.split('@')[0],
        email: authForm.email
      })
      router.push('/dashboard')
    } else {
      // Mock sign up - replace with actual auth
      if (!authForm.team) {
        authError.value = 'Please select your team'
        return
      }
      await userStore.setUser({
        id: 1,
        name: authForm.username,
        email: authForm.email
      })
      userStore.setTeam(authForm.team)
      router.push('/dashboard')
    }
  } catch (error) {
    authError.value = error.message || 'Authentication failed'
  }
}
</script>

<style scoped>
.welcome {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.welcome-content {
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.branding {
  text-align: center;
}

.game-title {
  font-size: 5rem;
  font-weight: 900;
  letter-spacing: -2px;
  margin-bottom: 1rem;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.title-part {
  background: linear-gradient(135deg, #fff 0%, #999 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
}

.title-part.accent {
  font-size: 6rem;
  color: #ff3e3e;
  background: linear-gradient(135deg, #ff3e3e 0%, #ff8f8f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(255, 62, 62, 0.3);
  transform: translateY(-0.5rem);
}

.season-title {
  font-size: 1.5rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 4px;
}

.auth-container {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.auth-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tab-btn {
  flex: 1;
  padding: 1rem;
  background: none;
  border: none;
  color: #666;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
}

.tab-btn.active {
  color: #fff;
  border-bottom-color: #ff3e3e;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  color: #888;
  font-size: 0.9rem;
}

input, select {
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: white;
  font-size: 1rem;
}

input:focus, select:focus {
  outline: none;
  border-color: #ff3e3e;
}

.submit-btn {
  padding: 1rem;
  background: #ff3e3e;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: #ff5555;
  transform: translateY(-2px);
}

.auth-error {
  color: #ff3e3e;
  text-align: center;
  font-size: 0.9rem;
}

.game-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
}

.stat {
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #ff3e3e 0%, #ff8f8f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #666;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.9rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 1rem;
}

.feature {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.feature:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.08);
}

.feature-icon {
  font-size: 2rem;
}

.feature-content h3 {
  margin-bottom: 0.5rem;
  color: #fff;
}

.feature-content p {
  color: #888;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .game-title {
    font-size: 3rem;
  }
  
  .title-part.accent {
    font-size: 4rem;
  }
  
  .game-stats {
    flex-direction: column;
    gap: 2rem;
  }
  
  .features {
    grid-template-columns: 1fr;
  }
}
</style> 