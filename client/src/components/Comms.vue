<template>
  <div class="comms">
    <div class="comms-container">
      <!-- Contacts List -->
      <div class="contacts-panel">
        <div class="contacts-header">
          <h2>Contacts</h2>
          <button @click="showNewMessage = true" class="new-message-btn">
            New Message
          </button>
        </div>

        <div class="contacts-list">
          <div 
            v-for="contact in contacts" 
            :key="contact.id"
            class="contact-item"
            :class="{ 
              active: selectedContact?.id === contact.id,
              unread: contact.unreadCount > 0
            }"
            @click="selectContact(contact)"
          >
            <div class="contact-info">
              <span class="contact-name">{{ contact.name }}</span>
              <span class="contact-team">{{ contact.team }}</span>
            </div>
            <div class="contact-meta">
              <span class="last-message-time">{{ formatTime(contact.lastMessage.timestamp) }}</span>
              <span v-if="contact.unreadCount" class="unread-count">
                {{ contact.unreadCount }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Message Thread -->
      <div class="message-panel">
        <template v-if="selectedContact">
          <div class="message-header">
            <div class="contact-details">
              <h2>{{ selectedContact.name }}</h2>
              <span class="contact-team">{{ selectedContact.team }}</span>
            </div>
            <div class="thread-actions">
              <button 
                v-if="!selectedContact.isBlocked"
                @click="blockContact(selectedContact)"
                class="block-btn"
              >
                Block
              </button>
              <button 
                v-else
                @click="unblockContact(selectedContact)"
                class="unblock-btn"
              >
                Unblock
              </button>
            </div>
          </div>

          <div class="message-thread" ref="messageThread">
            <div 
              v-for="message in selectedContact.messages" 
              :key="message.id"
              class="message-item"
              :class="{ outgoing: message.outgoing }"
            >
              <div class="message-content">
                <p>{{ message.content }}</p>
                <span class="message-time">{{ formatTime(message.timestamp) }}</span>
              </div>
            </div>
          </div>

          <div class="message-input">
            <form @submit.prevent="sendMessage">
              <textarea 
                v-model="newMessage"
                placeholder="Type a message..."
                :disabled="selectedContact.isBlocked"
                @keydown.enter.prevent="sendMessage"
              ></textarea>
              <button 
                type="submit"
                :disabled="!newMessage.trim() || selectedContact.isBlocked"
              >
                Send
              </button>
            </form>
          </div>
        </template>

        <div v-else class="no-selection">
          <p>Select a contact to start messaging</p>
        </div>
      </div>
    </div>

    <!-- New Message Modal -->
    <div v-if="showNewMessage" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>New Message</h2>
          <button @click="showNewMessage = false" class="close-btn">&times;</button>
        </div>

        <form @submit.prevent="startNewThread" class="new-message-form">
          <div class="form-group">
            <label for="recipient">Select Recipient</label>
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
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="submit-btn">Send</button>
            <button 
              type="button" 
              @click="showNewMessage = false"
              class="cancel-btn"
            >
              Cancel
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
const selectedContact = ref(null)
const newMessage = ref('')

const newThread = ref({
  recipientId: '',
  message: ''
})

// Mock data for development
const contacts = ref([
  {
    id: 1,
    name: 'Agent Smith',
    team: 'MI6',
    unreadCount: 2,
    isBlocked: false,
    lastMessage: {
      content: 'Operation status?',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    messages: [
      {
        id: 1,
        content: 'Target located in sector 7',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        outgoing: true
      },
      {
        id: 2,
        content: 'Proceeding with surveillance',
        timestamp: new Date(Date.now() - 5400000).toISOString(),
        outgoing: false
      },
      {
        id: 3,
        content: 'Operation status?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        outgoing: false
      }
    ]
  },
  {
    id: 2,
    name: 'Agent Johnson',
    team: 'CIA',
    unreadCount: 0,
    isBlocked: false,
    lastMessage: {
      content: 'Intel package secured',
      timestamp: new Date(Date.now() - 86400000).toISOString()
    },
    messages: [
      {
        id: 1,
        content: 'Package in transit',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        outgoing: false
      },
      {
        id: 2,
        content: 'Acknowledged',
        timestamp: new Date(Date.now() - 129600000).toISOString(),
        outgoing: true
      },
      {
        id: 3,
        content: 'Intel package secured',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        outgoing: false
      }
    ]
  }
])

const availablePlayers = computed(() => [
  { id: 3, name: 'Agent Wilson', team: 'FSB' },
  { id: 4, name: 'Agent Chen', team: 'MSS' },
  { id: 5, name: 'Agent Patel', team: 'MOSSAD' }
])

watch(selectedContact, async () => {
  if (selectedContact.value) {
    selectedContact.value.unreadCount = 0
    await nextTick()
    scrollToBottom()
  }
})

const selectContact = (contact) => {
  selectedContact.value = contact
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
  if (!newMessage.value.trim() || !selectedContact.value) return

  const message = {
    id: Date.now(),
    content: newMessage.value,
    timestamp: new Date().toISOString(),
    outgoing: true
  }

  selectedContact.value.messages.push(message)
  selectedContact.value.lastMessage = {
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

const blockContact = (contact) => {
  contact.isBlocked = true
}

const unblockContact = (contact) => {
  contact.isBlocked = false
}
</script>

<style scoped>
.comms {
  height: calc(100vh - 4rem);
  padding: 2rem;
}

.comms-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  height: 100%;
  background: #2a2a2a;
  border-radius: 1rem;
  overflow: hidden;
}

.contacts-panel {
  background: #333;
  display: flex;
  flex-direction: column;
}

.contacts-header {
  padding: 1.5rem;
  border-bottom: 1px solid #444;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.new-message-btn {
  padding: 0.5rem 1rem;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.new-message-btn:hover {
  background: #ff6666;
}

.contacts-list {
  flex: 1;
  overflow-y: auto;
}

.contact-item {
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #444;
}

.contact-item:hover {
  background: #3a3a3a;
}

.contact-item.active {
  background: #444;
}

.contact-item.unread {
  background: #2a2a2a;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.contact-team {
  color: #888;
  font-size: 0.9rem;
}

.contact-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.last-message-time {
  color: #888;
  font-size: 0.8rem;
}

.unread-count {
  background: #ff4444;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.8rem;
}

.message-panel {
  display: flex;
  flex-direction: column;
  background: #2a2a2a;
}

.message-header {
  padding: 1.5rem;
  border-bottom: 1px solid #444;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.thread-actions {
  display: flex;
  gap: 1rem;
}

.block-btn, .unblock-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.block-btn {
  background: #ff4444;
  color: white;
}

.block-btn:hover {
  background: #ff6666;
}

.unblock-btn {
  background: #444;
  color: white;
}

.unblock-btn:hover {
  background: #555;
}

.message-thread {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 70%;
}

.message-item.outgoing {
  align-self: flex-end;
  align-items: flex-end;
}

.message-content {
  background: #333;
  padding: 1rem;
  border-radius: 1rem;
  border-bottom-left-radius: 0;
}

.message-item.outgoing .message-content {
  background: #ff4444;
  border-radius: 1rem;
  border-bottom-right-radius: 0;
}

.message-time {
  display: block;
  color: #888;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.message-input {
  padding: 1.5rem;
  border-top: 1px solid #444;
}

.message-input form {
  display: flex;
  gap: 1rem;
}

.message-input textarea {
  flex: 1;
  padding: 0.75rem;
  background: #333;
  border: 1px solid #444;
  border-radius: 0.5rem;
  color: white;
  resize: none;
  height: 2.5rem;
  line-height: 1;
}

.message-input button {
  padding: 0 1.5rem;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.message-input button:hover:not(:disabled) {
  background: #ff6666;
}

.message-input button:disabled {
  background: #666;
  cursor: not-allowed;
}

.no-selection {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
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
  color: #888;
}

select, textarea {
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
</style> 