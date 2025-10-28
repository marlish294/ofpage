<template>
  <div class="container-fluid py-4">
    <div class="row">
      <!-- Chat Sidebar -->
      <div class="col-lg-3">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-comments me-2"></i>
              Subscriber Chats
            </h5>
          </div>
          <div class="card-body p-0">
            <div v-if="subscribersLoading" class="text-center p-3">
              <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            
            <div v-else-if="subscribers.length === 0" class="text-center p-3 text-muted">
              <i class="fas fa-inbox fa-2x mb-2"></i>
              <p class="mb-0">No subscribers yet</p>
              <small>When users subscribe to your model, their chats will appear here.</small>
            </div>
            
            <div v-else class="list-group list-group-flush">
              <div
                v-for="subscriber in subscribers"
                :key="subscriber.id"
                class="list-group-item list-group-item-action"
                @click="switchChat(subscriber.userId)"
                :class="{ active: currentUserId === subscriber.userId }"
              >
                <div class="d-flex align-items-center">
                  <div class="avatar me-3" style="width: 40px; height: 40px; background-color: #6f42c1; color: white; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
                    {{ subscriber.user.email.charAt(0).toUpperCase() }}
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-0">{{ subscriber.user.email }}</h6>
                    <small class="text-muted">Subscriber</small>
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
        <div v-if="!currentUserId" class="card h-100">
          <div class="card-body d-flex align-items-center justify-content-center">
            <div class="text-center text-muted">
              <i class="fas fa-comments fa-3x mb-3"></i>
              <h4>Select a subscriber to start chatting</h4>
              <p>Choose a subscriber from the sidebar to view and respond to their messages.</p>
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
              <small class="text-muted">Subscriber</small>
            </div>
            <div class="text-muted">
              <small>Chatting as: <strong>{{ modelName }}</strong></small>
            </div>
          </div>

          <!-- Messages Area -->
          <div class="card-body flex-grow-1 d-flex flex-column p-0">
            <div 
              ref="messagesContainer"
              class="messages-container flex-grow-1 p-3"
              style="height: 400px; overflow-y: auto; background-color: #f8f9fa;"
            >
              <div v-if="messagesLoading" class="text-center py-3">
                <div class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Loading messages...</span>
                </div>
              </div>
              
              <div v-else-if="messages.length === 0" class="text-center py-5 text-muted">
                <i class="fas fa-comment-dots fa-2x mb-3"></i>
                <p>No messages yet. Start the conversation!</p>
              </div>
              
              <div v-else>
                <div
                  v-for="message in messages"
                  :key="message.id"
                  class="message mb-3"
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

            <!-- Message Input -->
            <div class="border-top p-3">
              <form @submit.prevent="sendMessage" class="d-flex">
                <input
                  v-model="newMessage"
                  type="text"
                  class="form-control me-2"
                  placeholder="Type your message as {{ modelName }}..."
                  :disabled="sending"
                />
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="!newMessage.trim() || sending"
                >
                  <span v-if="sending" class="spinner-border spinner-border-sm me-1"></span>
                  <i v-else class="fas fa-paper-plane"></i>
                </button>
              </form>
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
  name: 'ManagerChats',
  data() {
    return {
      subscribers: [],
      subscribersLoading: true,
      messages: [],
      messagesLoading: false,
      currentUserId: null,
      currentUser: null,
      newMessage: '',
      sending: false,
      modelName: '',
      modelId: null
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('socket', ['connected'])
  },
  async mounted() {
    // Connect to socket first
    this.connectSocket()
    
    await this.fetchSubscribers()
    
    // Listen for new messages
    this.$nextTick(() => {
      const socket = this.$store.state.socket?.socket
      if (socket) {
        socket.on('new_message', (message) => {
          console.log('Manager received message:', message)
          if (message.user?.id === this.currentUserId) {
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
              console.log('Manager received message:', message)
              if (message.user?.id === this.currentUserId) {
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
    ...mapActions('socket', ['connectSocket', 'joinChat', 'leaveChat']),

    async fetchSubscribers() {
      try {
        this.subscribersLoading = true
        const response = await api.get('/manager/subscribers')
        this.subscribers = response.data.subscribers || []
        
        // Get model name
        if (this.subscribers.length > 0) {
          this.modelName = this.subscribers[0].model?.name + ' ' + this.subscribers[0].model?.surname || 'Model'
        }
      } catch (error) {
        console.error('Error fetching subscribers:', error)
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load subscribers. Please try again.',
          confirmButtonText: 'OK'
        })
      } finally {
        this.subscribersLoading = false
      }
    },

    async switchChat(userId) {
      if (this.currentUserId === userId) return

      // Leave current chat
      if (this.currentUserId) {
        this.leaveChat({ modelId: this.modelId })
      }

      this.currentUserId = userId
      this.currentUser = this.subscribers.find(s => s.userId === userId)?.user
      this.messages = []

      // Join user-specific chat room
      if (this.subscribers.length > 0) {
        this.modelId = this.subscribers[0].modelId
        this.joinChat({ modelId: this.modelId, userId: userId })
      }
      
      // Load messages
      await this.loadMessages()
    },

    async loadMessages() {
      if (!this.currentUserId) return

      try {
        this.messagesLoading = true
        const response = await api.get('/manager/chats', {
          params: { userId: this.currentUserId }
        })
        this.messages = response.data.messages || []

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
      if (!this.newMessage.trim() || !this.currentUserId) return

      const content = this.newMessage.trim()
      this.newMessage = ''
      this.sending = true

      try {
        console.log('Manager sending message:', { userId: this.currentUserId, content })
        
        // Send via API (which will also emit via socket)
        const response = await api.post('/manager/messages', {
          userId: this.currentUserId,
          content
        })
        
        console.log('Manager message sent successfully:', response.data)
        
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
  font-size: 0.9rem;
}

.list-group-item.active {
  background-color: #e3f2fd;
  border-color: #2196f3;
}

.list-group-item:hover {
  background-color: #f5f5f5;
}
</style>