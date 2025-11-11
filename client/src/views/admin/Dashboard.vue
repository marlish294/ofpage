<template>
  <div style="min-height: 100vh; background-color: #ffffff;" class="container-fluid py-4">
    <div class="container">
      <div class="row mb-4">
        <div class="col-12">
          <h2 style="color: #1a1a1a; font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">
            <i class="fas fa-crown me-2" style="color: #00aff0;"></i>
            Admin Dashboard
          </h2>
          <p style="color: #666666; font-size: 1rem; margin-bottom: 2rem;">Platform overview and management</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row mb-4">
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card stats-card" style="border: 2px solid #e0e0e0; border-radius: 12px; transition: all 0.2s ease;" @mouseover="e => { e.currentTarget.style.borderColor = '#00aff0'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 175, 240, 0.15)'; }" @mouseout="e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.boxShadow = 'none'; }">
            <div class="card-body text-center">
              <i class="fas fa-dollar-sign fa-2x mb-2" style="color: #00aff0;"></i>
              <h3 class="mb-1" style="color: #1a1a1a; font-weight: 700;">${{ (stats.totalRevenue || 0).toFixed(2) }}</h3>
              <p class="mb-0" style="color: #666666; margin: 0;">Total Revenue</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card stats-card" style="border: 2px solid #e0e0e0; border-radius: 12px; transition: all 0.2s ease;" @mouseover="e => { e.currentTarget.style.borderColor = '#00aff0'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 175, 240, 0.15)'; }" @mouseout="e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.boxShadow = 'none'; }">
            <div class="card-body text-center">
              <i class="fas fa-users fa-2x mb-2" style="color: #00aff0;"></i>
              <h3 class="mb-1" style="color: #1a1a1a; font-weight: 700;">{{ stats.totalSubscribers || 0 }}</h3>
              <p class="mb-0" style="color: #666666; margin: 0;">Total Subscribers</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card stats-card" style="border: 2px solid #e0e0e0; border-radius: 12px; transition: all 0.2s ease;" @mouseover="e => { e.currentTarget.style.borderColor = '#00aff0'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 175, 240, 0.15)'; }" @mouseout="e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.boxShadow = 'none'; }">
            <div class="card-body text-center">
              <i class="fas fa-user-tie fa-2x mb-2" style="color: #00aff0;"></i>
              <h3 class="mb-1" style="color: #1a1a1a; font-weight: 700;">{{ stats.totalManagers || 0 }}</h3>
              <p class="mb-0" style="color: #666666; margin: 0;">Active Managers</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card stats-card" style="border: 2px solid #e0e0e0; border-radius: 12px; transition: all 0.2s ease;" @mouseover="e => { e.currentTarget.style.borderColor = '#00aff0'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 175, 240, 0.15)'; }" @mouseout="e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.boxShadow = 'none'; }">
            <div class="card-body text-center">
              <i class="fas fa-star fa-2x mb-2" style="color: #00aff0;"></i>
              <h3 class="mb-1" style="color: #1a1a1a; font-weight: 700;">{{ stats.totalModels || 0 }}</h3>
              <p class="mb-0" style="color: #666666; margin: 0;">Active Models</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Approvals -->
      <div class="row">
        <div class="col-lg-6">
          <div class="card" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); margin-bottom: 1.5rem;">
            <div class="card-header d-flex justify-content-between align-items-center" style="background-color: #ffffff; border-bottom: 1px solid #e0e0e0; padding: 1.25rem 1.5rem; border-radius: 12px 12px 0 0;">
              <h5 class="mb-0" style="color: #1a1a1a; font-weight: 700;">
                <i class="fas fa-clock me-2" style="color: #00aff0;"></i>
                Pending Manager Approvals
              </h5>
              <span class="badge" style="background-color: #F7C948; color: #1a1a1a; border-radius: 6px; padding: 0.375rem 0.75rem; font-weight: 500;">{{ pendingManagers.length }}</span>
            </div>
            <div class="card-body" style="padding: 1.5rem;">
              <div v-if="pendingManagers.length === 0" class="text-center text-muted py-3">
                <i class="fas fa-check-circle fa-2x mb-2"></i>
                <p class="mb-0">No pending approvals</p>
              </div>
              <div v-else>
                <div
                  v-for="manager in pendingManagers"
                  :key="manager.id"
                  class="d-flex justify-content-between align-items-center mb-3 p-2 border rounded"
                >
                  <div>
                    <h6 class="mb-0">{{ manager.user.email }}</h6>
                    <small class="text-muted">
                      Applied {{ formatDate(manager.createdAt) }}
                    </small>
                  </div>
                  <div>
                    <button
                      class="btn btn-sm me-2"
                      @click="approveManager(manager.id)"
                      style="background-color: #00c78b; border-color: #00c78b; color: #ffffff; font-weight: 600; border-radius: 8px; padding: 0.5rem 1rem; transition: all 0.2s ease;"
                      @mouseover="e => e.target.style.backgroundColor = '#00a675'"
                      @mouseout="e => e.target.style.backgroundColor = '#00c78b'"
                    >
                      <i class="fas fa-check me-1"></i>
                      Approve
                    </button>
                    <button
                      class="btn btn-sm"
                      @click="rejectManager(manager.id)"
                      style="background-color: #ff4d6d; border-color: #ff4d6d; color: #ffffff; font-weight: 600; border-radius: 8px; padding: 0.5rem 1rem; transition: all 0.2s ease;"
                      @mouseover="e => e.target.style.backgroundColor = '#ff2d55'"
                      @mouseout="e => e.target.style.backgroundColor = '#ff4d6d'"
                    >
                      <i class="fas fa-times me-1"></i>
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="col-lg-6">
          <div class="card live-activity-card" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); margin-bottom: 1.5rem; position: relative; top: -8px;">
            <div class="card-header d-flex justify-content-between align-items-center" style="background-color: #ffffff; border-bottom: 1px solid #e0e0e0; padding: 1.25rem 1.5rem; border-radius: 12px 12px 0 0;">
              <h5 class="mb-0" style="color: #1a1a1a; font-weight: 700;">
                <i class="fas fa-bolt me-2" style="color: #00aff0;"></i>
                Live Activity
              </h5>
              <span class="live-indicator" :class="{ online: socketConnected }" style="position: relative; top: -2px;">
                <span class="dot"></span>
                {{ socketConnected ? 'Live' : 'Offline' }}
              </span>
            </div>
            <div class="card-body activity-body" style="padding: 1.5rem;">
              <div v-if="activityLoading" class="text-center py-4 text-muted">
                <span class="spinner-border text-primary" role="status"></span>
                <p class="mt-3 mb-0">Connecting to live feed...</p>
              </div>
              <div v-else-if="activityEvents.length === 0" class="text-center text-muted py-4">
                <i class="fas fa-compass fa-2x mb-2"></i>
                <p class="mb-0">No activity yet. Events appear here in real time.</p>
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
                    <div class="activity-meta">{{ formatEventTime(event.timestamp) }}</div>
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

export default {
  name: 'AdminDashboard',
  data() {
    return {
      stats: {},
      pendingManagers: [],
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
      this.fetchPendingManagers()
    ])

    await this.initializeActivityFeed()

    // Listen for refresh event from navbar
    window.addEventListener('refresh-admin-stats', this.refreshStats)
  },

  beforeUnmount() {
    window.removeEventListener('refresh-admin-stats', this.refreshStats)
    this.cleanupActivityFeed()
  },
  methods: {
    async fetchStats() {
      try {
        const response = await api.get('/admin/dashboard')
        this.stats = response.data.stats
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    },

    async fetchPendingManagers() {
      try {
        const response = await api.get('/admin/pending-managers')
        this.pendingManagers = response.data.pendingManagers
      } catch (error) {
        console.error('Error fetching pending managers:', error)
      }
    },

    async initializeActivityFeed() {
      try {
        this.activityLoading = true
        await this.fetchActivityEvents()
      } catch (error) {
        console.error('Error initializing activity feed:', error)
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
        const response = await api.get('/admin/activity-events')
        const events = Array.isArray(response.data?.events) ? response.data.events : []
        this.activityEvents = events
          .map(this.normalizeEvent)
          .sort((a, b) => b.timestamp - a.timestamp)
        this.pruneActivityEvents()
      } catch (error) {
        console.error('Error fetching activity events:', error)
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

      this.socket.on('admin_event', this.handleAdminEvent)
    },

    cleanupActivityFeed() {
      if (this.socket) {
        this.socket.off('admin_event', this.handleAdminEvent)
        this.socket.disconnect()
        this.socket = null
      }
      if (this.activityIntervalId) {
        clearInterval(this.activityIntervalId)
        this.activityIntervalId = null
      }
      this.socketConnected = false
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

    handleAdminEvent(event) {
      if (!event) return
      const normalized = this.normalizeEvent(event)
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

    pruneActivityEvents() {
      const cutoff = Date.now() - EVENT_TTL_MS
      this.activityEvents = this.activityEvents
        .filter(event => event.timestamp >= cutoff)
        .sort((a, b) => b.timestamp - a.timestamp)
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

    async approveManager(managerId) {
      try {
        await api.post(`/admin/approve-manager/${managerId}`)
        this.$swal({
          icon: 'success',
          title: 'Manager Approved!',
          text: 'The manager has been approved and can now access their dashboard.',
          confirmButtonText: 'Great!'
        })
        await Promise.all([
          this.fetchPendingManagers(),
          this.fetchStats()
        ])
      } catch (error) {
        console.error('Error approving manager:', error)
        this.$swal({
          icon: 'error',
          title: 'Approval Failed',
          text: 'Failed to approve manager. Please try again.',
          confirmButtonText: 'OK'
        })
      }
    },

    async rejectManager(managerId) {
      const result = await this.$swal({
        icon: 'warning',
        title: 'Reject Manager',
        text: 'Are you sure you want to reject this manager? This will delete their account permanently.',
        showCancelButton: true,
        confirmButtonText: 'Yes, reject it!',
        cancelButtonText: 'Cancel'
      })

      if (result.isConfirmed) {
        try {
          await api.delete(`/admin/reject-manager/${managerId}`)

          this.$swal({
            icon: 'success',
            title: 'Manager Rejected!',
            text: 'The manager has been rejected and their account has been deleted.',
            confirmButtonText: 'OK'
          })

          await Promise.all([
            this.fetchPendingManagers(),
            this.fetchStats()
          ])
        } catch (error) {
          console.error('Error rejecting manager:', error)
          this.$swal({
            icon: 'error',
            title: 'Rejection Failed',
            text: 'Failed to reject manager. Please try again.',
            confirmButtonText: 'OK'
          })
        }
      }
    },

    async refreshStats() {
      try {
        await Promise.all([
          this.fetchStats(),
          this.fetchPendingManagers(),
          this.fetchActivityEvents()
        ])

        this.$swal({
          icon: 'success',
          title: 'Stats Refreshed!',
          text: 'Dashboard statistics have been updated.',
          confirmButtonText: 'OK'
        })
      } catch (error) {
        console.error('Error refreshing stats:', error)
        this.$swal({
          icon: 'error',
          title: 'Refresh Failed',
          text: 'Failed to refresh statistics. Please try again.',
          confirmButtonText: 'OK'
        })
      }
    },

    formatDate(timestamp) {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date

      if (diff < 86400000) { // Less than 1 day
        return 'today'
      } else if (diff < 172800000) { // Less than 2 days
        return 'yesterday'
      } else {
        return date.toLocaleDateString()
      }
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
  color: #666666;
}

.live-indicator.online {
  background-color: rgba(0, 199, 139, 0.12);
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
  gap: 1rem;
  align-items: flex-start;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
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
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.activity-description {
  color: #4a4a4a;
  margin-bottom: 0.35rem;
}

.activity-meta {
  font-size: 0.82rem;
  color: #8a96a3;
}
</style>
