<template>
  <div style="min-height: 100vh; background-color: #ffffff;" class="container py-4">
    <div v-if="loading" class="text-center">
      <div class="loading">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      <i class="fas fa-exclamation-triangle me-2"></i>
      {{ error }}
    </div>

    <div v-else-if="model">
      <!-- Model Header: Avatar, Name, Username -->
      <div style="padding: 1rem; display: flex; align-items: flex-start; gap: 0.75rem; flex-shrink: 0; margin-bottom: 2rem; position: relative;">
        <!-- Timestamp at top right -->
        <div style="position: absolute; top: 1rem; right: 1rem; z-index: 10; font-size: 0.75rem; color: #8a96a3; font-weight: 500;">
          Yesterday
        </div>
        
        <!-- Circular Avatar -->
        <img
          :src="model.photoUrl || 'https://via.placeholder.com/48'"
          :alt="`${model.name} ${model.surname}`"
          style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; flex-shrink: 0;"
        />
        <!-- Name and Username -->
        <div style="flex: 1; min-width: 0;">
          <h5 style="margin: 0 0 0.25rem 0; font-size: 1.125rem; font-weight: 700; color: rgb(26, 26, 26); line-height: 1.3; display: flex; align-items: center; gap: 0.5rem;">
            {{ model.name }} {{ model.surname }}
            <svg class="m-verified g-icon" data-icon-name="icon-verified" aria-hidden="true" style="width: 18px; height: 18px; flex-shrink: 0;">
              <use href="#icon-verified" xlink:href="#icon-verified"></use>
            </svg>
          </h5>
          <p style="margin: 0; font-size: 0.875rem; font-weight: 500; color: rgb(138, 150, 163); line-height: 1.3;">
            @{{ (model.name + model.surname).toLowerCase().replace(/\s+/g, '') }}
          </p>
        </div>
      </div>

      <!-- Bio Section -->
      <div style="padding: 0 1rem 1rem 1rem; margin-bottom: 2rem;">
        <p style="margin: 0; font-size: 0.9375rem; line-height: 1.6; color: #2c3e50; font-weight: 400;">
          {{ model.bio || 'No bio available' }}
        </p>
      </div>

      <!-- Main Content: Photo/Video on Left, Subscription Plans on Right -->
      <div class="row">
        <!-- Left Column: Photo and Video -->
        <div class="col-lg-8">
          <!-- Model Photo -->
          <div class="card mb-4" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); margin-bottom: 1.5rem;">
            <div class="card-body p-0">
              <img
                :src="model.photoUrl || 'https://via.placeholder.com/800x600'"
                class="img-fluid"
                :alt="`${model.name} ${model.surname}`"
                style="width: 100%; height: auto; border-radius: 12px; object-fit: cover; display: block;"
              />
            </div>
          </div>

          <!-- Video Preview -->
          <div v-if="model.videoUrl" class="card mb-4" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); margin-bottom: 1.5rem;">
            <div class="card-header" style="background-color: #ffffff; border-bottom: 1px solid #e0e0e0; padding: 1.25rem 1.5rem; border-radius: 12px 12px 0 0;">
              <h5 class="mb-0" style="color: #1a1a1a; font-weight: 700;">
                <i class="fas fa-video me-2" style="color: #00aff0;"></i>
                Video Preview
              </h5>
            </div>
            <div class="card-body p-0">
              <div class="ratio ratio-16x9">
                <video controls style="border-radius: 0 0 12px 12px;">
                  <source :src="model.videoUrl" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Subscription Plans -->
        <div class="col-lg-4">
          <div class="card" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); margin-bottom: 1.5rem; position: sticky; top: 100px;">
            <div class="card-header" style="background-color: #ffffff; border-bottom: 1px solid #e0e0e0; padding: 1.25rem 1.5rem; border-radius: 12px 12px 0 0;">
              <h5 class="mb-0" style="color: #1a1a1a; font-weight: 700;">
                <i class="fas fa-crown me-2" style="color: #00aff0;"></i>
                Subscription Plans
              </h5>
            </div>
            <div class="card-body">
              <div v-if="model.plans.length === 0" class="text-center text-muted">
                <i class="fas fa-info-circle fa-2x mb-2"></i>
                <p>No plans available yet</p>
              </div>
              
              <div v-else>
                <div
                  v-for="plan in model.plans"
                  :key="plan.id"
                  class="card mb-3 border-primary"
                  :class="{ 'border-success': plan.name.toLowerCase().includes('premium') || plan.name.toLowerCase().includes('vip') }"
                  style="border-radius: 8px;"
                >
                  <div class="card-body">
                    <h6 class="card-title d-flex justify-content-between align-items-center mb-2">
                      {{ plan.name }}
                      <span class="badge bg-primary">
                        ${{ plan.price }}
                      </span>
                    </h6>
                    <p class="card-text small text-muted mb-3" style="min-height: 40px;">
                      {{ plan.description }}
                    </p>
                    <!-- Photos and Videos Count -->
                    <div class="d-flex gap-3 mb-3" style="gap: 1rem;">
                      <small class="text-muted d-flex align-items-center">
                        <i class="fas fa-image me-1" style="color: #00aff0;"></i>
                        {{ plan.photosCount || 0 }} Photos
                      </small>
                      <small class="text-muted d-flex align-items-center">
                        <i class="fas fa-video me-1" style="color: #00aff0;"></i>
                        {{ plan.videosCount || 0 }} Videos
                      </small>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                      <small class="text-muted">
                        <i class="fas fa-clock me-1"></i>
                        {{ plan.duration }} days
                      </small>
                      <button
                        class="btn btn-sm"
                        @click="subscribe(plan)"
                        style="background-color: #00aff0; border-color: #00aff0; color: #ffffff; font-weight: 600; border-radius: 8px; padding: 0.5rem 1rem; transition: all 0.2s ease;"
                        @mouseover="e => e.target.style.backgroundColor = '#0091ea'"
                        @mouseout="e => e.target.style.backgroundColor = '#00aff0'"
                      >
                        <i class="fas fa-credit-card me-1"></i>
                        Subscribe
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Subscription Modal -->
    <div
      class="modal fade"
      id="subscriptionModal"
      tabindex="-1"
      data-bs-backdrop="static"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-credit-card me-2"></i>
              Complete Subscription
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              @click="resetSubscription"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedPlan" class="mb-3">
              <h6>{{ selectedPlan.name }}</h6>
              <p class="text-muted">{{ selectedPlan.description }}</p>
              <div class="d-flex justify-content-between">
                <span>Price:</span>
                <strong>${{ selectedPlan.price }}</strong>
              </div>
              <div class="d-flex justify-content-between">
                <span>Duration:</span>
                <strong>{{ selectedPlan.duration }} days</strong>
              </div>
            </div>

            <form @submit.prevent="processSubscription">
              <div class="mb-3">
                <label for="cardNumber" class="form-label">Card Number</label>
                <input
                  type="text"
                  class="form-control"
                  id="cardNumber"
                  v-model="paymentData.cardNumber"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="expiryDate" class="form-label">Expiry Date</label>
                    <input
                      type="text"
                      class="form-control"
                      id="expiryDate"
                      v-model="paymentData.expiryDate"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="cvv" class="form-label">CVV</label>
                    <input
                      type="text"
                      class="form-control"
                      id="cvv"
                      v-model="paymentData.cvv"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>

              <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                This is a demo payment. Any card details will be accepted.
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn"
              data-bs-dismiss="modal"
              @click="resetSubscription"
              style="background-color: transparent; border: 2px solid #e0e0e0; color: #666666; font-weight: 600; border-radius: 8px; padding: 0.75rem 1.5rem; transition: all 0.2s ease;"
              @mouseover="e => { e.target.style.borderColor = '#00aff0'; e.target.style.color = '#00aff0'; }"
              @mouseout="e => { e.target.style.borderColor = '#e0e0e0'; e.target.style.color = '#666666'; }"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn"
              @click="processSubscription"
              :disabled="processing"
              :style="{ 'background-color': '#00aff0', 'border-color': '#00aff0', 'color': '#ffffff', 'font-weight': '600', 'border-radius': '8px', 'padding': '0.75rem 1.5rem', 'transition': 'all 0.2s ease', 'opacity': processing ? 0.5 : 1 }"
              @mouseover="e => { if(!processing) e.target.style.backgroundColor = '#0091ea'; }"
              @mouseout="e => { if(!processing) e.target.style.backgroundColor = '#00aff0'; }"
            >
              <span v-if="processing" class="spinner-border spinner-border-sm me-2" style="width: 1rem; height: 1rem; border-width: 2px;"></span>
              <i v-else class="fas fa-credit-card me-2"></i>
              {{ processing ? 'Processing...' : 'Complete Payment' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../services/api'

export default {
  name: 'ModelDetail',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      model: null,
      loading: true,
      error: null,
      selectedPlan: null,
      paymentData: {
        cardNumber: '',
        expiryDate: '',
        cvv: ''
      },
      processing: false
    }
  },
  async mounted() {
    await this.fetchModel()
  },
  methods: {
    async fetchModel() {
      try {
        this.loading = true
        this.error = null
        
        const response = await api.get(`/social/models/${this.id}`)
        this.model = response.data.model
      } catch (error) {
        console.error('Error fetching model:', error)
        this.error = 'Failed to load model details. Please try again.'
      } finally {
        this.loading = false
      }
    },

    subscribe(plan) {
      this.selectedPlan = plan
      this.resetPaymentData()
      
      // Show modal
      const modal = new bootstrap.Modal(document.getElementById('subscriptionModal'))
      modal.show()
    },

    resetPaymentData() {
      this.paymentData = {
        cardNumber: '',
        expiryDate: '',
        cvv: ''
      }
    },

    resetSubscription() {
      this.selectedPlan = null
      this.resetPaymentData()
    },

    async processSubscription() {
      if (!this.selectedPlan) return

      this.processing = true

      try {
        // Check if user is authenticated
        const token = localStorage.getItem('token')
        if (!token) {
          // Hide modal first
          const modal = bootstrap.Modal.getInstance(document.getElementById('subscriptionModal'))
          modal.hide()
          
          // Redirect to login
          this.$swal({
            icon: 'info',
            title: 'Login Required',
            text: 'Please log in to complete your subscription.',
            confirmButtonText: 'Go to Login'
          }).then(() => {
            this.$router.push('/login')
          })
          return
        }

        // Process demo payment first
        await api.post('/social/subscribe', {
          modelId: this.model.id,
          planId: this.selectedPlan.id,
          paymentData: this.paymentData
        })

        // Create actual subscription
        const subscriptionResponse = await api.post('/user/subscribe', {
          modelId: this.model.id,
          planId: this.selectedPlan.id
        })

        // Hide modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('subscriptionModal'))
        modal.hide()

        // Show success message
        this.$swal({
          icon: 'success',
          title: 'Subscription Successful!',
          text: 'Your subscription has been created. You can now access exclusive content and chat with this model.',
          confirmButtonText: 'Great!'
        }).then(() => {
          // Redirect to user dashboard
          this.$router.push('/user')
        })

        // Reset form
        this.resetSubscription()

      } catch (error) {
        console.error('Subscription error:', error)
        this.$swal({
          icon: 'error',
          title: 'Subscription Failed',
          text: error.response?.data?.message || 'Something went wrong. Please try again.',
          confirmButtonText: 'OK'
        })
      } finally {
        this.processing = false
      }
    }
  }
}
</script>
