<template>
  <div style="min-height: 100vh; background-color: #ffffff;" class="container-fluid py-4">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-lg-3">
        <div class="card" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); margin-bottom: 1.5rem;">
          <div class="card-header" style="background-color: #ffffff; border-bottom: 1px solid #e0e0e0; padding: 1.25rem 1.5rem; border-radius: 12px 12px 0 0;">
            <h5 class="mb-0" style="color: #1a1a1a; font-weight: 700;">
              <i class="fas fa-user me-2" style="color: #00aff0;"></i>
              My Subscriptions
            </h5>
          </div>
          <div class="card-body p-0">
            <div v-if="loading" class="text-center p-3">
              <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            
            <div v-else-if="subscriptions.length === 0" class="text-center p-3 text-muted">
              <i class="fas fa-heart-broken fa-2x mb-2"></i>
              <p class="mb-0">No subscriptions yet</p>
              <small>Browse models to get started</small>
            </div>
            
            <div v-else class="list-group list-group-flush">
              <div
                v-for="subscription in subscriptions"
                :key="subscription.id"
                class="list-group-item list-group-item-action"
                @click="openChat(subscription.model.id)"
                :class="{ active: currentChat === subscription.model.id }"
              >
                <div class="d-flex align-items-center">
                  <img
                    :src="subscription.model.photoUrl || 'https://via.placeholder.com/40x40'"
                    class="avatar me-3"
                    :alt="subscription.model.name"
                  />
                  <div class="flex-grow-1">
                    <h6 class="mb-0">{{ subscription.model.name }} {{ subscription.model.surname }}</h6>
                    <small class="text-muted">{{ subscription.plan.name }}</small>
                  </div>
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card mt-3" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); margin-bottom: 1.5rem;">
          <div class="card-header" style="background-color: #ffffff; border-bottom: 1px solid #e0e0e0; padding: 1.25rem 1.5rem; border-radius: 12px 12px 0 0;">
            <h6 class="mb-0" style="color: #1a1a1a; font-weight: 700;">
              <i class="fas fa-chart-line me-2" style="color: #00aff0;"></i>
              Quick Stats
            </h6>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between mb-2">
              <span>Active Subscriptions:</span>
              <strong>{{ subscriptions.length }}</strong>
            </div>
            <div class="d-flex justify-content-between">
              <span>Total Spent:</span>
              <strong>${{ totalSpent.toFixed(2) }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="col-lg-9">
        <div class="row mb-4">
          <div class="col-12">
            <h2 style="color: #1a1a1a; font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; max-width: 950px;">
              <i class="fas fa-home me-2" style="color: #00aff0;"></i>
              Welcome back, {{ user?.email }}!
            </h2>
            <p style="color: #666666; font-size: 1rem; margin-bottom: 2rem; max-width: 950px;">Here's what's happening with your subscriptions</p>
          </div>
        </div>

        <!-- Featured Models -->
        <div class="row">
          <div class="col-12">
            <h4 class="mb-3" style="max-width: 950px;">
              <i class="fas fa-star me-2"></i>
              Featured Models
            </h4>
          </div>
        </div>

        <div v-if="modelsLoading" class="row">
          <div class="col-12 text-center">
            <div class="loading">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="row">
          <div
            v-for="model in models"
            :key="model.id"
            class="col-lg-4 col-md-6 mb-4"
          >
            <div class="card model-card h-100" @click="viewModel(model.id)" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); cursor: pointer; transition: all 0.2s ease;" @mouseover="e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 175, 240, 0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }" @mouseout="e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }">
              <div class="position-relative">
                <img
                  :src="model.photoUrl || 'https://via.placeholder.com/400x300'"
                  class="card-img-top"
                  :alt="`${model.name} ${model.surname}`"
                  style="height: 200px; object-fit: cover;"
                />
                <div v-if="isSubscribed(model.id)" class="position-absolute top-0 end-0 m-2">
                  <span class="badge" style="background-color: #00c78b; color: #ffffff; border-radius: 6px; padding: 0.375rem 0.75rem; font-weight: 500;">
                    <i class="fas fa-check-circle me-1"></i>
                    Subscribed
                  </span>
                </div>
              </div>
              
              <div class="card-body d-flex flex-column">
                <h6 class="card-title">
                  {{ model.name }} {{ model.surname }}
                </h6>
                <p class="card-text text-muted small">
                  {{ model.age }} years old • {{ model.hairColor }} hair
                </p>
                <p class="card-text small flex-grow-1">
                  {{ model.bio.substring(0, 80) }}{{ model.bio.length > 80 ? '...' : '' }}
                </p>
                
                <div class="mt-auto">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <small class="text-muted">
                      {{ model.plans.length }} plans
                    </small>
                    <small style="color: #00aff0; font-weight: 700;">
                      From ${{ Math.min(...model.plans.map(p => p.price)) }}/month
                    </small>
                  </div>
                  
                  <button
                    v-if="!isSubscribed(model.id)"
                    class="btn btn-sm w-100"
                    @click.stop="viewModel(model.id)"
                    style="background-color: #00aff0; border-color: #00aff0; color: #ffffff; font-weight: 600; border-radius: 8px; padding: 0.625rem 1rem; transition: all 0.2s ease;"
                    @mouseover="e => e.target.style.backgroundColor = '#0091ea'"
                    @mouseout="e => e.target.style.backgroundColor = '#00aff0'"
                  >
                    <i class="fas fa-eye me-1"></i>
                    View Profile
                  </button>
                  
                  <button
                    v-else
                    class="btn btn-sm w-100"
                    @click.stop="openChat(model.id)"
                    style="background-color: #00aff0; border-color: #00aff0; color: #ffffff; font-weight: 600; border-radius: 8px; padding: 0.625rem 1rem; transition: all 0.2s ease;"
                    @mouseover="e => e.target.style.backgroundColor = '#0091ea'"
                    @mouseout="e => e.target.style.backgroundColor = '#00aff0'"
                  >
                    <i class="fas fa-comments me-1"></i>
                    Open Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!modelsLoading && models.length === 0" class="row">
          <div class="col-12 text-center py-5">
            <i class="fas fa-users fa-3x text-muted mb-3"></i>
            <h4 class="text-muted" style="max-width: 950px;">No models available</h4>
            <p class="text-muted" style="max-width: 950px;">Check back later for new models!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import api from '../../services/api'

export default {
  name: 'UserDashboard',
  data() {
    return {
      subscriptions: [],
      models: [],
      loading: true,
      modelsLoading: true,
      currentChat: null
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
    totalSpent() {
      return this.subscriptions.reduce((sum, sub) => sum + sub.plan.price, 0)
    }
  },
  async mounted() {
    await Promise.all([
      this.fetchSubscriptions(),
      this.fetchModels()
    ])
  },
  methods: {
    ...mapActions('socket', ['connectSocket']),

    async fetchSubscriptions() {
      try {
        this.loading = true
        const response = await api.get('/user/subscriptions')
        this.subscriptions = response.data.subscriptions
      } catch (error) {
        console.error('Error fetching subscriptions:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchModels() {
      try {
        this.modelsLoading = true
        const response = await api.get('/social/models')
        this.models = response.data.models
      } catch (error) {
        console.error('Error fetching models:', error)
      } finally {
        this.modelsLoading = false
      }
    },

    isSubscribed(modelId) {
      return this.subscriptions.some(sub => sub.model.id === modelId)
    },

    viewModel(modelId) {
      this.$router.push(`/model/${modelId}`)
    },

    openChat(modelId) {
      this.currentChat = modelId
      this.$router.push(`/user/chat/${modelId}`)
    }
  }
}
</script>
