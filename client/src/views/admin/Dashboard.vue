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
        <div class="card" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); margin-bottom: 1.5rem;">
          <div class="card-header" style="background-color: #ffffff; border-bottom: 1px solid #e0e0e0; padding: 1.25rem 1.5rem; border-radius: 12px 12px 0 0;">
            <h5 class="mb-0" style="color: #1a1a1a; font-weight: 700;">
              <i class="fas fa-chart-line me-2" style="color: #00aff0;"></i>
              Recent Activity
            </h5>
          </div>
          <div class="card-body" style="padding: 1.5rem;">
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
    
    // Listen for refresh event from navbar
    window.addEventListener('refresh-admin-stats', this.refreshStats)
  },
  
  beforeUnmount() {
    window.removeEventListener('refresh-admin-stats', this.refreshStats)
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
