<template>
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <div class="col-12">
        <h2>
          <i class="fas fa-comments me-2"></i>
          Chat Monitoring
        </h2>
        <p class="text-muted">Monitor all conversations (read-only)</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h6 class="card-title">Filter by Model</h6>
            <select class="form-select" v-model="selectedModelId" @change="filterByModel">
              <option value="">All Models</option>
              <option v-for="model in models" :key="model.id" :value="model.id">
                {{ model.name }} {{ model.surname }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h6 class="card-title">Search Messages</h6>
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                v-model="searchTerm"
                placeholder="Search message content..."
                @keyup.enter="searchMessages"
              />
              <button class="btn btn-outline-secondary" @click="searchMessages">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Messages Table -->
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">All Messages ({{ pagination.total }})</h5>
        <button class="btn btn-primary btn-sm" @click="refreshMessages">
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
        
        <div v-else-if="messages.length === 0" class="text-center py-5">
          <i class="fas fa-comments fa-3x text-muted mb-3"></i>
          <h4 class="text-muted">No messages found</h4>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Message</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="message in messages" :key="message.id">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar me-3" style="width: 35px; height: 35px; background-color: #6f42c1; color: white; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
                      {{ message.user.email.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <div class="fw-bold">{{ message.user.email }}</div>
                      <small class="text-muted">{{ message.isFromUser ? 'User' : 'Model' }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar me-3" style="width: 35px; height: 35px; background-color: #28a745; color: white; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
                      {{ message.model.name.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <div class="fw-bold">{{ message.model.name }} {{ message.model.surname }}</div>
                      <small class="text-muted">Model</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="message-preview" style="max-width: 300px;">
                    {{ message.content.length > 100 ? message.content.substring(0, 100) + '...' : message.content }}
                  </div>
                </td>
                <td>
                  <div>
                    <div>{{ formatDate(message.createdAt) }}</div>
                    <small class="text-muted">{{ formatTime(message.createdAt) }}</small>
                  </div>
                </td>
                <td>
                  <button
                    class="btn btn-outline-info btn-sm"
                    @click="viewFullMessage(message)"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="pagination.pages > 1" class="card-footer">
        <nav>
          <ul class="pagination pagination-sm justify-content-center mb-0">
            <li class="page-item" :class="{ disabled: pagination.page === 1 }">
              <button class="page-link" @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1">
                Previous
              </button>
            </li>
            <li
              v-for="page in visiblePages"
              :key="page"
              class="page-item"
              :class="{ active: page === pagination.page }"
            >
              <button class="page-link" @click="changePage(page)">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: pagination.page === pagination.pages }">
              <button class="page-link" @click="changePage(pagination.page + 1)" :disabled="pagination.page === pagination.pages">
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../services/api'

export default {
  name: 'AdminChats',
  data() {
    return {
      messages: [],
      models: [],
      loading: true,
      selectedModelId: '',
      searchTerm: '',
      pagination: {
        page: 1,
        limit: 50,
        total: 0,
        pages: 0
      }
    }
  },
  computed: {
    visiblePages() {
      const pages = []
      const start = Math.max(1, this.pagination.page - 2)
      const end = Math.min(this.pagination.pages, this.pagination.page + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }
  },
  async mounted() {
    await Promise.all([
      this.fetchMessages(),
      this.fetchModels()
    ])
  },
  methods: {
    async fetchMessages() {
      try {
        this.loading = true
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit
        }
        
        if (this.selectedModelId) {
          params.modelId = this.selectedModelId
        }
        
        const response = await api.get('/admin/chats', { params })
        this.messages = response.data.messages
        this.pagination = response.data.pagination
      } catch (error) {
        console.error('Error fetching messages:', error)
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch messages. Please try again.',
          confirmButtonText: 'OK'
        })
      } finally {
        this.loading = false
      }
    },

    async fetchModels() {
      try {
        const response = await api.get('/admin/models')
        this.models = response.data.models
      } catch (error) {
        console.error('Error fetching models:', error)
      }
    },

    async filterByModel() {
      this.pagination.page = 1
      await this.fetchMessages()
    },

    async searchMessages() {
      this.pagination.page = 1
      await this.fetchMessages()
    },

    async changePage(page) {
      this.pagination.page = page
      await this.fetchMessages()
    },

    async refreshMessages() {
      await this.fetchMessages()
    },

    viewFullMessage(message) {
      this.$swal({
        title: 'Full Message',
        html: `
          <div class="text-start">
            <div class="mb-3">
              <strong>From:</strong> ${message.user.email} (${message.isFromUser ? 'User' : 'Model'})
            </div>
            <div class="mb-3">
              <strong>To:</strong> ${message.model.name} ${message.model.surname} (Model)
            </div>
            <div class="mb-3">
              <strong>Time:</strong> ${this.formatDate(message.createdAt)} at ${this.formatTime(message.createdAt)}
            </div>
            <div class="mb-3">
              <strong>Message:</strong>
              <div class="border p-3 rounded bg-light mt-2">
                ${message.content}
              </div>
            </div>
          </div>
        `,
        confirmButtonText: 'Close',
        width: '600px'
      })
    },

    formatDate(timestamp) {
      return new Date(timestamp).toLocaleDateString()
    },

    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString()
    }
  }
}
</script>
