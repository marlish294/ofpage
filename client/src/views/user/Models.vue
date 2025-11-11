<template>
  <div style="min-height: 100vh; background-color: #ffffff;" class="container py-4">
    <h3 style="color: #1a1a1a; font-size: 2rem; font-weight: 700; margin-bottom: 2rem; max-width: 950px;"><i class="fas fa-user-friends me-2" style="color: #00aff0;"></i>My Models</h3>

    <div v-if="loading" class="text-center text-muted py-5">
      <span class="spinner-border spinner-border-sm me-2"></span>Loading...
    </div>

    <div v-else>
      <div v-if="models.length === 0" class="text-center text-muted py-5">
        You have no active subscriptions yet.
      </div>

      <div v-else class="list-group" style="border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);">
        <div class="list-group-item" v-for="model in models" :key="model.id" style="border: 1px solid #e0e0e0; border-radius: 12px; margin-bottom: 1rem; padding: 1.5rem; transition: all 0.2s ease;" @mouseover="e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 175, 240, 0.15)'" @mouseout="e => e.currentTarget.style.boxShadow = 'none'">
          <div class="d-flex justify-content-between align-items-center" @click="toggle(model.id)" style="cursor:pointer;">
            <div class="d-flex align-items-center">
              <img v-if="model.photoUrl" :src="model.photoUrl" class="rounded me-2" style="width:40px;height:40px;object-fit:cover;" />
              <span class="fw-semibold">{{ model.name }} {{ model.surname }}</span>
            </div>
            <div class="d-flex align-items-center gap-2">
              <div v-if="mediaCounts[model.id]" class="text-muted small d-flex align-items-center gap-2">
                <div class="count-pill">
                  <i class="fas fa-image me-1"></i>{{ mediaCounts[model.id].images }} images
                </div>
                <div class="count-pill">
                  <i class="fas fa-video me-1"></i>{{ mediaCounts[model.id].videos }} videos
                </div>
              </div>
              <div v-else class="text-muted small">
                <span class="spinner-border spinner-border-sm"></span>
              </div>
              <i :class="['fas', expanded[model.id] ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
            </div>
          </div>
          <div v-show="expanded[model.id]" class="mt-3">
            <!-- Model details -->
            <div class="card mb-3" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);">
              <div class="card-body" style="padding: 1.5rem;">
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
                  <div class="media-card">
                    <div class="media-thumb">
                      <template v-if="m.type === 'IMAGE'">
                        <img :src="m.url" alt="media" />
                      </template>
                      <template v-else>
                        <video :src="m.url" controls preload="metadata" class="media-video-controls"></video>
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
      plansByModel: {},
      mediaCounts: {}
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

        await this.fetchCountsForModels(models)
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
        const mediaList = data.media || []
        const counts = data.counts || this.calculateCounts(mediaList)
        this.modelMedia = { ...this.modelMedia, [modelId]: mediaList }
        // store plans for badges
        const byModel = this.plansByModel || {}
        byModel[modelId] = data.plans || []
        this.plansByModel = { ...byModel }
        this.mediaCounts = { ...this.mediaCounts, [modelId]: counts }
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
    },

    async fetchCountsForModels(models = []) {
      if (!models.length) {
        this.mediaCounts = {}
        return
      }

      try {
        const requests = models.map(async (model) => {
          try {
            const { data } = await api.get(`/user/models/${model.id}/media`, {
              params: { countsOnly: true }
            })
            return {
              id: model.id,
              counts: data.counts || this.calculateCounts(data.media || [])
            }
          } catch (error) {
            console.error('Failed to load media counts', error)
            return {
              id: model.id,
              counts: { images: 0, videos: 0, other: 0, total: 0 }
            }
          }
        })

        const results = await Promise.all(requests)
        const nextCounts = { ...this.mediaCounts }
        results.forEach(({ id, counts }) => {
          nextCounts[id] = counts
        })
        this.mediaCounts = nextCounts
      } catch (error) {
        console.error('Failed to fetch media counts', error)
      }
    },

    calculateCounts(mediaList = []) {
      const counts = { images: 0, videos: 0, other: 0, total: 0 }
      mediaList.forEach((item) => {
        if (item.type === 'IMAGE') {
          counts.images += 1
        } else if (item.type === 'VIDEO') {
          counts.videos += 1
        } else {
          counts.other += 1
        }
        counts.total += 1
      })
      return counts
    }
  }
}
</script>

<style scoped>
.count-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background-color: #f1f5f9;
  color: #1a1a1a;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.count-pill i {
  color: rgb(0, 175, 240);
  font-size: 1rem;
  margin-right: 0.35rem;
}

.media-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
}

.media-thumb {
  position: relative;
  width: 100%;
  padding-top: 133.333%;
  background-color: #f8fafc;
}

.media-thumb img,
.media-thumb video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-video-controls {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.media-meta {
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  color: #475569;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
}
</style>


