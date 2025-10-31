<template>
  <div style="min-height: 100vh; background-color: #ffffff;" class="container-fluid py-4">
    <div class="container">
      <div class="row mb-4">
        <div class="col-12">
          <h2 style="color: #1a1a1a; font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">
            <i class="fas fa-star me-2" style="color: #00aff0;"></i>
            Model Management
          </h2>
          <p style="color: #666666; font-size: 1rem; margin-bottom: 2rem;">Manage models and their visibility</p>
        </div>
      </div>
    </div>

    <!-- Models Table -->
    <div class="card" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); margin-bottom: 1.5rem;">
      <div class="card-header d-flex justify-content-between align-items-center" style="background-color: #ffffff; border-bottom: 1px solid #e0e0e0; padding: 1.25rem 1.5rem; border-radius: 12px 12px 0 0;">
        <h5 class="mb-0" style="color: #1a1a1a; font-weight: 700;">All Models ({{ models.length }})</h5>
        <button class="btn btn-sm" @click="refreshModels" style="background-color: #00aff0; border-color: #00aff0; color: #ffffff; font-weight: 600; border-radius: 8px; padding: 0.5rem 1rem; transition: all 0.2s ease;" @mouseover="e => e.target.style.backgroundColor = '#0091ea'" @mouseout="e => e.target.style.backgroundColor = '#00aff0'">
          <i class="fas fa-sync-alt me-1"></i>
          Refresh
        </button>
      </div>
      <div class="card-body p-0">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        
        <div v-else-if="models.length === 0" class="text-center py-5">
          <i class="fas fa-star fa-3x text-muted mb-3"></i>
          <h4 class="text-muted">No models found</h4>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>Model</th>
                <th>Manager</th>
                <th>Status</th>
                <th>Plans</th>
                <th>Subscribers</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="model in models" :key="model.id">
                <td>
                  <div class="d-flex align-items-center">
                    <img
                      :src="model.photoUrl || 'https://via.placeholder.com/40x40'"
                      class="avatar me-3"
                      :alt="`${model.name} ${model.surname}`"
                      style="width: 40px; height: 40px; object-fit: cover; border-radius: 50%;"
                    />
                    <div>
                      <div class="fw-bold">{{ model.name }} {{ model.surname }}</div>
                      <small class="text-muted">{{ model.age }} years old</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <div class="fw-bold">{{ model.manager.user.email }}</div>
                    <span class="badge" :class="model.manager.user.isActive ? 'bg-success' : 'bg-danger'">
                      {{ model.manager.user.isActive ? 'Active' : 'Blocked' }}
                    </span>
                  </div>
                </td>
                <td>
                  <span class="badge" :class="model.isActive ? 'bg-success' : 'bg-danger'">
                    {{ model.isActive ? 'Active' : 'Blocked' }}
                  </span>
                </td>
                <td>
                  <span class="badge bg-info">{{ model.plans.length }} plans</span>
                </td>
                <td>
                  <span class="badge bg-primary">{{ model._count.subscriptions }} subscribers</span>
                </td>
                <td>{{ formatDate(model.createdAt) }}</td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button
                      class="btn"
                      :class="model.isActive ? 'btn-outline-danger' : 'btn-outline-success'"
                      @click="toggleModelStatus(model)"
                      :disabled="processingModel === model.id"
                    >
                      <span v-if="processingModel === model.id" class="spinner-border spinner-border-sm me-1"></span>
                      <i :class="model.isActive ? 'fas fa-ban' : 'fas fa-check'" class="me-1"></i>
                      {{ model.isActive ? 'Block' : 'Unblock' }}
                    </button>
                    <button
                      class="btn btn-outline-info"
                      @click="viewModelDetails(model)"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../services/api'

export default {
  name: 'AdminModels',
  data() {
    return {
      models: [],
      loading: true,
      processingModel: null
    }
  },
  async mounted() {
    await this.fetchModels()
  },
  methods: {
    async fetchModels() {
      try {
        this.loading = true
        const response = await api.get('/admin/models')
        this.models = response.data.models
      } catch (error) {
        console.error('Error fetching models:', error)
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch models. Please try again.',
          confirmButtonText: 'OK'
        })
      } finally {
        this.loading = false
      }
    },

    async refreshModels() {
      await this.fetchModels()
    },

    async toggleModelStatus(model) {
      const action = model.isActive ? 'block' : 'unblock'
      const confirmText = model.isActive ? 'block this model' : 'unblock this model'
      
      const result = await this.$swal({
        icon: 'warning',
        title: `${action.charAt(0).toUpperCase() + action.slice(1)} Model`,
        text: `Are you sure you want to ${confirmText}?`,
        showCancelButton: true,
        confirmButtonText: `Yes, ${action}`,
        cancelButtonText: 'Cancel'
      })

      if (result.isConfirmed) {
        try {
          this.processingModel = model.id
          await api.post(`/admin/models/${model.id}/block`, {
            isActive: !model.isActive
          })
          
          this.$swal({
            icon: 'success',
            title: 'Success!',
            text: `Model ${action}ed successfully.`,
            confirmButtonText: 'OK'
          })
          
          await this.fetchModels()
        } catch (error) {
          console.error('Error toggling model status:', error)
          this.$swal({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update model status. Please try again.',
            confirmButtonText: 'OK'
          })
        } finally {
          this.processingModel = null
        }
      }
    },

    viewModelDetails(model) {
      this.$swal({
        title: 'Model Details',
        html: `
          <div class="text-start">
            <div class="text-center mb-3">
              <img src="${model.photoUrl || 'https://via.placeholder.com/150x150'}" 
                   class="img-thumbnail" 
                   style="max-width: 150px; max-height: 150px; object-fit: cover;"
                   alt="${model.name} ${model.surname}">
            </div>
            <p><strong>Name:</strong> ${model.name} ${model.surname}</p>
            <p><strong>Age:</strong> ${model.age} years old</p>
            <p><strong>Hair Color:</strong> ${model.hairColor}</p>
            <p><strong>Skin Color:</strong> ${model.skinColor}</p>
            <p><strong>Bio:</strong> ${model.bio}</p>
            <p><strong>Status:</strong> ${model.isActive ? 'Active' : 'Blocked'}</p>
            <p><strong>Manager:</strong> ${model.manager.user.email}</p>
            <p><strong>Plans:</strong> ${model.plans.length}</p>
            <p><strong>Subscribers:</strong> ${model._count.subscriptions}</p>
            <p><strong>Created:</strong> ${this.formatDate(model.createdAt)}</p>
          </div>
        `,
        confirmButtonText: 'Close',
        width: '600px'
      })
    },

    formatDate(timestamp) {
      return new Date(timestamp).toLocaleDateString()
    }
  }
}
</script>
