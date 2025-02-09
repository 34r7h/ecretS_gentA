import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    team: null,
    wallet: null,
    messages: [], // Private messages
    alliances: [], // Alliance requests and active alliances
    assets: [], // Player's available assets
    notifications: []
  }),

  getters: {
    isAuthenticated: (state) => !!state.currentUser,
    
    getTeamAbility: (state) => {
      if (!state.team) return null
      const abilities = {
        CIA: { name: 'EAGLE EYE', cooldown: 3 },
        FSB: { name: 'DOUBLE AGENT', cooldown: 1 },
        MSS: { name: 'DRAGON EAR', cooldown: 1 },
        MI6: { name: 'LICENSE TO SHILL', cooldown: 1 },
        MOSSAD: { name: 'MIRAGE', cooldown: 1 },
        NINJA: { name: 'SHADOW', cooldown: 2 }
      }
      return abilities[state.team]
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