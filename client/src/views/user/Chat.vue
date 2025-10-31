<template>
  <div style="min-height: 100vh; background-color: #ffffff;" class="container-fluid py-4">
    <div class="row">
      <!-- Chat Sidebar -->
      <div class="col-lg-3">
        <div class="card" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); margin-bottom: 1.5rem;">
          <div class="card-header" style="background-color: #ffffff; border-bottom: 1px solid #e0e0e0; padding: 1.25rem 1.5rem; border-radius: 12px 12px 0 0;">
            <h5 class="mb-0" style="color: #1a1a1a; font-weight: 700;">
              <i class="fas fa-comments me-2" style="color: #00aff0;"></i>
              My Chats
            </h5>
          </div>
          <div class="card-body p-0">
            <div v-if="chatModelsLoading" class="text-center p-3">
              <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            
            <div v-else-if="chatModels.length === 0" class="text-center p-3 text-muted">
              <i class="fas fa-heart-broken fa-2x mb-2"></i>
              <p class="mb-0">No active chats</p>
              <small>Subscribe to models to start chatting</small>
            </div>
            
            <div v-else class="list-group list-group-flush">
              <div
                v-for="model in chatModels"
                :key="model.id"
                class="list-group-item list-group-item-action"
                @click="switchChat(model.id)"
                :class="{ active: currentModelId === model.id }"
              >
                <div class="d-flex align-items-center">
                  <img
                    :src="model.photoUrl || 'https://via.placeholder.com/40x40'"
                    class="avatar me-3"
                    :alt="model.name"
                    style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"
                  />
                  <div class="flex-grow-1">
                    <h6 class="mb-0">{{ model.name }} {{ model.surname }}</h6>
                    <small class="text-muted">Click to chat</small>
                  </div>
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Area -->
      <div class="col-lg-9">
        <div v-if="!currentModelId" class="text-center py-5">
          <i class="fas fa-comments fa-3x text-muted mb-3"></i>
          <h4 class="text-muted">Select a chat to start messaging</h4>
          <p class="text-muted">Choose a model from the sidebar to begin your conversation</p>
        </div>

        <div v-else class="card h-100" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); margin-bottom: 1.5rem;">
          <!-- Chat Header -->
          <div class="card-header d-flex justify-content-between align-items-center" style="background-color: #ffffff; border-bottom: 1px solid #e0e0e0; padding: 1.25rem 1.5rem; border-radius: 12px 12px 0 0;">
            <div class="d-flex align-items-center">
              <img
                :src="currentModel?.photoUrl || 'https://via.placeholder.com/40x40'"
                class="avatar me-3"
                :alt="currentModel?.name"
                style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"
              />
              <div>
                <h5 class="mb-0">{{ currentModel?.name }} {{ currentModel?.surname }}</h5>
                <small class="text-muted">
                  <i class="fas fa-circle text-success me-1" style="font-size: 0.5rem;"></i>
                  Online
                </small>
              </div>
            </div>
            <button
              class="btn btn-sm"
              @click="goBack"
              style="background-color: transparent; border: 2px solid #e0e0e0; color: #666666; font-weight: 600; border-radius: 8px; padding: 0.5rem 1rem; transition: all 0.2s ease;"
              @mouseover="e => { e.target.style.borderColor = '#00aff0'; e.target.style.color = '#00aff0'; }"
              @mouseout="e => { e.target.style.borderColor = '#e0e0e0'; e.target.style.color = '#666666'; }"
            >
              <i class="fas fa-arrow-left me-1"></i>
              Back
            </button>
          </div>

          <!-- Messages -->
          <div class="card-body p-0">
            <div
              ref="messagesContainer"
              class="chat-container p-3"
              @scroll="handleScroll"
            >
              <div v-if="messagesLoading" class="text-center py-3">
                <div class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Loading messages...</span>
                </div>
              </div>

              <div v-else-if="messages.length === 0" class="text-center py-5 text-muted">
                <i class="fas fa-comment-slash fa-2x mb-3"></i>
                <p class="mb-0">No messages yet</p>
                <small>Start the conversation below</small>
              </div>

              <div v-else>
                <div
                  v-for="message in messages"
                  :key="message.id"
                  class="message"
                  :class="message.isFromUser ? 'user' : 'model'"
                >
                  <div class="d-flex align-items-start">
                    <div v-if="message.isFromUser" class="avatar me-2" style="width: 30px; height: 30px; background-color: #00c78b; color: white; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: 600; font-size: 0.875rem;">
                      {{ user?.email?.charAt(0).toUpperCase() || 'U' }}
                    </div>
                    <img
                      v-else
                      :src="currentModel?.photoUrl || 'https://via.placeholder.com/30x30'"
                      class="avatar me-2"
                      :alt="currentModel?.name"
                      style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover;"
                    />
                    <div class="flex-grow-1">
                      <div class="d-flex justify-content-between align-items-center mb-1">
                        <small class="fw-bold">
                          {{ message.isFromUser ? 'You' : currentModel?.name }}
                        </small>
                        <small class="text-muted">
                          {{ formatTime(message.createdAt) }}
                        </small>
                      </div>
                      <p class="mb-0">{{ message.content }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Message Input -->
          <div class="card-footer">
            <form @submit.prevent="sendMessage" class="d-flex">
              <input
                v-model="newMessage"
                type="text"
                class="form-control me-2"
                placeholder="Type your message..."
                :disabled="sending"
              />
              <button
                type="submit"
                class="btn"
                :disabled="!newMessage.trim() || sending"
                :style="{ 'background-color': '#00aff0', 'border-color': '#00aff0', 'color': '#ffffff', 'font-weight': '600', 'border-radius': '8px', 'padding': '0.75rem 1.5rem', 'transition': 'all 0.2s ease', 'opacity': (!newMessage.trim() || sending) ? 0.5 : 1 }"
                @mouseover="e => { if(newMessage.trim() && !sending) e.target.style.backgroundColor = '#0091ea'; }"
                @mouseout="e => { if(newMessage.trim() && !sending) e.target.style.backgroundColor = '#00aff0'; }"
              >
                <span v-if="sending" class="spinner-border spinner-border-sm me-1" style="width: 1rem; height: 1rem; border-width: 2px;"></span>
                <i v-else class="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import api from '../../services/api'

export default {
  name: 'UserChat',
  props: {
    modelId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      chatModels: [],
      chatModelsLoading: true,
      currentModelId: null,
      currentModel: null,
      messages: [],
      messagesLoading: false,
      newMessage: '',
      sending: false,
      hasMoreMessages: false,
      loadingMore: false
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('socket', ['connected'])
  },
  async mounted() {
    // Connect to socket first
    this.connectSocket()
    
    await this.fetchChatModels()
    
    if (this.modelId) {
      await this.switchChat(this.modelId)
    } else if (this.chatModels.length > 0) {
      await this.switchChat(this.chatModels[0].id)
    }

    // Listen for new messages
    this.$nextTick(() => {
      const socket = this.$store.state.socket?.socket
      if (socket) {
        socket.on('new_message', (message) => {
          console.log('Received message in chat view:', message)
          if (message.model?.id === this.currentModelId) {
            this.messages.push(message)
            this.$nextTick(() => {
              this.scrollToBottom()
            })
          }
        })
      } else {
        console.log('Socket not available yet, will retry...')
        // Retry after a short delay
        setTimeout(() => {
          const retrySocket = this.$store.state.socket?.socket
          if (retrySocket) {
            retrySocket.on('new_message', (message) => {
              console.log('Received message in chat view:', message)
              if (message.model?.id === this.currentModelId) {
                this.messages.push(message)
                this.$nextTick(() => {
                  this.scrollToBottom()
                })
              }
            })
          }
        }, 1000)
      }
    })
  },
  methods: {
    ...mapActions('socket', [
      'connectSocket',
      'joinChat',
      'leaveChat',
      'sendMessage: sendMessage',
      'getChatHistory',
      'setCurrentChat'
    ]),

    async fetchChatModels() {
      try {
        this.chatModelsLoading = true
        const response = await api.get('/user/chat-models')
        this.chatModels = response.data.chatModels
      } catch (error) {
        console.error('Error fetching chat models:', error)
      } finally {
        this.chatModelsLoading = false
      }
    },

    async switchChat(modelId) {
      if (this.currentModelId === modelId) return

      // Leave current chat
      if (this.currentModelId) {
        this.leaveChat({ modelId: this.currentModelId })
      }

      this.currentModelId = modelId
      this.currentModel = this.chatModels.find(m => m.id === modelId)
      this.messages = []
      this.setCurrentChat(modelId)

      // Join new chat room
      this.joinChat({ modelId: modelId })
      
      // Load messages
      await this.loadMessages()
    },

    async loadMessages() {
      if (!this.currentModelId) return

      try {
        this.messagesLoading = true
        const response = await api.get(`/user/chats/${this.currentModelId}`)
        this.messages = response.data.messages
        this.hasMoreMessages = response.data.hasMore

        // Scroll to bottom
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      } catch (error) {
        console.error('Error loading messages:', error)
      } finally {
        this.messagesLoading = false
      }
    },

    async sendMessage() {
      if (!this.newMessage.trim() || !this.currentModelId) return

      const content = this.newMessage.trim()
      this.newMessage = ''
      this.sending = true

      try {
        console.log('Sending message:', { modelId: this.currentModelId, content })
        
        // Send via API (which will also emit via socket)
        const response = await api.post('/user/messages', {
          modelId: this.currentModelId,
          content
        })
        
        console.log('Message sent successfully:', response.data)
        
        // Add message to local state immediately
        this.messages.push(response.data.message)
        
        // Scroll to bottom
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      } catch (error) {
        console.error('Error sending message:', error)
        this.$swal({
          icon: 'error',
          title: 'Failed to send message',
          text: error.response?.data?.message || 'Please try again.',
          confirmButtonText: 'OK'
        })
      } finally {
        this.sending = false
      }
    },

    goBack() {
      this.$router.push('/user')
    },

    formatTime(timestamp) {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date

      if (diff < 60000) { // Less than 1 minute
        return 'Just now'
      } else if (diff < 3600000) { // Less than 1 hour
        return `${Math.floor(diff / 60000)}m ago`
      } else if (diff < 86400000) { // Less than 1 day
        return `${Math.floor(diff / 3600000)}h ago`
      } else {
        return date.toLocaleDateString()
      }
    },

    scrollToBottom() {
      if (this.$refs.messagesContainer) {
        this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight
      }
    },

    handleScroll() {
      const container = this.$refs.messagesContainer
      if (container.scrollTop === 0 && this.hasMoreMessages && !this.loadingMore) {
        this.loadMoreMessages()
      }
    },

    async loadMoreMessages() {
      if (this.loadingMore) return

      try {
        this.loadingMore = true
        const response = await api.get(`/user/chats/${this.currentModelId}`, {
          params: {
            offset: this.messages.length,
            limit: 20
          }
        })

        const newMessages = response.data.messages
        this.messages = [...newMessages, ...this.messages]
        this.hasMoreMessages = response.data.hasMore
      } catch (error) {
        console.error('Error loading more messages:', error)
      } finally {
        this.loadingMore = false
      }
    }
  },

  watch: {
    // Listen for new messages from socket
    '$store.getters.socket/messages': {
      handler(newMessages) {
        if (this.currentModelId && newMessages[this.currentModelId]) {
          this.messages = newMessages[this.currentModelId]
          this.$nextTick(() => {
            this.scrollToBottom()
          })
        }
      },
      deep: true
    },

    modelId(newId) {
      if (newId && newId !== this.currentModelId) {
        this.switchChat(newId)
      }
    }
  }
}
</script>
