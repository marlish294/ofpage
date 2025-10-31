<template>
  <div style="min-height: 100vh; background-color: #ffffff;" class="container-fluid py-4">
    <div class="container">
      <div class="row mb-3">
        <div class="col-12">
          <h2 style="color: #1a1a1a; font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">
            <i class="fas fa-comments me-2" style="color: #00aff0;"></i>
            Chat Monitoring
          </h2>
          <p style="color: #666666; font-size: 1rem; margin-bottom: 2rem;">Monitor all conversations (view-only)</p>
        </div>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="row mb-3">
      <div class="col-md-4">
        <div class="card" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); margin-bottom: 1.5rem;">
          <div class="card-body" style="padding: 1.5rem;">
            <label class="form-label" style="color: #1a1a1a; font-weight: 700; margin-bottom: 0.75rem;">
              <i class="fas fa-filter me-1" style="color: #00aff0;"></i>
              Filter by User/Manager
            </label>
            <select 
              class="form-select" 
              v-model="filterUserId" 
              @change="applyFilter"
            >
              <option value="">All Users/Managers</option>
              <option v-for="user in usersAndManagers" :key="user.id" :value="user.id">
                {{ user.email }} ({{ user.role }})
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); margin-bottom: 1.5rem;">
          <div class="card-body" style="padding: 1.5rem;">
            <label class="form-label" style="color: #1a1a1a; font-weight: 700; margin-bottom: 0.75rem;">
              <i class="fas fa-user-tie me-1" style="color: #00aff0;"></i>
              Filter by Model
            </label>
            <select 
              class="form-select" 
              v-model="filterModelId" 
              @change="applyFilter"
            >
              <option value="">All Models</option>
              <option v-for="model in allModels" :key="model.id" :value="model.id">
                {{ model.name }} {{ model.surname }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); margin-bottom: 1.5rem;">
          <div class="card-body d-flex align-items-end" style="padding: 1.5rem;">
            <button 
              class="btn w-100" 
              @click="clearFilters"
              :disabled="!filterUserId && !filterModelId"
              :style="{ 'background-color': 'transparent', 'border': '2px solid #e0e0e0', 'color': '#666666', 'font-weight': '600', 'border-radius': '8px', 'padding': '0.75rem 1.5rem', 'transition': 'all 0.2s ease', 'opacity': (!filterUserId && !filterModelId) ? 0.5 : 1 }"
              @mouseover="e => { if(filterUserId || filterModelId) { e.target.style.borderColor = '#00aff0'; e.target.style.color = '#00aff0'; } }"
              @mouseout="e => { if(filterUserId || filterModelId) { e.target.style.borderColor = '#e0e0e0'; e.target.style.color = '#666666'; } }"
            >
              <i class="fas fa-times me-1"></i>
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <!-- Chat Sidebar -->
      <div class="col-lg-3">
        <div class="card" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); margin-bottom: 1.5rem;">
          <div class="card-header" style="background-color: #ffffff; border-bottom: 1px solid #e0e0e0; padding: 1.25rem 1.5rem; border-radius: 12px 12px 0 0;">
            <h5 class="mb-0" style="color: #1a1a1a; font-weight: 700;">
              <i class="fas fa-comments me-2" style="color: #00aff0;"></i>
              Conversations
            </h5>
            <small style="color: #8a96a3; display: block; margin-top: 0.5rem;">View-only mode</small>
          </div>
          <div class="card-body p-0">
            <div v-if="chatsLoading" class="text-center p-3">
              <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            
            <div v-else-if="models.length === 0" class="text-center p-3 text-muted">
              <i class="fas fa-inbox fa-2x mb-2"></i>
              <p class="mb-0">No conversations found</p>
              <small v-if="filterUserId || filterModelId">
                Try adjusting your filters.
              </small>
              <small v-else>
                Chats will appear here when users start conversations with models.
              </small>
            </div>
            
            <div v-else class="list-group list-group-flush">
              <div
                v-for="model in models"
                :key="model.id"
                class="model-group"
              >
                <!-- Model Header (Collapsible) -->
                <div
                  class="list-group-item model-header"
                  @click="toggleModel(model.id)"
                  :class="{ 'model-expanded': expandedModels.includes(model.id) }"
                  style="cursor: pointer; background-color: #f8f9fa; font-weight: 600;"
                >
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                      <i 
                        class="fas me-2"
                        :class="expandedModels.includes(model.id) ? 'fa-chevron-down' : 'fa-chevron-right'"
                      ></i>
                      <div class="avatar me-2" style="width: 35px; height: 35px; background-color: #00c78b; color: white; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
                        {{ model.name.charAt(0).toUpperCase() }}
                      </div>
                      <span>{{ model.name }} {{ model.surname }}</span>
                    </div>
                    <span class="badge bg-secondary">{{ model.users.length }}</span>
                  </div>
                </div>

                <!-- Users under this model (Expandable) -->
                <div
                  v-show="expandedModels.includes(model.id)"
                  class="users-list"
                >
                  <div
                    v-for="userChat in model.users"
                    :key="`${userChat.userId}-${model.id}`"
                    class="list-group-item list-group-item-action user-item"
                    @click.stop="switchChat(userChat.userId, model.id)"
                    :class="{ active: currentChatKey === `${userChat.userId}-${model.id}` }"
                    style="padding-left: 3rem;"
                  >
                    <div class="d-flex align-items-center">
                      <div class="avatar me-3" style="width: 30px; height: 30px; background-color: #6f42c1; color: white; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 0.8rem;">
                        {{ userChat.user.email.charAt(0).toUpperCase() }}
                      </div>
                      <div class="flex-grow-1">
                        <div class="d-flex align-items-center">
                          <h6 class="mb-0 me-2">{{ userChat.user.email }}</h6>
                          <span class="badge" :class="userChat.user.role === 'MANAGER' ? 'bg-success' : 'bg-primary'" style="font-size: 0.65rem;">
                            {{ userChat.user.role }}
                          </span>
                        </div>
                        <div v-if="userChat.lastMessage" class="text-truncate" style="max-width: 180px; font-size: 0.75rem; color: #6c757d;">
                          {{ userChat.lastMessage.isFromUser ? userChat.user.email : model.name }}: {{ userChat.lastMessage.content.substring(0, 25) }}...
                        </div>
                        <small v-else class="text-muted">No messages yet</small>
                      </div>
                      <i class="fas fa-chevron-right"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Area -->
      <div class="col-lg-9">
        <div v-if="!currentChatKey" class="card h-100">
          <div class="card-body d-flex align-items-center justify-content-center">
            <div class="text-center text-muted">
              <i class="fas fa-comments fa-3x mb-3"></i>
              <h4>Select a conversation to view</h4>
              <p>Choose a user conversation from a model to view the chat messages.</p>
            </div>
          </div>
        </div>

        <div v-else class="card h-100 d-flex flex-column">
          <!-- Chat Header -->
          <div class="card-header d-flex align-items-center">
            <div class="avatar me-3" style="width: 40px; height: 40px; background-color: #6f42c1; color: white; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
              {{ currentUser?.email?.charAt(0).toUpperCase() }}
            </div>
            <div class="flex-grow-1">
              <h6 class="mb-0">{{ currentUser?.email }}</h6>
              <small class="text-muted">
                Conversation with {{ currentModel?.name }} {{ currentModel?.surname }}
                <span class="badge ms-2" :class="currentUser?.role === 'MANAGER' ? 'bg-success' : 'bg-primary'">
                  {{ currentUser?.role }}
                </span>
              </small>
            </div>
            <div class="text-muted">
              <span class="badge bg-secondary">View Only</span>
            </div>
          </div>

          <!-- Messages Area -->
          <div class="card-body flex-grow-1 d-flex flex-column p-0">
            <div
              ref="messagesContainer"
              class="messages-container flex-grow-1 p-0"
              style="height: 500px; overflow-y: auto; background-color: #f8f9fa;"
            >
              <div v-if="messagesLoading" class="text-center py-3">
                <div class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Loading messages...</span>
                </div>
              </div>
              
              <div v-else-if="messages.length === 0" class="text-center py-5 text-muted">
                <i class="fas fa-comment-dots fa-2x mb-3"></i>
                <p>No messages in this conversation yet.</p>
              </div>
              
              <div v-else>
                <div
                  v-for="message in messages"
                  :key="message.id"
                  class="message mb-0"
                  :class="{ 'text-end': !message.isFromUser }"
                >
                  <div
                    class="d-inline-block p-3 rounded"
                    :class="message.isFromUser ? 'bg-primary text-white' : 'bg-white border'"
                    style="max-width: 70%;"
                  >
                    <div class="message-content">{{ message.content }}</div>
                    <div class="message-time mt-1" :class="message.isFromUser ? 'text-white-50' : 'text-muted'">
                      <small>{{ formatTime(message.createdAt) }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- View Only Notice -->
            <div class="border-top p-0 bg-light">
              <div class="text-center text-muted">
                <i class="fas fa-eye me-2"></i>
                <small>View-only mode - Messages cannot be sent from admin interface</small>
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
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AdminChats',
  data() {
    return {
      models: [],
      allModels: [],
      usersAndManagers: [],
      chatsLoading: true,
      messages: [],
      messagesLoading: false,
      currentUserId: null,
      currentModelId: null,
      currentChatKey: null,
      currentUser: null,
      currentModel: null,
      expandedModels: [],
      filterUserId: '',
      filterModelId: ''
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('socket', ['connected'])
  },
  async mounted() {
    // Connect to socket for real-time updates
    this.connectSocket()
    
    await Promise.all([
      this.fetchModels(),
      this.fetchUsersAndManagers(),
      this.fetchChats()
    ])
    
    // Listen for new messages
    this.$nextTick(() => {
      const socket = this.$store.state.socket?.socket
      if (socket) {
        socket.on('new_message', (message) => {
          console.log('Admin received message:', message)
          if (this.currentChatKey === `${message.userId}-${message.modelId}`) {
            this.messages.push(message)
            this.$nextTick(() => {
              this.scrollToBottom()
            })
          }
        })
      }
    })
  },
  methods: {
    ...mapActions('socket', ['connectSocket']),

    async fetchModels() {
      try {
        const response = await api.get('/admin/models')
        this.allModels = response.data.models || []
      } catch (error) {
        console.error('Error fetching models:', error)
      }
    },

    async fetchUsersAndManagers() {
      try {
        const response = await api.get('/admin/users-and-managers')
        this.usersAndManagers = response.data.users || []
      } catch (error) {
        console.error('Error fetching users and managers:', error)
      }
    },

    async fetchChats() {
      try {
        this.chatsLoading = true
        const params = {}
        if (this.filterUserId) {
          params.filterUserId = this.filterUserId
        }
        if (this.filterModelId) {
          params.filterModelId = this.filterModelId
        }
        
        const response = await api.get('/admin/chat-conversations', { params })
        this.models = response.data.models || []
        
        // Auto-expand if filtered by model
        if (this.filterModelId && this.models.length === 1) {
          this.expandedModels = [this.models[0].id]
        }
      } catch (error) {
        console.error('Error fetching chats:', error)
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load conversations. Please try again.',
          confirmButtonText: 'OK'
        })
      } finally {
        this.chatsLoading = false
      }
    },

    toggleModel(modelId) {
      const index = this.expandedModels.indexOf(modelId)
      if (index > -1) {
        this.expandedModels.splice(index, 1)
      } else {
        this.expandedModels.push(modelId)
      }
    },

    async switchChat(userId, modelId) {
      const chatKey = `${userId}-${modelId}`
      if (this.currentChatKey === chatKey) return

      this.currentUserId = userId
      this.currentModelId = modelId
      this.currentChatKey = chatKey
      
      // Find current user and model from models structure
      const model = this.models.find(m => m.id === modelId)
      if (model) {
        const userChat = model.users.find(u => u.userId === userId)
        if (userChat) {
          this.currentUser = userChat.user
          this.currentModel = model
        }
      }
      
      this.messages = []
      
      // Load messages
      await this.loadMessages()
    },

    async loadMessages() {
      if (!this.currentUserId || !this.currentModelId) return

      try {
        this.messagesLoading = true
        const response = await api.get('/admin/chat-messages', {
          params: {
            userId: this.currentUserId,
            modelId: this.currentModelId
          }
        })
        this.messages = response.data.messages || []

        // Scroll to bottom
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      } catch (error) {
        console.error('Error loading messages:', error)
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load messages. Please try again.',
          confirmButtonText: 'OK'
        })
      } finally {
        this.messagesLoading = false
      }
    },

    applyFilter() {
      this.currentChatKey = null
      this.currentUser = null
      this.currentModel = null
      this.messages = []
      this.expandedModels = []
      this.fetchChats()
    },

    clearFilters() {
      this.filterUserId = ''
      this.filterModelId = ''
      this.applyFilter()
    },

    scrollToBottom() {
      const container = this.$refs.messagesContainer
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },

    formatTime(timestamp) {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date
      
      if (diff < 60000) { // Less than 1 minute
        return 'Just now'
      } else if (diff < 3600000) { // Less than 1 hour
        return Math.floor(diff / 60000) + 'm ago'
      } else if (diff < 86400000) { // Less than 1 day
        return Math.floor(diff / 3600000) + 'h ago'
      } else {
        return date.toLocaleDateString()
      }
    }
  }
}
</script>

<style scoped>
.messages-container {
  scroll-behavior: smooth;
}

.message {
  word-wrap: break-word;
}

.avatar {
  font-weight: bold;
}

.model-header {
  transition: background-color 0.2s;
}

.model-header:hover {
  background-color: #e9ecef !important;
}

.model-expanded {
  background-color: #e3f2fd !important;
  border-color: #2196f3 !important;
}

.user-item {
  transition: background-color 0.2s;
}

.list-group-item.user-item.active {
  background-color: #e3f2fd;
  border-color: #2196f3;
}

.list-group-item.user-item:hover {
  background-color: #f5f5f5;
}

.users-list {
  background-color: #ffffff;
}
</style>
