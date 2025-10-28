<template>
  <div class="container-fluid py-4">
    <!-- Hero Section -->
    <div class="row mb-5">
      <div class="col-12">
        <div class="jumbotron bg-primary text-white text-center py-5 rounded">
          <h1 class="display-4 fw-bold">Welcome to Social Platform</h1>
          <p class="lead">Connect with amazing models and subscribe to exclusive content</p>
          <div v-if="!isAuthenticated" class="mt-4">
            <router-link to="/register" class="btn btn-light btn-lg me-3">
              <i class="fas fa-user-plus me-2"></i>
              Get Started
            </router-link>
            <router-link to="/login" class="btn btn-outline-light btn-lg">
              <i class="fas fa-sign-in-alt me-2"></i>
              Login
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Models Grid -->
    <div class="row">
      <div class="col-12">
        <h2 class="mb-4">
          <i class="fas fa-users me-2"></i>
          Featured Models
        </h2>
      </div>
    </div>

    <div v-if="loading" class="row">
      <div class="col-12 text-center">
        <div class="loading">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="row">
      <div class="col-12">
        <div class="alert alert-danger" role="alert">
          <i class="fas fa-exclamation-triangle me-2"></i>
          {{ error }}
          <button class="btn btn-outline-danger btn-sm ms-2" @click="fetchModels()">
            <i class="fas fa-redo me-1"></i>
            Retry
          </button>
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
              style="height: 300px; object-fit: cover;"
            />
            <div class="position-absolute top-0 end-0 m-2">
              <span class="badge bg-success">
                <i class="fas fa-check-circle me-1"></i>
                Verified
              </span>
            </div>
          </div>
          
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">
              {{ model.name }} {{ model.surname }}
            </h5>
            <p class="card-text text-muted">
              {{ model.age }} years old • {{ model.hairColor }} hair
            </p>
            <p class="card-text flex-grow-1">
              {{ model.bio.substring(0, 100) }}{{ model.bio.length > 100 ? '...' : '' }}
            </p>
            
            <div class="mt-auto">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <small class="text-muted">
                  <i class="fas fa-tag me-1"></i>
                  {{ model.plans.length }} plans available
                </small>
                <small class="text-success fw-bold">
                  From ${{ Math.min(...model.plans.map(p => p.price)) }}/month
                </small>
              </div>
              
              <button class="btn btn-primary w-100">
                <i class="fas fa-eye me-1"></i>
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading && models.length === 0" class="row">
      <div class="col-12 text-center py-5">
        <i class="fas fa-users fa-3x text-muted mb-3"></i>
        <h4 class="text-muted">No models available yet</h4>
        <p class="text-muted">Check back later for new models!</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '../../services/api'

export default {
  name: 'SocialHome',
  data() {
    return {
      models: [],
      loading: true,
      error: null
    }
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated'])
  },
  async mounted() {
    await this.fetchModels()
  },
  methods: {
    async fetchModels(retryCount = 0) {
      try {
        this.loading = true
        this.error = null
        
        console.log('Fetching models from API...')
        const response = await api.get('/social/models', {
          timeout: 10000
        })
        
        console.log('API response:', response.data)
        
        if (response.data.success) {
          this.models = response.data.models || []
          console.log(`Loaded ${this.models.length} models`)
        } else {
          throw new Error(response.data.message || 'Failed to fetch models')
        }
        
        // If no models, show empty state
        if (this.models.length === 0) {
          console.log('No models available')
        }
      } catch (error) {
        console.error('Error fetching models:', error)
        
        // Retry logic for network errors
        if (retryCount < 3 && (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error') || !error.response)) {
          console.log(`Retrying fetch models (attempt ${retryCount + 1})`)
          setTimeout(() => {
            this.fetchModels(retryCount + 1)
          }, 1000 * (retryCount + 1)) // Exponential backoff
          return
        }
        
        this.error = error.response?.data?.message || 'Failed to load models. Please check your connection and try again.'
        this.models = []
      } finally {
        this.loading = false
      }
    },
    
    viewModel(modelId) {
      this.$router.push(`/model/${modelId}`)
    }
  }
}
</script>
