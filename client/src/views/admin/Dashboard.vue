<template>
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <div class="col-12">
        <h2>
          <i class="fas fa-crown me-2"></i>
          Admin Dashboard
        </h2>
        <p class="text-muted">Platform overview and management</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row mb-4">
      <div class="col-lg-3 col-md-6 mb-3">
        <div class="card stats-card">
          <div class="card-body text-center">
            <i class="fas fa-dollar-sign fa-2x mb-2"></i>
            <h3 class="mb-1">${{ (stats.totalRevenue || 0).toFixed(2) }}</h3>
            <p class="mb-0">Total Revenue</p>
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-6 mb-3">
        <div class="card stats-card">
          <div class="card-body text-center">
            <i class="fas fa-users fa-2x mb-2"></i>
            <h3 class="mb-1">{{ stats.totalSubscribers || 0 }}</h3>
            <p class="mb-0">Total Subscribers</p>
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-6 mb-3">
        <div class="card stats-card">
          <div class="card-body text-center">
            <i class="fas fa-user-tie fa-2x mb-2"></i>
            <h3 class="mb-1">{{ stats.totalManagers || 0 }}</h3>
            <p class="mb-0">Active Managers</p>
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-6 mb-3">
        <div class="card stats-card">
          <div class="card-body text-center">
            <i class="fas fa-star fa-2x mb-2"></i>
            <h3 class="mb-1">{{ stats.totalModels || 0 }}</h3>
            <p class="mb-0">Active Models</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-bolt me-2"></i>
              Quick Actions
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-3 mb-2">
                <router-link to="/admin/users" class="btn btn-primary w-100">
                  <i class="fas fa-users me-2"></i>
                  Manage Users
                </router-link>
              </div>
              <div class="col-md-3 mb-2">
                <router-link to="/admin/models" class="btn btn-success w-100">
                  <i class="fas fa-star me-2"></i>
                  Manage Models
                </router-link>
              </div>
              <div class="col-md-3 mb-2">
                <router-link to="/admin/chats" class="btn btn-info w-100">
                  <i class="fas fa-comments me-2"></i>
                  View Chats
                </router-link>
              </div>
              <div class="col-md-3 mb-2">
                <button class="btn btn-warning w-100" @click="refreshStats">
                  <i class="fas fa-sync-alt me-2"></i>
                  Refresh Stats
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pending Approvals -->
    <div class="row">
      <div class="col-lg-6">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="fas fa-clock me-2"></i>
              Pending Manager Approvals
            </h5>
            <span class="badge bg-warning">{{ pendingManagers.length }}</span>
          </div>
          <div class="card-body">
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
                    class="btn btn-success btn-sm me-2"
                    @click="approveManager(manager.id)"
                  >
                    <i class="fas fa-check me-1"></i>
                    Approve
                  </button>
                  <button
                    class="btn btn-danger btn-sm"
                    @click="rejectManager(manager.id)"
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
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-chart-line me-2"></i>
              Recent Activity
            </h5>
          </div>
          <div class="card-body">
            <div class="text-center text-muted py-3">
              <i class="fas fa-chart-bar fa-2x mb-2"></i>
              <p class="mb-0">Activity tracking coming soon</p>
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

export default {
  name: 'AdminDashboard',
  data() {
    return {
      stats: {},
      pendingManagers: []
    }
  },
  computed: {
    ...mapGetters('auth', ['user'])
  },
  async mounted() {
    await Promise.all([
      this.fetchStats(),
      this.fetchPendingManagers()
    ])
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

    async approveManager(managerId) {
      try {
        await api.post(`/admin/approve-manager/${managerId}`)
        
        this.$swal({
          icon: 'success',
          title: 'Manager Approved!',
          text: 'The manager has been approved and can now access their dashboard.',
          confirmButtonText: 'Great!'
        })

        await this.fetchPendingManagers()
        await this.fetchStats()
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

          await this.fetchPendingManagers()
          await this.fetchStats()
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
          this.fetchPendingManagers()
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
