<template>
  <div style="min-height: 100vh; background-color: #ffffff;" class="container-fluid py-4">
    <div class="container">
      <div class="row mb-4">
        <div class="col-12">
          <h2 style="color: #1a1a1a; font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">
            <i class="fas fa-tachometer-alt me-2" style="color: #00aff0;"></i>
            Manager Dashboard
          </h2>
          <p style="color: #666666; font-size: 1rem; margin-bottom: 2rem;">Manage your model and track performance</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row mb-4">
        <div class="col-lg-4 col-md-6 mb-3">
          <div class="card stats-card" style="border: 2px solid #e0e0e0; border-radius: 12px; transition: all 0.2s ease;" @mouseover="e => { e.currentTarget.style.borderColor = '#00aff0'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 175, 240, 0.15)'; }" @mouseout="e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.boxShadow = 'none'; }">
            <div class="card-body text-center">
              <i class="fas fa-users fa-2x mb-2" style="color: #00aff0;"></i>
              <h3 class="mb-1" style="color: #1a1a1a; font-weight: 700;">{{ stats.activeSubscriptions || 0 }}</h3>
              <p class="mb-0" style="color: #666666; margin: 0;">Active Subscribers</p>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6 mb-3">
          <div class="card stats-card" style="border: 2px solid #e0e0e0; border-radius: 12px; transition: all 0.2s ease;" @mouseover="e => { e.currentTarget.style.borderColor = '#00aff0'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 175, 240, 0.15)'; }" @mouseout="e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.boxShadow = 'none'; }">
            <div class="card-body text-center">
              <i class="fas fa-dollar-sign fa-2x mb-2" style="color: #00aff0;"></i>
              <h3 class="mb-1" style="color: #1a1a1a; font-weight: 700;">${{ (stats.totalRevenue || 0).toFixed(2) }}</h3>
              <p class="mb-0" style="color: #666666; margin: 0;">Total Revenue</p>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6 mb-3">
          <div class="card stats-card" style="border: 2px solid #e0e0e0; border-radius: 12px; transition: all 0.2s ease;" @mouseover="e => { e.currentTarget.style.borderColor = '#00aff0'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 175, 240, 0.15)'; }" @mouseout="e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.boxShadow = 'none'; }">
            <div class="card-body text-center">
              <i class="fas fa-chart-line fa-2x mb-2" style="color: #00aff0;"></i>
              <h3 class="mb-1" style="color: #1a1a1a; font-weight: 700;">{{ stats.recentSubscriptions || 0 }}</h3>
              <p class="mb-0" style="color: #666666; margin: 0;">New This Month</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Model Overview & Recent Activity -->
      <div class="row">
        <div class="col-lg-8">
          <div class="card" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); margin-bottom: 1.5rem;">
            <div class="card-header d-flex justify-content-between align-items-center" style="background-color: #ffffff; border-bottom: 1px solid #e0e0e0; padding: 1.25rem 1.5rem; border-radius: 12px 12px 0 0;">
              <h5 class="mb-0" style="color: #1a1a1a; font-weight: 700;">
                <i class="fas fa-user me-2" style="color: #00aff0;"></i>
                Model Overview
              </h5>
              <router-link to="/manager/model" class="btn btn-sm" style="background-color: transparent; border: 2px solid #00aff0; color: #00aff0; font-weight: 600; border-radius: 8px; padding: 0.5rem 1rem; transition: all 0.2s ease; text-decoration: none;" @mouseover="e => { e.target.style.backgroundColor = '#00aff0'; e.target.style.color = '#ffffff'; }" @mouseout="e => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#00aff0'; }">
                <i class="fas fa-edit me-1"></i>
                Edit
              </router-link>
            </div>
            <div class="card-body" style="padding: 1.5rem;">
              <div v-if="modelLoading" class="text-center py-3">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              <div v-else-if="!model" class="text-center py-5">
                <i class="fas fa-user-plus fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">No model created yet</h4>
                <p class="text-muted">Create your model profile to get started</p>
                <router-link to="/manager/model" class="btn" style="background-color: #00aff0; border-color: #00aff0; color: #ffffff; font-weight: 600; border-radius: 8px; padding: 0.75rem 1.5rem; transition: all 0.2s ease; text-decoration: none; display: inline-block;" @mouseover="e => e.target.style.backgroundColor = '#0091ea'" @mouseout="e => e.target.style.backgroundColor = '#00aff0'">
                  <i class="fas fa-plus me-2"></i>
                  Create Model
                </router-link>
              </div>
              <div v-else class="row">
                <div class="col-md-4">
                  <img
                    :src="model.photoUrl || 'https://via.placeholder.com/200x300'"
                    class="img-fluid rounded"
                    :alt="`${model.name} ${model.surname}`"
                  />
                </div>
                <div class="col-md-8">
                  <h4>{{ model.name }} {{ model.surname }}</h4>
                  <p class="text-muted">{{ model.age }} years old • {{ model.hairColor }} hair • {{ model.skinColor }} skin</p>
                  <p>{{ model.bio }}</p>
                  <div class="row">
                    <div class="col-sm-6">
                      <strong>Plans:</strong> {{ model.plans.length }}
                    </div>
                    <div class="col-sm-6">
                      <strong>Status:</strong>
                      <span class="badge bg-success ms-1">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="col-lg-4">
          <div class="card live-activity-card" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); margin-bottom: 1.5rem; position: relative; top: 9px;">
            <div class="card-header d-flex justify-content-between align-items-center" style="background-color: #ffffff; border-bottom: 1px solid #e0e0e0; padding: 1.25rem 1.5rem; border-radius: 12px 12px 0 0;">
              <h5 class="mb-0" style="color: #1a1a1a; font-weight: 700;">
                <i class="fas fa-bolt me-2" style="color: #00aff0;"></i>
                Live Activity
              </h5>
              <span class="live-indicator" :class="{ online: socketConnected }">
                <span class="dot"></span>
                {{ socketConnected ? 'Live' : 'Offline' }}
              </span>
            </div>
            <div class="card-body activity-body" style="padding: 1.5rem;">
              <div v-if="activityLoading" class="text-center py-4 text-muted">
                <span class="spinner-border text-primary" role="status"></span>
                <p class="mt-3 mb-0">Connecting to live feed...</p>
              </div>
              <div v-else-if="limitedActivityEvents.length === 0" class="text-center text-muted py-4">
                <i class="fas fa-inbox fa-2x mb-2"></i>
                <p class="mb-0">No live activity yet. New events will appear here.</p>
              </div>
              <div v-else class="activity-feed">
                <div
                  v-for="event in limitedActivityEvents"
                  :key="event.id"
                  class="activity-event"
                >
                  <div class="activity-icon" :style="{ backgroundColor: event.color || '#00aff0' }">
                    <i :class="event.icon || 'fas fa-info-circle'"></i>
                  </div>
                  <div class="activity-content">
                    <div class="activity-title">{{ event.title }}</div>
                    <div class="activity-description">{{ event.description }}</div>
                    <div class="activity-meta">
                      <span v-if="event.type === 'media.unlocked' && event?.data?.amount" class="text-success fw-semibold me-2">
                        +${{ formatCurrency(event.data.amount) }}
                      </span>
                      {{ formatEventTime(event.timestamp) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '../../services/api'
import { io } from 'socket.io-client'

const EVENT_TTL_MS = 30 * 60 * 1000
const ALLOWED_MANAGER_EVENT_TYPES = ['subscription.created', 'media.unlocked']

export default {
  name: 'ManagerDashboard',
  data() {
    return {
      stats: {},
      model: null,
      modelLoading: true,
      activityEvents: [],
      activityLoading: false,
      socket: null,
      socketConnected: false,
      activityIntervalId: null
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
    limitedActivityEvents() {
      return this.activityEvents.slice(0, 20)
    }
  },
  async mounted() {
    await Promise.all([
      this.fetchStats(),
      this.fetchModel()
    ])

    await this.initializeActivityFeed()

    // Listen for refresh event from navbar
    window.addEventListener('refresh-manager-stats', this.refreshStats)
  },
  
  beforeUnmount() {
    window.removeEventListener('refresh-manager-stats', this.refreshStats)
    this.cleanupActivityFeed()
  },
  methods: {
    async fetchStats() {
      try {
        const response = await api.get('/manager/dashboard')
        this.stats = response.data.stats
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    },

    async fetchModel() {
      try {
        this.modelLoading = true
        const response = await api.get('/manager/model')
        this.model = response.data.model
      } catch (error) {
        console.error('Error fetching model:', error)
      } finally {
        this.modelLoading = false
      }
    },

    async initializeActivityFeed() {
      try {
        this.activityLoading = true
        await this.fetchActivityEvents()
      } catch (error) {
        console.error('Error initializing manager activity feed:', error)
      } finally {
        this.activityLoading = false
        this.connectSocket()
        if (!this.activityIntervalId) {
          this.activityIntervalId = setInterval(() => this.pruneActivityEvents(), 60000)
        }
      }
    },

    async fetchActivityEvents() {
      try {
        const response = await api.get('/manager/activity-events')
        const events = Array.isArray(response.data?.events) ? response.data.events : []
        this.activityEvents = events
          .map(this.normalizeEvent)
          .filter(this.shouldDisplayEvent)
          .sort((a, b) => b.timestamp - a.timestamp)
        this.pruneActivityEvents()
      } catch (error) {
        console.error('Error fetching manager activity events:', error)
      }
    },

    connectSocket() {
      if (this.socket) return
      const token = localStorage.getItem('token')
      if (!token) return

      this.socket = io('http://localhost:3000', {
        auth: { token },
        transports: ['websocket', 'polling']
      })

      this.socket.on('connect', () => {
        this.socketConnected = true
      })

      this.socket.on('disconnect', () => {
        this.socketConnected = false
      })

      this.socket.on('manager_event', this.handleManagerEvent)
    },

    cleanupActivityFeed() {
      if (this.socket) {
        this.socket.off('manager_event', this.handleManagerEvent)
        this.socket.disconnect()
        this.socket = null
      }
      this.socketConnected = false
      if (this.activityIntervalId) {
        clearInterval(this.activityIntervalId)
        this.activityIntervalId = null
      }
    },

    handleManagerEvent(event) {
      if (!event) return
      const normalized = this.normalizeEvent(event)
      if (!this.shouldDisplayEvent(normalized)) return

      const existingIndex = this.activityEvents.findIndex(item => item.id === normalized.id)
      if (existingIndex !== -1) {
        this.activityEvents.splice(existingIndex, 1, normalized)
      } else {
        this.activityEvents.unshift(normalized)
        if (this.activityEvents.length > 100) {
          this.activityEvents.splice(100)
        }
      }

      this.pruneActivityEvents()
    },

    normalizeEvent(event = {}) {
      const timestamp = Number(event.timestamp) || Date.now()
      return {
        id: event.id || `${timestamp}-${Math.random().toString(36).slice(2)}`,
        type: event.type || 'general',
        title: event.title || 'Activity',
        description: event.description || '',
        icon: event.icon || 'fas fa-info-circle',
        color: event.color || '#00aff0',
        data: event.data || {},
        timestamp
      }
    },

    shouldDisplayEvent(event) {
      return ALLOWED_MANAGER_EVENT_TYPES.includes(event.type)
    },

    pruneActivityEvents() {
      const cutoff = Date.now() - EVENT_TTL_MS
      this.activityEvents = this.activityEvents
        .filter(event => event.timestamp >= cutoff)
        .sort((a, b) => b.timestamp - a.timestamp)
    },

    async refreshStats() {
      await Promise.all([
        this.fetchStats(),
        this.fetchActivityEvents()
      ])
    },

    showSettings() {
      // TODO: Implement settings modal
      this.$swal({
        icon: 'info',
        title: 'Settings',
        text: 'Settings functionality coming soon!',
        confirmButtonText: 'OK'
      })
    },

    formatEventTime(timestamp) {
      if (!timestamp) return ''
      const diffMs = Date.now() - timestamp
      if (diffMs < 60000) {
        return 'just now'
      }
      const minutes = Math.floor(diffMs / 60000)
      if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
      }
      const hours = Math.floor(minutes / 60)
      if (hours < 24) {
        return `${hours} hour${hours === 1 ? '' : 's'} ago`
      }
      const days = Math.floor(hours / 24)
      return `${days} day${days === 1 ? '' : 's'} ago`
    },

    formatCurrency(value) {
      const amount = Number(value)
      if (Number.isNaN(amount)) return '0.00'
      return amount.toFixed(2)
    }
  }
}
</script>

<style scoped>
.live-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background-color: rgba(0, 0, 0, 0.05);
  color: #64748b;
}

.live-indicator.online {
  background-color: rgba(0, 199, 139, 0.14);
  color: #00c78b;
}

.live-indicator .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: currentColor;
}

.activity-body {
  max-height: 420px;
  display: flex;
  flex-direction: column;
}

.activity-feed {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  max-height: 360px;
  padding-right: 0.25rem;
}

.activity-event {
  display: flex;
  gap: 0.9rem;
  align-items: flex-start;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.activity-event:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.1rem;
  flex-shrink: 0;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.12);
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.2rem;
}

.activity-description {
  color: #475569;
  margin-bottom: 0.35rem;
}

.activity-meta {
  font-size: 0.78rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
}
</style>
