<template>
  <div class="container py-4">
    <h3 class="mb-3"><i class="fas fa-user-friends me-2"></i>My Models</h3>

    <div v-if="loading" class="text-center text-muted py-5">
      <span class="spinner-border spinner-border-sm me-2"></span>Loading...
    </div>

    <div v-else>
      <div v-if="models.length === 0" class="text-center text-muted py-5">
        You have no active subscriptions yet.
      </div>

      <div v-else class="list-group">
        <div class="list-group-item" v-for="model in models" :key="model.id">
          <div class="d-flex justify-content-between align-items-center" @click="toggle(model.id)" style="cursor:pointer;">
            <div class="d-flex align-items-center">
              <img v-if="model.photoUrl" :src="model.photoUrl" class="rounded me-2" style="width:40px;height:40px;object-fit:cover;" />
              <span class="fw-semibold">{{ model.name }} {{ model.surname }}</span>
            </div>
            <i :class="['fas', expanded[model.id] ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
          </div>
          <div v-show="expanded[model.id]" class="mt-3">
            <!-- Model details -->
            <div class="card mb-3">
              <div class="card-body">
                <div class="d-flex align-items-start">
                  <img v-if="model.photoUrl" :src="model.photoUrl" class="rounded me-3" style="width:72px;height:72px;object-fit:cover;" />
                  <div class="flex-grow-1">
                    <div class="d-flex justify-content-between flex-wrap">
                      <div>
                        <h5 class="mb-1">{{ model.name }} {{ model.surname }}</h5>
                        <div class="text-muted small">
                          <span v-if="model.age">Age: {{ model.age }}</span>
                          <span v-if="model.hairColor" class="ms-3">Hair: {{ model.hairColor }}</span>
                          <span v-if="model.skinColor" class="ms-3">Skin: {{ model.skinColor }}</span>
                        </div>
                      </div>
                      <div v-if="plansByModel[model.id] && plansByModel[model.id].length" class="text-end">
                        <div class="small text-muted">Subscribed plans</div>
                        <div>
                          <span
                            v-for="p in plansByModel[model.id]"
                            :key="p.id"
                            class="badge bg-secondary me-1 mb-1"
                            :title="p.description"
                          >
                            {{ p.name }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p v-if="model.bio" class="mb-0 mt-2">{{ model.bio }}</p>
                  </div>
                </div>
                <div v-if="model.videoUrl" class="mt-3">
                  <video :src="model.videoUrl" controls preload="metadata" class="w-100 rounded"></video>
                </div>
              </div>
            </div>

            <div v-if="mediaLoading[model.id]" class="text-center text-muted py-3">
              <span class="spinner-border spinner-border-sm me-2"></span>Loading media...
            </div>
            <div v-else>
              <div v-if="(modelMedia[model.id] || []).length === 0" class="text-center text-muted py-3">
                No media available.
              </div>
              <div v-else class="row g-2">
                <div class="col-6 col-md-4 col-lg-3" v-for="m in modelMedia[model.id]" :key="m.id">
                  <div class="border rounded p-1 bg-white h-100">
                    <template v-if="m.type === 'IMAGE'">
                      <img :src="m.url" class="img-fluid rounded" alt="media" />
                    </template>
                    <template v-else>
                      <video :src="m.url" controls preload="metadata" class="w-100 rounded"></video>
                    </template>
                  </div>
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
import api from '../../services/api'

export default {
  name: 'UserModels',
  data() {
    return {
      loading: true,
      models: [],
      modelMedia: {},
      mediaLoading: {},
      expanded: {},
      plansByModel: {}
    }
  },
  async mounted() {
    await this.loadSubscriptions()
  },
  methods: {
    async loadSubscriptions() {
      try {
        this.loading = true
        const { data } = await api.get('/user/subscriptions')
        const subs = data.subscriptions || []
        // Unique models from subscriptions
        const seen = new Set()
        const models = []
        for (const s of subs) {
          if (s.model && !seen.has(s.model.id)) {
            seen.add(s.model.id)
            models.push(s.model)
          }
        }
        this.models = models
      } catch (e) {
        console.error('Failed to load subscriptions', e)
      } finally {
        this.loading = false
      }
    },

    async onExpand(modelId) {
      if (this.modelMedia[modelId]) return
      try {
        this.mediaLoading = { ...this.mediaLoading, [modelId]: true }
        const { data } = await api.get(`/user/models/${modelId}/media`)
        this.modelMedia = { ...this.modelMedia, [modelId]: data.media || [] }
        // store plans for badges
        const byModel = this.plansByModel || {}
        byModel[modelId] = data.plans || []
        this.plansByModel = { ...byModel }
      } catch (e) {
        console.error('Failed to load model media', e)
      } finally {
        this.mediaLoading = { ...this.mediaLoading, [modelId]: false }
      }
    },

    async toggle(modelId) {
      this.expanded = { ...this.expanded, [modelId]: !this.expanded[modelId] }
      if (this.expanded[modelId] && !this.modelMedia[modelId]) {
        await this.onExpand(modelId)
      }
    }
  }
}
</script>

<style scoped>
</style>


