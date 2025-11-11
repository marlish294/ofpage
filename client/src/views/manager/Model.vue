<template>
  <div style="min-height: 100vh; background-color: #ffffff;" class="container-fluid py-4">
    <div class="container">
      <div class="row mb-4">
        <div class="col-12">
          <h2 style="color: #1a1a1a; font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">
            <i class="fas fa-user-edit me-2" style="color: #00aff0;"></i>
            Manage Model
          </h2>
          <p style="color: #666666; font-size: 1rem; margin-bottom: 2rem;">Create and manage your model profile</p>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-8">
          <!-- Model Form -->
          <div class="card" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); margin-bottom: 1.5rem;">
            <div class="card-header" style="background-color: #ffffff; border-bottom: 1px solid #e0e0e0; padding: 1.25rem 1.5rem; border-radius: 12px 12px 0 0;">
              <h5 class="mb-0" style="color: #1a1a1a; font-weight: 700;">
                <i class="fas fa-user me-2" style="color: #00aff0;"></i>
                Model Information
              </h5>
            </div>
            <div class="card-body" style="padding: 1.5rem;">
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

                <div v-if="modelForm.videoUrl" class="mb-3">
                  <label class="form-label">Current Video</label>
                  <div>
                    <video
                      :src="modelForm.videoUrl"
                      controls
                      preload="metadata"
                      crossorigin="anonymous"
                      style="max-width: 300px; max-height: 300px; border-radius: 10px;"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>






                <div class="d-flex justify-content-between">
                  <button type="button" class="btn" @click="resetForm" style="background-color: transparent; border: 2px solid #e0e0e0; color: #666666; font-weight: 600; border-radius: 8px; padding: 0.75rem 1.5rem; transition: all 0.2s ease;" @mouseover="e => { e.target.style.borderColor = '#00aff0'; e.target.style.color = '#00aff0'; }" @mouseout="e => { e.target.style.borderColor = '#e0e0e0'; e.target.style.color = '#666666'; }">
                    <i class="fas fa-undo me-1"></i>
                    Reset
                  </button>
                  <button type="submit" class="btn" :disabled="saving" :style="{ 'background-color': '#00aff0', 'border-color': '#00aff0', 'color': '#ffffff', 'font-weight': '600', 'border-radius': '8px', 'padding': '0.75rem 1.5rem', 'transition': 'all 0.2s ease', 'opacity': saving ? 0.5 : 1 }" @mouseover="e => { if(!saving) e.target.style.backgroundColor = '#0091ea'; }" @mouseout="e => { if(!saving) e.target.style.backgroundColor = '#00aff0'; }">
                    <span v-if="saving" class="spinner-border spinner-border-sm me-1" style="width: 1rem; height: 1rem; border-width: 2px;"></span>
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
          <div class="card" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); margin-bottom: 1.5rem;">
            <div class="card-header d-flex justify-content-between align-items-center" style="background-color: #ffffff; border-bottom: 1px solid #e0e0e0; padding: 1.25rem 1.5rem; border-radius: 12px 12px 0 0;">
              <h5 class="mb-0" style="color: #1a1a1a; font-weight: 700;">
                <i class="fas fa-crown me-2" style="color: #00aff0;"></i>
                Subscription Plans
              </h5>
              <button
                class="btn btn-sm"
                @click="showAddPlanModal"
                :disabled="plans.length >= 4"
                :style="{ 'background-color': '#00aff0', 'border-color': '#00aff0', 'color': '#ffffff', 'font-weight': '600', 'border-radius': '8px', 'padding': '0.5rem 1rem', 'transition': 'all 0.2s ease', 'opacity': plans.length >= 4 ? 0.5 : 1 }"
                @mouseover="e => { if(plans.length < 4) e.target.style.backgroundColor = '#0091ea'; }"
                @mouseout="e => { if(plans.length < 4) e.target.style.backgroundColor = '#00aff0'; }"
              >
                <i class="fas fa-plus me-1"></i>
                Add Plan
              </button>
            </div>
            <div class="card-body" style="padding: 1.5rem;">
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
                      <div>
                        <button
                          class="btn btn-sm"
                          type="button"
                          @click="startEditPlan(plan)"
                          :title="planEditOpen[plan.id] ? 'Close' : 'Edit plan'"
                          :style="planEditOpen[plan.id] ? { 'background-color': '#00aff0', 'border-color': '#00aff0', 'color': '#ffffff' } : { 'background-color': 'transparent', 'border': '2px solid #e0e0e0', 'color': '#666666' }"
                          style="font-weight: 600; border-radius: 8px; padding: 0.5rem 0.75rem; transition: all 0.2s ease;"
                          @mouseover="e => { if(!planEditOpen[plan.id]) { e.target.style.borderColor = '#00aff0'; e.target.style.color = '#00aff0'; } }"
                          @mouseout="e => { if(!planEditOpen[plan.id]) { e.target.style.borderColor = '#e0e0e0'; e.target.style.color = '#666666'; } }"
                        >
                          <i :class="planEditOpen[plan.id] ? 'fas fa-times' : 'fas fa-ellipsis-v'"></i>
                        </button>
                      </div>
                    </div>
                    <p class="card-text small text-muted">{{ plan.description }}</p>
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="fw-bold text-success">${{ plan.price }}</span>
                      <small class="text-muted">{{ plan.duration }} days</small>
                    </div>

                    <!-- Inline plan edit -->
                    <div v-if="planEditOpen && planEditOpen[plan.id]" class="mt-3 border rounded p-3 bg-light">
                      <div class="row g-3">
                        <div class="col-md-6">
                          <label class="form-label">Plan Name</label>
                          <input type="text" class="form-control" v-model="planEdit[plan.id].name" />
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Price ($)</label>
                          <input type="number" min="0" step="0.01" class="form-control" v-model="planEdit[plan.id].price" />
                        </div>
                        <div class="col-12">
                          <label class="form-label">Description</label>
                          <textarea class="form-control" rows="3" v-model="planEdit[plan.id].description"></textarea>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Duration (days)</label>
                          <input type="number" min="1" class="form-control" v-model="planEdit[plan.id].duration" />
                        </div>
                        
                      </div>
                       <div class="mt-4 d-flex flex-wrap gap-2 align-items-center">
                         <button class="btn btn-primary btn-sm action-btn no-padding" :disabled="savingPlan" @click="saveEditPlan(plan.id)">
                           <span v-if="savingPlan" class="spinner-border spinner-border-sm me-1"></span>
                           Save Changes
                         </button>
                         <button class="btn btn-outline-secondary btn-sm action-btn" @click="cancelEditPlan(plan.id)">Cancel</button>
                         <button class="btn btn-danger btn-sm action-btn" @click="deletePlan(plan.id)" title="Delete plan">
                           <i class="fas fa-trash" aria-hidden="true"></i>
                         </button>
                         <button class="btn btn-outline-info btn-sm action-btn" @click="togglePlanMedia(plan.id)" title="Manage media">
                           <i class="fa fa-paperclip" aria-hidden="true" style="color: rgb(0, 175, 240);"></i>
                         </button>
                       </div>
                    </div>

                    <!-- Media management content -->
                    <div v-if="planMediaExpanded && planMediaExpanded[plan.id]" class="mt-3 border rounded p-2 bg-light">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <strong>Plan Media</strong>
                        <div>
                          <label class="btn btn-sm btn-secondary mb-0">
                            <i class="fas fa-upload me-1"></i>
                            Upload
                            <input type="file" class="d-none" accept="image/*,video/*" multiple @change="(e) => uploadMoreMedia(plan.id, e)" />
                          </label>
                        </div>
                      </div>

                      <div v-if="planMediaLoading && planMediaLoading[plan.id]" class="text-center py-3 text-muted">
                        <span class="spinner-border spinner-border-sm me-2"></span>Loading...
                      </div>

                      <div v-else>
                        <div v-if="!(planMedia && planMedia[plan.id]) || (planMedia[plan.id] || []).length === 0" class="text-center text-muted py-3">
                          No media yet for this plan.
                        </div>
                        <div v-else class="row g-2">
                          <div v-for="m in (planMedia && planMedia[plan.id] ? planMedia[plan.id] : [])" :key="m.id" class="col-6">
                            <div class="position-relative border rounded p-1 bg-white">
                              <template v-if="m.type === 'IMAGE'">
                                <img :src="m.url" class="img-fluid rounded" alt="plan media" />
                              </template>
                              <template v-else>
                                <video :src="m.url" controls preload="metadata" class="w-100 rounded"></video>
                              </template>
                              <button class="btn btn-sm btn-danger position-absolute" style="top: 6px; right: 6px" @click="deleteMediaItem(m.id, plan.id)">
                                <i class="fas fa-trash"></i>
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

              

              <!-- Media inputs for plan creation -->
              <div v-if="!editingPlan" class="mb-3">
                <label class="form-label">Media (photos/videos)</label>
                <input
                  type="file"
                  class="form-control"
                  id="planFiles"
                  accept="image/*,video/*"
                  multiple
                  @change="handlePlanFiles"
                />
                <div class="form-text">You can select multiple files. Images and videos are supported.</div>
                <div v-if="planFiles && planFiles.length" class="small text-muted mt-1">
                  {{ planFiles.length }} file(s) selected
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

<!-- <script>
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
        duration: '',
        isActive: true
      },
      planFiles: [],
      planMedia: {}, // { [planId]: Media[] }
      planMediaLoading: {}, // { [planId]: boolean }
      planMediaExpanded: {}, // { [planId]: boolean }
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
        console.log('✅ Model save response:', response.data)

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

    // handleVideoUpload(event) {
    //   const file = event.target.files[0]
    //   if (file) {
    //     // In a real app, you'd upload the file here
    //     console.log('Video file selected:', file.name)
    //   }
    // },

    handleVideoUpload(event) {
  const file = event.target.files[0]
  if (file) {
    // Validate file type
    if (!file.type.startsWith('video/')) {
      this.$swal({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please select a valid video file.',
        confirmButtonText: 'OK'
      })
      return
    }

    // Validate file size (100MB max for videos)
    if (file.size > 100 * 1024 * 1024) {
      this.$swal({
        icon: 'error',
        title: 'File Too Large',
        text: 'Please select a video smaller than 100MB.',
        confirmButtonText: 'OK'
      })
      return
    }

    console.log('🎥 Video file selected:', file.name)
    this.selectedVideoFile = file
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
        duration: '',
        isActive: true
      }
      this.planFiles = []
      this.editingPlan = null
    },

    async savePlan() {
      try {
        this.savingPlan = true

        if (this.editingPlan) {
          await api.put(`/manager/plans/${this.editingPlan.id}`, this.planForm)
        } else {
          const formData = new FormData()
          formData.append('name', this.planForm.name)
          formData.append('description', this.planForm.description)
          formData.append('price', this.planForm.price)
          formData.append('duration', this.planForm.duration)
          if (this.planFiles && this.planFiles.length) {
            for (const file of this.planFiles) {
              formData.append('files', file)
            }
          }
          await api.post('/manager/plans', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
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

    handlePlanFiles(event) {
      const files = Array.from(event.target.files || [])
      if (!files.length) {
        this.planFiles = []
        return
      }
      const validated = []
      for (const file of files) {
        const isImage = file.type.startsWith('image/')
        const isVideo = file.type.startsWith('video/')
        if (!isImage && !isVideo) continue
        const maxSize = isImage ? 10 * 1024 * 1024 : 200 * 1024 * 1024
        if (file.size <= maxSize) {
          validated.push(file)
        }
      }
      this.planFiles = validated
    },

    async togglePlanMedia(planId) {
      this.planMediaExpanded = {
        ...this.planMediaExpanded,
        [planId]: !this.planMediaExpanded[planId]
      }
      if (this.planMediaExpanded[planId] && !this.planMedia[planId]) {
        await this.loadPlanMedia(planId)
      }
    },

    async loadPlanMedia(planId) {
      try {
        this.planMediaLoading = { ...this.planMediaLoading, [planId]: true }
        const { data } = await api.get(`/manager/plans/${planId}/media`)
        this.planMedia = { ...this.planMedia, [planId]: data.media || [] }
      } catch (e) {
        console.error('Error loading plan media:', e)
      } finally {
        this.planMediaLoading = { ...this.planMediaLoading, [planId]: false }
      }
    },

    async uploadMoreMedia(planId, event) {
      const files = Array.from(event.target.files || [])
      if (!files.length) return
      const form = new FormData()
      for (const file of files) {
        const isImage = file.type.startsWith('image/')
        const isVideo = file.type.startsWith('video/')
        if (!isImage && !isVideo) continue
        const maxSize = isImage ? 10 * 1024 * 1024 : 200 * 1024 * 1024
        if (file.size <= maxSize) form.append('files', file)
      }
      try {
        this.planMediaLoading = { ...this.planMediaLoading, [planId]: true }
        await api.post(`/manager/plans/${planId}/media`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
        await this.loadPlanMedia(planId)
        // reset input value
        event.target.value = ''
      } catch (e) {
        console.error('Error uploading media:', e)
      } finally {
        this.planMediaLoading = { ...this.planMediaLoading, [planId]: false }
      }
    },

    async deleteMediaItem(mediaId, planId) {
      const result = await this.$swal({
        icon: 'warning',
        title: 'Delete Media',
        text: 'Are you sure you want to delete this media?',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete',
        cancelButtonText: 'Cancel'
      })
      if (!result.isConfirmed) return
      try {
        this.planMediaLoading = { ...this.planMediaLoading, [planId]: true }
        await api.delete(`/manager/media/${mediaId}`)
        await this.loadPlanMedia(planId)
      } catch (e) {
        console.error('Error deleting media:', e)
      } finally {
        this.planMediaLoading = { ...this.planMediaLoading, [planId]: false }
      }
    }

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
</script> -->







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
        photoUrl: null,
        videoUrl: null
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
      planFiles: [],
      planMedia: {},
      planMediaLoading: {},
      planMediaExpanded: {},
      planEdit: {},
      planEditOpen: {},
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
            photoUrl: model.photoUrl || null,
            videoUrl: model.videoUrl || null
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

    // async saveModel() {
    //   try {
    //     this.saving = true

    //     const formData = new FormData()
    //     formData.append('name', this.modelForm.name)
    //     formData.append('surname', this.modelForm.surname)
    //     formData.append('bio', this.modelForm.bio)
    //     formData.append('age', this.modelForm.age)
    //     formData.append('hairColor', this.modelForm.hairColor)
    //     formData.append('skinColor', this.modelForm.skinColor)

    //     if (this.selectedPhotoFile) {
    //       formData.append('photo', this.selectedPhotoFile)
    //     }

    //     if (this.selectedVideoFile) {
    //       formData.append('video', this.selectedVideoFile)
    //     }

    //     const response = await api.post('/manager/model', formData, {
    //       headers: {
    //         'Content-Type': 'multipart/form-data'
    //       }
    //     })

    //     console.log('✅ Model save response:', response.data)

    //     this.$swal({
    //       icon: 'success',
    //       title: 'Model Saved!',
    //       text: 'Your model profile has been updated successfully.',
    //       confirmButtonText: 'Great!'
    //     })

    //     // ✅ Prevent “Failed to save” popup by exiting here
    //     this.selectedPhotoFile = null
    //     this.selectedVideoFile = null

    //     await this.loadModel()
    //     return
    //   } catch (error) {
    //     console.error('Error saving model:', error)
    //     this.$swal({
    //       icon: 'error',
    //       title: 'Save Failed',
    //       text: error.response?.data?.message || 'Failed to save model. Please try again.',
    //       confirmButtonText: 'OK'
    //     })
    //   } finally {
    //     this.saving = false
    //   }
    // },



    async saveModel() {
      this.saving = true
      
      // Store old blob URLs for cleanup
      const oldPhotoBlobUrl = this.selectedPhotoFile && this.modelForm.photoUrl?.startsWith('blob:') 
        ? this.modelForm.photoUrl 
        : null
      const oldVideoBlobUrl = this.selectedVideoFile && this.modelForm.videoUrl?.startsWith('blob:') 
        ? this.modelForm.videoUrl 
        : null
      
      try {
        const formData = new FormData()
        formData.append('name', this.modelForm.name)
        formData.append('surname', this.modelForm.surname)
        formData.append('bio', this.modelForm.bio)
        formData.append('age', this.modelForm.age)
        formData.append('hairColor', this.modelForm.hairColor)
        formData.append('skinColor', this.modelForm.skinColor)

        if (this.selectedPhotoFile) {
          formData.append('photo', this.selectedPhotoFile)
        }
        if (this.selectedVideoFile) {
          formData.append('video', this.selectedVideoFile)
        }

        const response = await api.post('/manager/model', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        console.log('✅ Model save response:', response.data)
        
        if (response.status === 200 && response.data.model) {
          const savedModel = response.data.model
          
          // Clean up old blob URLs to prevent memory leaks
          if (oldPhotoBlobUrl) {
            URL.revokeObjectURL(oldPhotoBlobUrl)
          }
          if (oldVideoBlobUrl) {
            URL.revokeObjectURL(oldVideoBlobUrl)
          }
          
          // ✅ Instantly update UI with saved URLs from MinIO
          if (savedModel.photoUrl) {
            this.modelForm.photoUrl = savedModel.photoUrl
          }
          if (savedModel.videoUrl) {
            this.modelForm.videoUrl = savedModel.videoUrl
          }

          this.$swal({
            icon: 'success',
            title: 'Model Saved!',
            text: 'Your model profile has been updated successfully.',
            confirmButtonText: 'Great!'
          })

          // Clear selected files
          this.selectedPhotoFile = null
          this.selectedVideoFile = null
          
          // Reset file inputs
          const photoInput = document.getElementById('photo')
          const videoInput = document.getElementById('video')
          if (photoInput) photoInput.value = ''
          if (videoInput) videoInput.value = ''
          
          // Reload from server to ensure we have latest data
          await this.loadModel()
        } else {
          throw new Error('Unexpected response format')
        }
      } catch (error) {
        console.error('❌ Save model error (frontend):', error)
        this.$swal({
          icon: 'error',
          title: 'Save Failed',
          text: error.response?.data?.message || error.message || 'Failed to save model. Please try again.',
          confirmButtonText: 'OK'
        })
      } finally {
        this.saving = false
      }
    },


    handlePhotoUpload(event) {
      const file = event.target.files[0]
      if (file) {
        if (!file.type.startsWith('image/')) {
          this.$swal({
            icon: 'error',
            title: 'Invalid File',
            text: 'Please select an image file.',
            confirmButtonText: 'OK'
          })
          return
        }

        if (file.size > 10 * 1024 * 1024) {
          this.$swal({
            icon: 'error',
            title: 'File Too Large',
            text: 'Please select an image smaller than 10MB.',
            confirmButtonText: 'OK'
          })
          return
        }

        this.modelForm.photoUrl = URL.createObjectURL(file)
        this.selectedPhotoFile = file
      }
    },

    handleVideoUpload(event) {
      const file = event.target.files[0]
      if (file) {
        if (!file.type.startsWith('video/')) {
          this.$swal({
            icon: 'error',
            title: 'Invalid File',
            text: 'Please select a valid video file.',
            confirmButtonText: 'OK'
          })
          return
        }

        if (file.size > 200 * 1024 * 1024) {
          this.$swal({
            icon: 'error',
            title: 'File Too Large',
            text: 'Please select a video smaller than 200MB.',
            confirmButtonText: 'OK'
          })
          return
        }

        console.log('🎥 Video file selected:', file.name)
        // Show preview with blob URL - will be replaced with MinIO URL after save
        const previewUrl = URL.createObjectURL(file)
        this.modelForm.videoUrl = previewUrl
        this.selectedVideoFile = file
      } else {
        // Reset video input
        this.selectedVideoFile = null
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
      // legacy modal path not used; keep for compatibility
      this.startEditPlan(plan)
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
          const formData = new FormData()
          formData.append('name', this.planForm.name)
          formData.append('description', this.planForm.description)
          formData.append('price', this.planForm.price)
          formData.append('duration', this.planForm.duration)
          for (const file of this.planFiles) {
            formData.append('files', file)
          }
          await api.post('/manager/plans', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
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

    startEditPlan(plan) {
      // Toggle the plan edit section
      const isCurrentlyOpen = this.planEditOpen[plan.id]
      
      if (!isCurrentlyOpen) {
        // Opening - initialize the edit form
        this.planEdit = {
          ...this.planEdit,
          [plan.id]: {
            id: plan.id,
            name: plan.name,
            description: plan.description,
            price: plan.price,
            duration: plan.duration,
            isActive: plan.isActive !== undefined ? plan.isActive : true
          }
        }
      }
      
      // Toggle the open state
      this.planEditOpen = { ...this.planEditOpen, [plan.id]: !isCurrentlyOpen }
      
      // If closing, also close the media section if it's open
      if (isCurrentlyOpen && this.planMediaExpanded[plan.id]) {
        this.planMediaExpanded = { ...this.planMediaExpanded, [plan.id]: false }
      }
    },

    cancelEditPlan(planId) {
      this.planEditOpen = { ...this.planEditOpen, [planId]: false }
    },

    async saveEditPlan(planId) {
      try {
        this.savingPlan = true
        const form = this.planEdit[planId]
        await api.put(`/manager/plans/${planId}`, {
          name: form.name,
          description: form.description,
          price: form.price,
          duration: form.duration,
          isActive: form.isActive
        })
        await this.loadPlans()
        this.planEditOpen = { ...this.planEditOpen, [planId]: false }
        this.$swal({ icon: 'success', title: 'Plan updated', timer: 1200, showConfirmButton: false })
      } catch (e) {
        console.error('Failed to update plan', e)
        this.$swal({ icon: 'error', title: 'Update failed', text: e.response?.data?.message || 'Try again' })
      } finally {
        this.savingPlan = false
      }
    },

    handlePlanFiles(event) {
      const files = Array.from(event.target.files || [])
      if (!files.length) { this.planFiles = []; return }
      const validated = []
      for (const f of files) {
        const isImg = f.type.startsWith('image/')
        const isVid = f.type.startsWith('video/')
        if (!isImg && !isVid) continue
        const max = isImg ? 10 * 1024 * 1024 : 200 * 1024 * 1024
        if (f.size <= max) validated.push(f)
      }
      this.planFiles = validated
    },

    async togglePlanMedia(planId) {
      this.planMediaExpanded = { ...this.planMediaExpanded, [planId]: !this.planMediaExpanded[planId] }
      if (this.planMediaExpanded[planId] && !this.planMedia[planId]) {
        await this.loadPlanMedia(planId)
      }
    },

    async loadPlanMedia(planId) {
      try {
        this.planMediaLoading = { ...this.planMediaLoading, [planId]: true }
        const { data } = await api.get(`/manager/plans/${planId}/media`)
        this.planMedia = { ...this.planMedia, [planId]: data.media || [] }
      } catch (e) {
        console.error('Error loading plan media:', e)
      } finally {
        this.planMediaLoading = { ...this.planMediaLoading, [planId]: false }
      }
    },

    async uploadMoreMedia(planId, event) {
      const files = Array.from(event.target.files || [])
      if (!files.length) return
      const form = new FormData()
      for (const file of files) {
        const isImage = file.type.startsWith('image/')
        const isVideo = file.type.startsWith('video/')
        if (!isImage && !isVideo) continue
        const maxSize = isImage ? 10 * 1024 * 1024 : 200 * 1024 * 1024
        if (file.size <= maxSize) form.append('files', file)
      }
      try {
        this.planMediaLoading = { ...this.planMediaLoading, [planId]: true }
        await api.post(`/manager/plans/${planId}/media`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
        await this.loadPlanMedia(planId)
        event.target.value = ''
      } catch (e) {
        console.error('Error uploading media:', e)
      } finally {
        this.planMediaLoading = { ...this.planMediaLoading, [planId]: false }
      }
    },

    async deleteMediaItem(mediaId, planId) {
      const result = await this.$swal({
        icon: 'warning',
        title: 'Delete Media',
        text: 'Are you sure you want to delete this media?',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete',
        cancelButtonText: 'Cancel'
      })
      if (!result.isConfirmed) return
      try {
        this.planMediaLoading = { ...this.planMediaLoading, [planId]: true }
        await api.delete(`/manager/media/${mediaId}`)
        await this.loadPlanMedia(planId)
      } catch (e) {
        console.error('Error deleting media:', e)
      } finally {
        this.planMediaLoading = { ...this.planMediaLoading, [planId]: false }
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

<style scoped>
.action-btn {
  min-height: 36px;
  display: inline-flex;
  align-items: center;
}

.no-padding {
  padding: 0.35rem 0.75rem;
}
</style>
