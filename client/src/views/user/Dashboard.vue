<template>
  <div class="container-fluid py-4">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-lg-3">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-user me-2"></i>
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

        <div class="card mt-3">
          <div class="card-header">
            <h6 class="mb-0">
              <i class="fas fa-chart-line me-2"></i>
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
            <h2>
              <i class="fas fa-home me-2"></i>
              Welcome back, {{ user?.email }}!
            </h2>
            <p class="text-muted">Here's what's happening with your subscriptions</p>
          </div>
        </div>

        <!-- Featured Models -->
        <div class="row">
          <div class="col-12">
            <h4 class="mb-3">
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
            <div class="card model-card h-100" @click="viewModel(model.id)">
              <div class="position-relative">
                <img
                  :src="model.photoUrl || 'https://via.placeholder.com/400x300'"
                  class="card-img-top"
                  :alt="`${model.name} ${model.surname}`"
                  style="height: 200px; object-fit: cover;"
                />
                <div v-if="isSubscribed(model.id)" class="position-absolute top-0 end-0 m-2">
                  <span class="badge bg-success">
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
                    <small class="text-success fw-bold">
                      From ${{ Math.min(...model.plans.map(p => p.price)) }}/month
                    </small>
                  </div>
                  
                  <button
                    v-if="!isSubscribed(model.id)"
                    class="btn btn-primary btn-sm w-100"
                    @click.stop="viewModel(model.id)"
                  >
                    <i class="fas fa-eye me-1"></i>
                    View Profile
                  </button>
                  
                  <button
                    v-else
                    class="btn btn-success btn-sm w-100"
                    @click.stop="openChat(model.id)"
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
            <h4 class="text-muted">No models available</h4>
            <p class="text-muted">Check back later for new models!</p>
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
