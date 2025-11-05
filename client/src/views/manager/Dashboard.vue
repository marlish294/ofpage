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


    <!-- Model Overview -->
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
        <div class="card" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); margin-bottom: 1.5rem;">
          <div class="card-header" style="background-color: #ffffff; border-bottom: 1px solid #e0e0e0; padding: 1.25rem 1.5rem; border-radius: 12px 12px 0 0;">
            <h5 class="mb-0" style="color: #1a1a1a; font-weight: 700;">
              <i class="fas fa-clock me-2" style="color: #00aff0;"></i>
              Recent Activity
            </h5>
          </div>
          <div class="card-body" style="padding: 1.5rem;">
            <div v-if="recentSubscribers.length === 0" class="text-center text-muted py-3">
              <i class="fas fa-inbox fa-2x mb-2"></i>
              <p class="mb-0">No recent activity</p>
            </div>
            
            <div v-else>
              <div
                v-for="subscriber in recentSubscribers"
                :key="subscriber.id"
                class="d-flex align-items-center mb-3"
              >
                <div class="avatar me-3" style="width: 40px; height: 40px; background-color: #6f42c1; color: white; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
                  {{ subscriber.user.email.charAt(0).toUpperCase() }}
                </div>
                <div class="flex-grow-1">
                  <h6 class="mb-0">{{ subscriber.user.email }}</h6>
                  <small class="text-muted">
                    Subscribed {{ formatDate(subscriber.createdAt) }}
                  </small>
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

export default {
  name: 'ManagerDashboard',
  data() {
    return {
      stats: {},
      model: null,
      modelLoading: true,
      recentSubscribers: []
    }
  },
  computed: {
    ...mapGetters('auth', ['user'])
  },
  async mounted() {
    await Promise.all([
      this.fetchStats(),
      this.fetchModel(),
      this.fetchRecentSubscribers()
    ])
    
    // Listen for refresh event from navbar
    window.addEventListener('refresh-manager-stats', this.refreshStats)
  },
  
  beforeUnmount() {
    window.removeEventListener('refresh-manager-stats', this.refreshStats)
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

    async fetchRecentSubscribers() {
      try {
        const response = await api.get('/manager/chats')
        this.recentSubscribers = response.data.subscribers.slice(0, 5)
      } catch (error) {
        console.error('Error fetching recent subscribers:', error)
      }
    },

    async refreshStats() {
      await Promise.all([
        this.fetchStats(),
        this.fetchRecentSubscribers()
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
