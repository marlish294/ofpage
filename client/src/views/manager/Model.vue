<template>
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <div class="col-12">
        <h2>
          <i class="fas fa-user-edit me-2"></i>
          Manage Model
        </h2>
        <p class="text-muted">Create and manage your model profile</p>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-8">
        <!-- Model Form -->
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-user me-2"></i>
              Model Information
            </h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="saveModel">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="name" class="form-label">First Name *</label>
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      v-model="modelForm.name"
                      required
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="surname" class="form-label">Last Name *</label>
                    <input
                      type="text"
                      class="form-control"
                      id="surname"
                      v-model="modelForm.surname"
                      required
                    />
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="bio" class="form-label">Bio *</label>
                <textarea
                  class="form-control"
                  id="bio"
                  v-model="modelForm.bio"
                  rows="4"
                  required
                ></textarea>
              </div>

              <div class="row">
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="age" class="form-label">Age *</label>
                    <input
                      type="number"
                      class="form-control"
                      id="age"
                      v-model="modelForm.age"
                      min="18"
                      max="100"
                      required
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="hairColor" class="form-label">Hair Color *</label>
                    <select class="form-select" id="hairColor" v-model="modelForm.hairColor" required>
                      <option value="">Select hair color</option>
                      <option value="Black">Black</option>
                      <option value="Brown">Brown</option>
                      <option value="Blonde">Blonde</option>
                      <option value="Red">Red</option>
                      <option value="Gray">Gray</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="skinColor" class="form-label">Skin Color *</label>
                    <select class="form-select" id="skinColor" v-model="modelForm.skinColor" required>
                      <option value="">Select skin color</option>
                      <option value="Fair">Fair</option>
                      <option value="Light">Light</option>
                      <option value="Medium">Medium</option>
                      <option value="Olive">Olive</option>
                      <option value="Tan">Tan</option>
                      <option value="Dark">Dark</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="photo" class="form-label">Profile Photo</label>
                    <input
                      type="file"
                      class="form-control"
                      id="photo"
                      accept="image/*"
                      @change="handlePhotoUpload"
                    />
                    <div class="form-text">Upload a high-quality photo (max 10MB)</div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="video" class="form-label">Video Preview</label>
                    <input
                      type="file"
                      class="form-control"
                      id="video"
                      accept="video/*"
                      @change="handleVideoUpload"
                    />
                    <div class="form-text">Upload a preview video (max 10MB)</div>
                  </div>
                </div>
              </div>

              <div v-if="modelForm.photoUrl" class="mb-3">
                <label class="form-label">Current Photo</label>
                <div>
                  <img
                    :src="modelForm.photoUrl"
                    class="img-thumbnail"
                    style="max-width: 200px; max-height: 200px;"
                    alt="Current photo"
                  />
                </div>
              </div>

              <div class="d-flex justify-content-between">
                <button type="button" class="btn btn-secondary" @click="resetForm">
                  <i class="fas fa-undo me-1"></i>
                  Reset
                </button>
                <button type="submit" class="btn btn-primary" :disabled="saving">
                  <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                  <i v-else class="fas fa-save me-1"></i>
                  {{ saving ? 'Saving...' : 'Save Model' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Plans Management -->
      <div class="col-lg-4">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="fas fa-crown me-2"></i>
              Subscription Plans
            </h5>
            <button
              class="btn btn-sm btn-primary"
              @click="showAddPlanModal"
              :disabled="plans.length >= 4"
            >
              <i class="fas fa-plus me-1"></i>
              Add Plan
            </button>
          </div>
          <div class="card-body">
            <div v-if="plans.length === 0" class="text-center text-muted py-3">
              <i class="fas fa-crown fa-2x mb-2"></i>
              <p class="mb-0">No plans created yet</p>
              <small>Create up to 4 subscription plans</small>
            </div>
            
            <div v-else>
              <div
                v-for="plan in plans"
                :key="plan.id"
                class="card mb-3"
              >
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="card-title mb-0">{{ plan.name }}</h6>
                    <div class="dropdown">
                      <button
                        class="btn btn-sm btn-outline-secondary"
                        type="button"
                        data-bs-toggle="dropdown"
                      >
                        <i class="fas fa-ellipsis-v"></i>
                      </button>
                      <ul class="dropdown-menu">
                        <li>
                          <button class="dropdown-item" @click="editPlan(plan)">
                            <i class="fas fa-edit me-2"></i>
                            Edit
                          </button>
                        </li>
                        <li>
                          <button class="dropdown-item text-danger" @click="deletePlan(plan.id)">
                            <i class="fas fa-trash me-2"></i>
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <p class="card-text small text-muted">{{ plan.description }}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="fw-bold text-success">${{ plan.price }}</span>
                    <small class="text-muted">{{ plan.duration }} days</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Plan Modal -->
    <div
      class="modal fade"
      id="planModal"
      tabindex="-1"
      data-bs-backdrop="static"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-crown me-2"></i>
              {{ editingPlan ? 'Edit Plan' : 'Add New Plan' }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              @click="resetPlanForm"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="savePlan">
              <div class="mb-3">
                <label for="planName" class="form-label">Plan Name *</label>
                <input
                  type="text"
                  class="form-control"
                  id="planName"
                  v-model="planForm.name"
                  required
                />
              </div>
              
              <div class="mb-3">
                <label for="planDescription" class="form-label">Description *</label>
                <textarea
                  class="form-control"
                  id="planDescription"
                  v-model="planForm.description"
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="planPrice" class="form-label">Price ($) *</label>
                    <input
                      type="number"
                      class="form-control"
                      id="planPrice"
                      v-model="planForm.price"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="planDuration" class="form-label">Duration (days) *</label>
                    <input
                      type="number"
                      class="form-control"
                      id="planDuration"
                      v-model="planForm.duration"
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="resetPlanForm"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="savePlan"
              :disabled="savingPlan"
            >
              <span v-if="savingPlan" class="spinner-border spinner-border-sm me-1"></span>
              <i v-else class="fas fa-save me-1"></i>
              {{ savingPlan ? 'Saving...' : 'Save Plan' }}
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
  name: 'ManagerModel',
  data() {
    return {
      modelForm: {
        name: '',
        surname: '',
        bio: '',
        age: '',
        hairColor: '',
        skinColor: '',
        photoUrl: null
      },
      plans: [],
      saving: false,
      editingPlan: null,
      planForm: {
        name: '',
        description: '',
        price: '',
        duration: ''
      },
      savingPlan: false,
      selectedPhotoFile: null,
      selectedVideoFile: null
    }
  },
  async mounted() {
    await this.loadModel()
    await this.loadPlans()
  },
  methods: {
    async loadModel() {
      try {
        const response = await api.get('/manager/model')
        if (response.data.model) {
          const model = response.data.model
          this.modelForm = {
            name: model.name || '',
            surname: model.surname || '',
            bio: model.bio || '',
            age: model.age || '',
            hairColor: model.hairColor || '',
            skinColor: model.skinColor || '',
            photoUrl: model.photoUrl
          }
        }
      } catch (error) {
        console.error('Error loading model:', error)
      }
    },

    async loadPlans() {
      try {
        const response = await api.get('/manager/model')
        this.plans = response.data.model?.plans || []
      } catch (error) {
        console.error('Error loading plans:', error)
      }
    },

    async saveModel() {
      try {
        this.saving = true
        
        const formData = new FormData()
        formData.append('name', this.modelForm.name)
        formData.append('surname', this.modelForm.surname)
        formData.append('bio', this.modelForm.bio)
        formData.append('age', this.modelForm.age)
        formData.append('hairColor', this.modelForm.hairColor)
        formData.append('skinColor', this.modelForm.skinColor)

        // Add photo file if selected
        if (this.selectedPhotoFile) {
          formData.append('photo', this.selectedPhotoFile)
        }

        // Add video file if selected
        if (this.selectedVideoFile) {
          formData.append('video', this.selectedVideoFile)
        }

        const response = await api.post('/manager/model', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        this.$swal({
          icon: 'success',
          title: 'Model Saved!',
          text: 'Your model profile has been updated successfully.',
          confirmButtonText: 'Great!'
        })

        // Clear selected files
        this.selectedPhotoFile = null
        this.selectedVideoFile = null

        await this.loadModel()
      } catch (error) {
        console.error('Error saving model:', error)
        this.$swal({
          icon: 'error',
          title: 'Save Failed',
          text: error.response?.data?.message || 'Failed to save model. Please try again.',
          confirmButtonText: 'OK'
        })
      } finally {
        this.saving = false
      }
    },

    async handlePhotoUpload(event) {
      const file = event.target.files[0]
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          this.$swal({
            icon: 'error',
            title: 'Invalid File',
            text: 'Please select an image file.',
            confirmButtonText: 'OK'
          })
          return
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          this.$swal({
            icon: 'error',
            title: 'File Too Large',
            text: 'Please select an image smaller than 10MB.',
            confirmButtonText: 'OK'
          })
          return
        }

        // Show preview immediately
        this.modelForm.photoUrl = URL.createObjectURL(file)
        
        // Store file for upload
        this.selectedPhotoFile = file
      }
    },

    handleVideoUpload(event) {
      const file = event.target.files[0]
      if (file) {
        // In a real app, you'd upload the file here
        console.log('Video file selected:', file.name)
      }
    },

    resetForm() {
      this.loadModel()
    },

    showAddPlanModal() {
      this.editingPlan = null
      this.resetPlanForm()
      const modal = new bootstrap.Modal(document.getElementById('planModal'))
      modal.show()
    },

    editPlan(plan) {
      this.editingPlan = plan
      this.planForm = {
        name: plan.name,
        description: plan.description,
        price: plan.price,
        duration: plan.duration
      }
      const modal = new bootstrap.Modal(document.getElementById('planModal'))
      modal.show()
    },

    resetPlanForm() {
      this.planForm = {
        name: '',
        description: '',
        price: '',
        duration: ''
      }
      this.editingPlan = null
    },

    async savePlan() {
      try {
        this.savingPlan = true

        if (this.editingPlan) {
          await api.put(`/manager/plans/${this.editingPlan.id}`, this.planForm)
        } else {
          await api.post('/manager/plans', this.planForm)
        }

        this.$swal({
          icon: 'success',
          title: 'Plan Saved!',
          text: 'Your subscription plan has been saved successfully.',
          confirmButtonText: 'Great!'
        })

        const modal = bootstrap.Modal.getInstance(document.getElementById('planModal'))
        modal.hide()
        
        await this.loadPlans()
        this.resetPlanForm()
      } catch (error) {
        console.error('Error saving plan:', error)
        this.$swal({
          icon: 'error',
          title: 'Save Failed',
          text: error.response?.data?.message || 'Failed to save plan. Please try again.',
          confirmButtonText: 'OK'
        })
      } finally {
        this.savingPlan = false
      }
    },

    async deletePlan(planId) {
      const result = await this.$swal({
        icon: 'warning',
        title: 'Delete Plan',
        text: 'Are you sure you want to delete this plan? This action cannot be undone.',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      })

      if (result.isConfirmed) {
        try {
          await api.delete(`/manager/plans/${planId}`)
          
          this.$swal({
            icon: 'success',
            title: 'Plan Deleted!',
            text: 'The subscription plan has been deleted successfully.',
            confirmButtonText: 'OK'
          })

          await this.loadPlans()
        } catch (error) {
          console.error('Error deleting plan:', error)
          this.$swal({
            icon: 'error',
            title: 'Delete Failed',
            text: 'Failed to delete plan. Please try again.',
            confirmButtonText: 'OK'
          })
        }
      }
    }
  }
}
</script>
