<template>
  <div class="app-container">
    <nav v-if="userStore.isAuthenticated" class="main-nav">
      <router-link to="/dashboard" class="nav-item">
        <span class="icon">📊</span>
        Dashboard
      </router-link>
      <router-link to="/missions" class="nav-item">
        <span class="icon">🎯</span>
        Missions
      </router-link>
      <router-link to="/outcomes" class="nav-item">
        <span class="icon">📜</span>
        Outcomes
      </router-link>
      <router-link to="/agent" class="nav-item">
        <span class="icon">🕵️</span>
        Agents
      </router-link>
      <router-link to="/assets" class="nav-item">
        <span class="icon">🛠️</span>
        Assets
      </router-link>
      <router-link to="/profile" class="nav-item">
        <span class="icon">👤</span>
        Profile
      </router-link>
      <router-link to="/comms" class="nav-item">
        <span class="icon">💬</span>
        Comms
        <span v-if="userStore.unreadMessages" class="badge">
          {{ userStore.unreadMessages }}
        </span>
      </router-link>
    </nav>

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <div v-if="gameStore.phaseTimeRemaining > 0" class="phase-timer">
      Phase: {{ gameStore.currentPhase }} - Time Remaining: {{ formatTime(gameStore.phaseTimeRemaining) }}
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from './state/user'
import { useGameStore } from './state/game'

const userStore = useUserStore()
const gameStore = useGameStore()

const formatTime = (ms) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
</script>

<style>
.app-container {
  min-height: 100vh;
  background: #1a1a1a;
  color: #fff;
  display: flex;
}

.main-nav {
  width: 200px;
  background: #2a2a2a;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  text-decoration: none;
  color: #fff;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.nav-item:hover {
  background: #3a3a3a;
}

.nav-item.router-link-active {
  background: #4a4a4a;
}

.icon {
  font-size: 1.2rem;
}

.badge {
  background: #ff4444;
  color: white;
  border-radius: 50%;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  margin-left: auto;
}

.main-content {
  flex: 1;
  margin-left: 200px;
  min-height: 100vh;
  position: relative;
}

.phase-timer {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-family: monospace;
  z-index: 100;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  background: #1a1a1a;
  color: #fff;
}

h1, h2, h3, h4, h5, h6 {
  margin-bottom: 1rem;
}

button {
  cursor: pointer;
}

input, textarea, select {
  font-family: inherit;
}
</style>
