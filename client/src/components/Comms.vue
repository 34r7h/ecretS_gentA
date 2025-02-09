<template>
  <div class="comms">
    <div class="comms-container">
      <div class="contacts-sidebar">
        <div class="chat-header">
          <h2>Players</h2>
          <button @click="showNewMessage = true" class="new-message-btn">
            <i class="fas fa-plus"></i> New Message
          </button>
        </div>

        <div class="chat-modes">
          <button 
            :class="['mode-btn', { active: activeTab === 'players' }]"
            @click="activeTab = 'players'"
          >
            Player Communications
          </button>
          <button 
            :class="['mode-btn', { active: activeTab === 'agents' }]"
            @click="activeTab = 'agents'"
          >
            Agent Surveillance
          </button>
        </div>

        <div class="contacts-list">
          <div 
            v-for="player in players" 
            :key="player.id"
            class="contact-item"
            :class="{ 
              active: selectedPlayer?.id === player.id,
              unread: player.unreadCount > 0,
              allied: player.isAllied
            }"
            @click="selectPlayer(player)"
          >
            <div class="player-avatar" :style="{ background: userStore.teamThemes[player.team].primary }">
              {{ player.name[0].toUpperCase() }}
            </div>
            <div class="player-info">
              <div class="player-header">
                <span class="player-name">{{ player.name }}</span>
                <span class="message-time">{{ formatTime(player.lastMessage.timestamp) }}</span>
              </div>
              <div class="player-subheader">
                <span class="player-team" :style="{ color: userStore.teamThemes[player.team].accent }">
                  {{ player.team }}
                </span>
                <span v-if="player.isAllied" class="alliance-badge">Allied</span>
                <span v-if="player.unreadCount" class="unread-count">
                  {{ player.unreadCount }}
                </span>
              </div>
              <p class="last-message">{{ player.lastMessage.content }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-area">
        <div v-if="activeTab === 'players'" class="messages-container">
          <template v-if="selectedPlayer">
            <div class="message-header">
              <div class="selected-player">
                <div class="player-avatar" :style="{ background: userStore.teamThemes[selectedPlayer.team].primary }">
                  {{ selectedPlayer.name[0].toUpperCase() }}
                </div>
                <div class="player-details">
                  <h2>{{ selectedPlayer.name }}</h2>
                  <span class="player-team" :style="{ color: userStore.teamThemes[selectedPlayer.team].accent }">
                    {{ selectedPlayer.team }}
                  </span>
                </div>
              </div>
              <div class="thread-actions">
                <button 
                  v-if="!selectedPlayer.isBlocked"
                  @click="blockPlayer(selectedPlayer)"
                  class="action-btn block-btn"
                >
                  <i class="fas fa-ban"></i> Block
                </button>
                <button 
                  v-else
                  @click="unblockPlayer(selectedPlayer)"
                  class="action-btn unblock-btn"
                >
                  <i class="fas fa-unlock"></i> Unblock
                </button>
                
                <!-- Alliance Actions -->
                <template v-if="selectedPlayer.allianceStatus === 'none'">
                  <button 
                    class="action-btn alliance-btn"
                    @click="proposeAlliance(selectedPlayer)"
                  >
                    <i class="fas fa-handshake"></i> Propose Alliance
                  </button>
                </template>
                
                <template v-else-if="selectedPlayer.allianceStatus === 'pending'">
                  <button 
                    class="action-btn accept-btn"
                    @click="acceptAlliance(selectedPlayer)"
                  >
                    <i class="fas fa-check"></i> Accept Alliance
                  </button>
                  <button 
                    class="action-btn reject-btn"
                    @click="rejectAlliance(selectedPlayer)"
                  >
                    <i class="fas fa-times"></i> Reject Alliance
                  </button>
                </template>
                
                <template v-else-if="selectedPlayer.allianceStatus === 'active'">
                  <button 
                    class="action-btn break-btn"
                    @click="breakAlliance(selectedPlayer)"
                  >
                    <i class="fas fa-heart-broken"></i> Break Alliance
                  </button>
                </template>
              </div>
            </div>

            <div class="message-thread" ref="messageThread">
              <div 
                v-for="message in selectedPlayer.messages" 
                :key="message.id"
                class="message"
                :class="{ sent: message.outgoing }"
              >
                <div class="message-content" :style="messageStyle(message)">
                  <p>{{ message.content }}</p>
                  <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                </div>
              </div>
            </div>

            <div class="message-input">
              <form @submit.prevent="sendMessage" class="input-form">
                <textarea 
                  v-model="newMessage"
                  placeholder="Type a message..."
                  :disabled="selectedPlayer.isBlocked"
                  @keydown.enter.prevent="sendMessage"
                  class="message-textarea"
                ></textarea>
                <button 
                  type="submit"
                  :disabled="!newMessage.trim() || selectedPlayer.isBlocked"
                  class="send-btn"
                >
                  <i class="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </template>

          <div v-else class="no-selection">
            <i class="fas fa-comments"></i>
            <p>Select a player to start messaging</p>
          </div>
        </div>

        <div v-else class="agent-surveillance">
          <div class="surveillance-header">
            <h2>Agent Communications</h2>
            <div class="surveillance-info">
              Monitoring {{ agentChats.length }} active channels
            </div>
          </div>

          <div class="agent-chats">
            <div v-for="chat in agentChats" :key="chat.id" class="agent-chat-card">
              <div class="chat-header">
                <div class="agents-involved">
                  <div class="agent-tag" :style="{ background: userStore.teamThemes[chat.agent1.team].primary }">
                    {{ chat.agent1.name }} ({{ chat.agent1.team }})
                  </div>
                  <span class="chat-divider">⟷</span>
                  <div class="agent-tag" :style="{ background: userStore.teamThemes[chat.agent2.team].primary }">
                    {{ chat.agent2.name }} ({{ chat.agent2.team }})
                  </div>
                </div>
                <span class="chat-time">{{ formatTime(chat.lastUpdate) }}</span>
              </div>

              <div class="chat-messages">
                <div v-for="message in chat.messages" :key="message.id" class="chat-message">
                  <span class="message-agent">{{ message.agentName }}:</span>
                  <p class="message-text">{{ message.content }}</p>
                  <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                </div>
              </div>

              <div class="chat-footer">
                <span class="chat-status" :class="chat.status">{{ chat.status }}</span>
                <button @click="flagSuspiciousChat(chat)" class="flag-btn">
                  Flag Suspicious
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Message Modal -->
    <div v-if="showNewMessage" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2><i class="fas fa-pen"></i> New Message</h2>
          <button @click="showNewMessage = false" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="startNewThread" class="new-message-form">
          <div class="form-group">
            <label for="recipient">Select Player</label>
            <select 
              id="recipient"
              v-model="newThread.recipientId"
              required
            >
              <option value="">Choose a player</option>
              <option 
                v-for="player in availablePlayers" 
                :key="player.id"
                :value="player.id"
              >
                {{ player.name }} ({{ player.team }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="message">Message</label>
            <textarea 
              id="message"
              v-model="newThread.message"
              rows="3"
              required
              placeholder="Write your message..."
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="submit-btn">
              <i class="fas fa-paper-plane"></i> Send
            </button>
            <button 
              type="button" 
              @click="showNewMessage = false"
              class="cancel-btn"
            >
              <i class="fas fa-times"></i> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useUserStore } from '../state/user'

const userStore = useUserStore()
const messageThread = ref(null)
const showNewMessage = ref(false)
const selectedPlayer = ref(null)
const newMessage = ref('')

const newThread = ref({
  recipientId: '',
  message: ''
})

const activeTab = ref('players')

// Update mock data to reflect player-based alliances
const players = ref([
  {
    id: 1,
    name: 'Sarah Connor',
    team: 'MI6',
    isAllied: true, // This player is allied with the current user
    allianceStatus: 'active', // Can be: 'none', 'pending', 'active', 'rejected'
    unreadCount: 2,
    isBlocked: false,
    lastMessage: {
      content: 'We should coordinate our next operation',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    messages: [
      {
        id: 1,
        content: 'I have intel about a potential data breach',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        outgoing: true
      },
      {
        id: 2,
        content: 'Interesting. My agents could help with the investigation',
        timestamp: new Date(Date.now() - 5400000).toISOString(),
        outgoing: false
      },
      {
        id: 3,
        content: 'We should coordinate our next operation',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        outgoing: false
      }
    ]
  },
  {
    id: 2,
    name: 'Marcus Wright',
    team: 'CIA',
    isAllied: false,
    allianceStatus: 'pending', // This player has a pending alliance request
    unreadCount: 0,
    isBlocked: false,
    lastMessage: {
      content: 'Would you consider forming an alliance?',
      timestamp: new Date(Date.now() - 86400000).toISOString()
    },
    messages: [
      {
        id: 1,
        content: 'Would you consider forming an alliance?',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        outgoing: false
      },
      {
        id: 2,
        content: "I'll think about it. What's in it for both of us?",
        timestamp: new Date(Date.now() - 129600000).toISOString(),
        outgoing: true
      }
    ]
  }
])

const availablePlayers = computed(() => [
  { id: 3, name: 'Elena Petrova', team: 'FSB' },
  { id: 4, name: 'Wei Chen', team: 'MSS' },
  { id: 5, name: 'David Cohen', team: 'MOSSAD' }
])

watch(selectedPlayer, async () => {
  if (selectedPlayer.value) {
    selectedPlayer.value.unreadCount = 0
    await nextTick()
    scrollToBottom()
  }
})

const messageStyle = (message) => {
  if (message.outgoing) {
    return {
      background: userStore.currentTheme.primary,
      borderColor: userStore.currentTheme.accent
    }
  }
  return {
    background: userStore.teamThemes[selectedPlayer.value.team].primary,
    borderColor: userStore.teamThemes[selectedPlayer.value.team].accent
  }
}

const selectPlayer = (player) => {
  selectedPlayer.value = player
}

const scrollToBottom = () => {
  if (messageThread.value) {
    messageThread.value.scrollTop = messageThread.value.scrollHeight
  }
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  if (diff < 86400000) { // Less than 24 hours
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else {
    return date.toLocaleDateString()
  }
}

const sendMessage = () => {
  if (!newMessage.value.trim() || !selectedPlayer.value) return

  const message = {
    id: Date.now(),
    content: newMessage.value,
    timestamp: new Date().toISOString(),
    outgoing: true
  }

  selectedPlayer.value.messages.push(message)
  selectedPlayer.value.lastMessage = {
    content: message.content,
    timestamp: message.timestamp
  }

  newMessage.value = ''
  nextTick(scrollToBottom)
}

const startNewThread = () => {
  // Mock new thread creation
  console.log('Starting new thread:', newThread.value)
  showNewMessage.value = false
  newThread.value = {
    recipientId: '',
    message: ''
  }
}

const blockPlayer = (player) => {
  player.isBlocked = true
}

const unblockPlayer = (player) => {
  player.isBlocked = false
}

const proposeAlliance = (player) => {
  // Check if we can propose an alliance
  if (player.allianceStatus === 'active') {
    console.log('Already allied with:', player.name)
    return
  }
  
  if (player.allianceStatus === 'pending') {
    console.log('Alliance already pending with:', player.name)
    return
  }

  // Send alliance proposal
  const message = {
    id: Date.now(),
    content: '🤝 Alliance Proposal: Would you like to form an alliance? This will allow us to coordinate missions and share intel.',
    timestamp: new Date().toISOString(),
    outgoing: true,
    type: 'alliance_proposal'
  }

  player.messages.push(message)
  player.lastMessage = {
    content: message.content,
    timestamp: message.timestamp
  }
  player.allianceStatus = 'pending'

  // In a real app, this would make an API call to update the alliance status
  console.log('Alliance proposed to:', player.name)
}

const acceptAlliance = (player) => {
  player.isAllied = true
  player.allianceStatus = 'active'
  
  const message = {
    id: Date.now(),
    content: '🤝 Alliance Accepted! We are now allies.',
    timestamp: new Date().toISOString(),
    outgoing: true,
    type: 'alliance_accepted'
  }

  player.messages.push(message)
  player.lastMessage = {
    content: message.content,
    timestamp: message.timestamp
  }

  // In a real app, this would make an API call to update the alliance status
  console.log('Alliance accepted with:', player.name)
}

const rejectAlliance = (player) => {
  player.allianceStatus = 'rejected'
  
  const message = {
    id: Date.now(),
    content: '❌ Alliance Rejected.',
    timestamp: new Date().toISOString(),
    outgoing: true,
    type: 'alliance_rejected'
  }

  player.messages.push(message)
  player.lastMessage = {
    content: message.content,
    timestamp: message.timestamp
  }

  // In a real app, this would make an API call to update the alliance status
  console.log('Alliance rejected with:', player.name)
}

const breakAlliance = (player) => {
  player.isAllied = false
  player.allianceStatus = 'none'
  
  const message = {
    id: Date.now(),
    content: '💔 Alliance Terminated.',
    timestamp: new Date().toISOString(),
    outgoing: true,
    type: 'alliance_broken'
  }

  player.messages.push(message)
  player.lastMessage = {
    content: message.content,
    timestamp: message.timestamp
  }

  // In a real app, this would make an API call to update the alliance status
  console.log('Alliance broken with:', player.name)
}

// Mock agent chat data
const agentChats = ref([
  {
    id: 1,
    agent1: {
      name: 'Agent Smith',
      team: 'MI6'
    },
    agent2: {
      name: 'Agent Johnson',
      team: 'CIA'
    },
    lastUpdate: new Date().toISOString(),
    status: 'active',
    messages: [
      {
        id: 1,
        agentName: 'Agent Smith',
        content: 'Target location confirmed. Proceeding with infiltration.',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 2,
        agentName: 'Agent Johnson',
        content: 'Copy that. I have eyes on the security patrols.',
        timestamp: new Date(Date.now() - 3300000).toISOString()
      }
    ]
  },
  {
    id: 2,
    agent1: {
      name: 'Ghost Protocol',
      team: 'MI6'
    },
    agent2: {
      name: 'Shadow Operative',
      team: 'NINJA'
    },
    lastUpdate: new Date(Date.now() - 1800000).toISOString(),
    status: 'suspicious',
    messages: [
      {
        id: 1,
        agentName: 'Ghost Protocol',
        content: 'Package secured. Meeting at the alternate drop point.',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 2,
        agentName: 'Shadow Operative',
        content: 'Negative. Original location compromised. Switching to contingency alpha.',
        timestamp: new Date(Date.now() - 5400000).toISOString()
      }
    ]
  }
])

const flagSuspiciousChat = (chat) => {
  chat.status = 'flagged'
  // Add notification logic here
}
</script>

<style scoped>
.comms {
  height: 100vh;
  padding: 2rem;
  background: var(--background-color);
}

.comms-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 0;
  height: 100vh;
  background: var(--secondary-color);
}

.contacts-sidebar {
  background: rgba(0, 0, 0, 0.2);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  height: 100%;
  overflow-y: auto;
}

.chat-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
}

.chat-modes {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mode-btn {
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  background: transparent;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mode-btn.active {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.contacts-list {
  padding: 1rem;
}

.contact-item {
  padding: 1rem;
  border-radius: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.contact-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.contact-item.active {
  background: var(--primary-color);
}

.chat-area {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  max-width: 70%;
  padding: 1rem;
  border-radius: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.message.sent {
  align-self: flex-end;
  background: var(--primary-color);
}

.message.received {
  align-self: flex-start;
  background: rgba(0, 0, 0, 0.3);
}

.message-input {
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 1rem;
}

.message-input input {
  flex: 1;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: white;
}

.send-btn {
  padding: 1rem 2rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-btn:hover {
  transform: translateY(-2px);
  background: var(--primary-color);
}

.no-selection {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  gap: 1rem;
}

.no-selection i {
  font-size: 3rem;
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
  background: var(--background-color);
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: var(--text-color);
}

.new-message-form {
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
  color: var(--text-secondary);
  font-weight: 500;
}

select, textarea {
  width: 100%;
  padding: 0.75rem;
  background: var(--secondary-color);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-color);
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
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn {
  background: var(--accent-color);
  color: white;
}

.submit-btn:hover {
  transform: translateY(-1px);
}

.cancel-btn {
  background: var(--secondary-color);
  color: var(--text-color);
}

.cancel-btn:hover {
  background: var(--border-color);
}

.agent-surveillance {
  padding: 2rem;
}

.surveillance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.surveillance-info {
  padding: 0.5rem 1rem;
  background: var(--secondary-color);
  border-radius: 0.5rem;
  font-size: 0.9rem;
}

.agent-chats {
  display: grid;
  gap: 2rem;
}

.agent-chat-card {
  background: var(--secondary-color);
  border-radius: 1rem;
  padding: 1.5rem;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.agents-involved {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.agent-tag {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  color: white;
  font-size: 0.9rem;
}

.chat-divider {
  color: var(--text-secondary);
}

.chat-messages {
  background: var(--background-color);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  max-height: 300px;
  overflow-y: auto;
}

.chat-message {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.message-agent {
  font-weight: bold;
  margin-right: 0.5rem;
}

.message-text {
  margin: 0.5rem 0;
}

.chat-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-status {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.9rem;
}

.chat-status.active {
  background: var(--success-color);
  color: white;
}

.chat-status.suspicious {
  background: var(--warning-color);
  color: white;
}

.chat-status.flagged {
  background: var(--error-color);
  color: white;
}

.flag-btn {
  padding: 0.5rem 1rem;
  background: var(--error-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.alliance-badge {
  padding: 0.25rem 0.5rem;
  background: var(--success-color);
  color: white;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.alliance-badge i {
  font-size: 0.9rem;
}

/* Message types */
.message-content.alliance_proposal,
.message-content.alliance_accepted,
.message-content.alliance_rejected,
.message-content.alliance_broken {
  border-width: 2px;
}

.message-content.alliance_proposal {
  border-color: var(--success-color);
}

.message-content.alliance_accepted {
  border-color: var(--success-color);
  background: rgba(var(--success-color-rgb), 0.1);
}

.message-content.alliance_rejected {
  border-color: var(--error-color);
}

.message-content.alliance_broken {
  border-color: var(--warning-color);
}

.player-item.allied {
  border-left: 3px solid var(--success-color);
}
</style> 