import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    team: null,
    wallet: null,
    messages: [], // Private messages
    alliances: [], // Alliance requests and active alliances
    assets: [], // Player's available assets
    notifications: [],
    teamThemes: {
      CIA: {
        primary: '#1a73e8',
        secondary: '#174ea6',
        accent: '#47c1ff',
        background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
        mapStyle: 'satellite'
      },
      FSB: {
        primary: '#e53935',
        secondary: '#c62828',
        accent: '#ff6b6b',
        background: 'linear-gradient(135deg, #b71c1c 0%, #d32f2f 100%)',
        mapStyle: 'soviet'
      },
      MSS: {
        primary: '#d32f2f',
        secondary: '#b71c1c',
        accent: '#ffd700',
        background: 'linear-gradient(135deg, #831010 0%, #c62828 100%)',
        mapStyle: 'dragon'
      },
      MI6: {
        primary: '#1e3d59',
        secondary: '#102a43',
        accent: '#00b4d8',
        background: 'linear-gradient(135deg, #0a1929 0%, #1a365d 100%)',
        mapStyle: 'classic'
      },
      MOSSAD: {
        primary: '#0288d1',
        secondary: '#01579b',
        accent: '#29b6f6',
        background: 'linear-gradient(135deg, #014361 0%, #0277bd 100%)',
        mapStyle: 'desert'
      },
      NINJA: {
        primary: '#212121',
        secondary: '#121212',
        accent: '#f44336',
        background: 'linear-gradient(135deg, #000000 0%, #212121 100%)',
        mapStyle: 'shadow'
      }
    }
  }),

  getters: {
    isAuthenticated: (state) => !!state.currentUser,
    
    getTeamAbility: (state) => {
      if (!state.team) return null
      const abilities = {
        CIA: { 
          name: 'EAGLE EYE', 
          description: '+25% Intel tokens for successful missions for 3 turns',
          cooldown: 3
        },
        FSB: { 
          name: 'DOUBLE AGENT', 
          description: 'Steals a target agent from another team',
          cooldown: 1
        },
        MSS: { 
          name: 'DRAGON EAR', 
          description: 'Gains access to a player\'s comms for 1 turn',
          cooldown: 1
        },
        MI6: { 
          name: 'LICENSE TO SHILL', 
          description: 'Able to kill a target agent of another team',
          cooldown: 1
        },
        MOSSAD: { 
          name: 'MIRAGE', 
          description: 'Creates fake INTEL TOKENS to ambush SECRET AGENTS',
          cooldown: 1
        },
        NINJA: { 
          name: 'SHADOW', 
          description: 'Obscures all comms for entire team for 2 turns',
          cooldown: 2
        }
      }
      return abilities[state.team]
    },

    currentTheme: (state) => {
      return state.team ? state.teamThemes[state.team] : state.teamThemes.NINJA
    },

    unreadMessages: (state) => {
      return state.messages.filter(msg => !msg.read).length
    }
  },

  actions: {
    setUser(userData) {
      this.currentUser = userData
    },

    setTeam(team) {
      this.team = team
      // Apply team theme to CSS variables
      const theme = this.teamThemes[team]
      document.documentElement.style.setProperty('--primary-color', theme.primary)
      document.documentElement.style.setProperty('--secondary-color', theme.secondary)
      document.documentElement.style.setProperty('--accent-color', theme.accent)
      document.documentElement.style.setProperty('--background', theme.background)
      document.documentElement.style.setProperty('--text-color', '#ffffff')
      document.documentElement.style.setProperty('--text-secondary', 'rgba(255, 255, 255, 0.7)')
      document.documentElement.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.1)')
      document.documentElement.style.setProperty('--error-color', '#f44336')
      document.documentElement.style.setProperty('--warning-color', '#ff9800')
      document.documentElement.style.setProperty('--success-color', '#4caf50')
      document.documentElement.style.setProperty('--info-color', '#2196f3')
    },

    setWallet(wallet) {
      this.wallet = wallet
    },

    addMessage(message) {
      this.messages.push({
        ...message,
        read: false,
        timestamp: new Date().toISOString()
      })
    },

    markMessageRead(messageId) {
      const message = this.messages.find(m => m.id === messageId)
      if (message) {
        message.read = true
      }
    },

    requestAlliance(targetUserId) {
      this.alliances.push({
        id: Date.now(),
        targetUserId,
        status: 'pending',
        timestamp: new Date().toISOString()
      })
    },

    updateAllianceStatus(allianceId, status) {
      const alliance = this.alliances.find(a => a.id === allianceId)
      if (alliance) {
        alliance.status = status
      }
    },

    addAsset(asset) {
      this.assets.push(asset)
    },

    removeAsset(assetId) {
      this.assets = this.assets.filter(a => a.id !== assetId)
    },

    addNotification(notification) {
      this.notifications.push({
        ...notification,
        id: Date.now(),
        read: false,
        timestamp: new Date().toISOString()
      })
    },

    clearNotification(notificationId) {
      this.notifications = this.notifications.filter(n => n.id !== notificationId)
    }
  }
}) 