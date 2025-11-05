<template>
  <div style="background-color: #ffffff; min-height: 100vh; padding-top: 76px;">
    <!-- Models Header Section -->
    <section 
      style="
        background-color: #00aff0;
        padding: 4rem 0;
        margin-top: 0;
      "
    >
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 text-center">
            <h1 style="color: #ffffff; font-size: 48px; font-weight: 700; margin: 0;">
              All Models
            </h1>
            <p style="color: #ffffff; font-size: 18px; margin-top: 1rem; opacity: 0.9;">
              Discover all our creators
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Models Grid -->
    <div class="container-fluid" style="padding: 4rem 2rem;">
      <div class="row">
        <div class="col-12">
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

          <div v-else class="row" style="margin-bottom: 0; justify-content: center;">
            <div
              v-for="model in models"
              :key="model.id"
              class="model-card-col"
              style="
                width: 389px;
                margin: 0 0.75rem 4rem 0.75rem;
                display: flex;
                position: relative;
              "
            >
              <div 
                class="model-card-wrapper"
                style="
                  width: 100%;
                  display: flex;
                  flex-direction: column;
                  height: 100%;
                "
              >
                <div 
                  class="card model-card" 
                  @click="viewModel(model.id)" 
                  style="
                    background-color: #ffffff; 
                    border: none; 
                    border-radius: 6px; 
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12); 
                    overflow: hidden; 
                    transition: all 0.3s ease;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    height: 418px;
                    position: relative;
                    width: 389px;
                  "
                  @mouseenter="handleCardHover"
                  @mouseleave="handleCardLeave"
                >
                  <!-- Timestamp at top right -->
                  <div style="position: absolute; top: 1rem; right: 1rem; z-index: 10; font-size: 0.75rem; color: #8a96a3; font-weight: 500;">
                    Yesterday
                  </div>
                  
                  <!-- Top Section: Avatar, Name, Username -->
                  <div style="padding: 1rem; display: flex; align-items: flex-start; gap: 0.75rem; flex-shrink: 0;">
                    <!-- Circular Avatar -->
                    <img
                      :src="model.photoUrl || 'https://via.placeholder.com/48'"
                      :alt="`${model.name} ${model.surname}`"
                      style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; flex-shrink: 0;"
                    />
                    
                    <!-- Name and Username -->
                    <div style="flex: 1; min-width: 0;">
                      <h5 style="margin: 0; font-size: 1.125rem; font-weight: 700; color: #1a1a1a; line-height: 1.3; margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.5rem;">
                        {{ model.name }} {{ model.surname }}
                        <svg class="m-verified g-icon" data-icon-name="icon-verified" aria-hidden="true" style="width: 18px; height: 18px; flex-shrink: 0;">
                          <use href="#icon-verified" xlink:href="#icon-verified"></use>
                        </svg>
                      </h5>
                      <p style="margin: 0; font-size: 0.875rem; font-weight: 500; color: #8a96a3; line-height: 1.3;">
                        @{{ (model.name + model.surname).toLowerCase().replace(/\s+/g, '') }}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Bio Section -->
                  <div style="padding: 0 1rem 0.75rem 1rem; flex-shrink: 0;">
                    <p 
                      style="
                        margin: 0; 
                        font-size: 0.9375rem; 
                        line-height: 1.6; 
                        color: #2c3e50; 
                        font-weight: 400;
                        display: -webkit-box;
                        -webkit-line-clamp: 3;
                        line-clamp: 3;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        min-height: 4.5rem;
                        max-height: 4.5rem;
                      "
                    >
                      {{ model.bio || 'No bio available' }}
                    </p>
                    <button
                      v-if="model.bio && model.bio.length > 100"
                      @click.stop="viewModel(model.id)"
                      style="
                        margin-top: 0.5rem;
                        background: none;
                        border: none;
                        color: #00aff0;
                        font-size: 0.875rem;
                        font-weight: 600;
                        padding: 0;
                        cursor: pointer;
                        text-decoration: none;
                        transition: color 0.2s ease;
                      "
                      @mouseenter="e => e.target.style.color = '#0091ea'"
                      @mouseleave="e => e.target.style.color = '#00aff0'"
                    >
                      ...read more
                    </button>
                  </div>
                  
                  <!-- Pricing Section -->
                  <div style="padding: 0 1rem 1rem 1rem; margin-top: auto; flex-shrink: 0;">
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;">
                      <div style="flex: 1;">
                        <small style="font-size: 0.8125rem; color: #8a96a3; font-weight: 500; display: block; margin-bottom: 0.25rem;">
                          {{ model.plans.length }} {{ model.plans.length === 1 ? 'plan' : 'plans' }} available
                        </small>
                        <p style="margin: 0; font-size: 1.125rem; font-weight: 700; color: #00aff0;">
                          From ${{ model.plans && model.plans.length > 0 ? Math.min(...model.plans.map(p => p.price)) : '0' }}/month
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Main Photo/Media - Full width at bottom, corner to corner -->
                  <div style="width: 100%; padding: 0; margin-top: auto; flex-shrink: 0;">
                    <div class="model-image-container" style="width: 100%; height: 250px; overflow: hidden; background-color: #f0f0f0; position: relative; border-radius: 0 0 6px 6px;">
                      <img
                        :src="model.photoUrl || 'https://via.placeholder.com/400x400'"
                        :alt="`${model.name} ${model.surname}`"
                        class="model-card-image"
                      />
                    </div>
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
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../services/api'

export default {
  name: 'Models',
  data() {
    return {
      models: [],
      loading: true,
      error: null
    }
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
    },
    
    handleCardHover(event) {
      const card = event.currentTarget
      card.style.transform = 'translateY(-12px) scale(1.02)'
      card.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.2)'
    },
    
    handleCardLeave(event) {
      const card = event.currentTarget
      card.style.transform = 'translateY(0) scale(1)'
      card.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)'
    }
  }
}
</script>

<style scoped>
.model-card-wrapper {
  position: relative;
}

.model-card {
  transition: all 0.3s ease;
}

.model-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.model-image-container {
  width: 100%;
  height: 250px;
  overflow: hidden;
  background-color: #f0f0f0;
  position: relative;
  border-radius: 0 0 6px 6px;
}

.model-card-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  display: block;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .container-fluid {
    padding: 2rem 1rem !important;
  }
  
  .model-card-col {
    width: 100% !important;
    max-width: 389px;
    margin: 0 auto 2rem auto !important;
  }
  
  .model-card {
    width: 100% !important;
  }
}
</style>

