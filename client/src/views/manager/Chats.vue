<template>
  <div style="min-height: 100vh; background-color: #ffffff;" class="container-fluid py-4">
    <div class="row">
      <!-- Chat Sidebar -->
      <div class="col-lg-3">
        <div class="card" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); margin-bottom: 1.5rem;">
          <div class="card-header" style="background-color: #ffffff; border-bottom: 1px solid #e0e0e0; padding: 1.25rem 1.5rem; border-radius: 12px 12px 0 0;">
            <h5 class="mb-0" style="color: #1a1a1a; font-weight: 700;">
              <i class="fas fa-comments me-2" style="color: #00aff0;"></i>
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
        <div v-if="!currentUserId" class="card h-100" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); margin-bottom: 1.5rem;">
          <div class="card-body d-flex align-items-center justify-content-center" style="padding: 1.5rem;">
            <div class="text-center text-muted">
              <i class="fas fa-comments fa-3x mb-3"></i>
              <h4>Select a subscriber to start chatting</h4>
              <p>Choose a subscriber from the sidebar to view and respond to their messages.</p>
            </div>
          </div>
        </div>

        <div v-else class="card h-100 d-flex flex-column" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); margin-bottom: 1.5rem;">
          <!-- Chat Header -->
          <div class="card-header d-flex align-items-center" style="background-color: #ffffff; border-bottom: 1px solid #e0e0e0; padding: 1.25rem 1.5rem; border-radius: 12px 12px 0 0;">
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
              class="messages-container flex-grow-1 p-0"
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
                  class="message mb-0"
                  :class="{ 'text-end': message.isFromUser }"
                >
                  <div
                    class="d-inline-block message-bubble p-3 rounded"
                    :class="message.isFromUser ? 'bg-primary text-white' : 'bg-white border'"
                  >
                    <div v-if="message.media" class="message-media mb-2 position-relative">
                      <template v-if="message.media.type === 'IMAGE'">
                        <img :src="message.media.url" class="img-fluid rounded" alt="Chat media" />
                      </template>
                      <template v-else>
                        <video :src="message.media.url" controls preload="metadata" class="w-100 rounded"></video>
                      </template>
                      <div v-if="message.media.isLocked && !message.media.isUnlocked" class="locked-overlay">
                        <i class="fas fa-lock fa-lg"></i>
                        <span class="d-block small mt-1">Locked</span>
                      </div>
                    </div>
                    <div v-if="message.content" class="message-content">{{ message.content }}</div>
                    <div class="message-time mt-1" :class="message.isFromUser ? 'text-white-50' : 'text-muted'">
                      <small>{{ formatTime(message.createdAt) }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Message Input -->
            <div class="border-top">
              <form @submit.prevent="sendMessage" class="message-composer d-flex align-items-center gap-2">
                <input
                  ref="mediaInput"
                  type="file"
                  class="d-none"
                  accept="image/*,video/*"
                  @change="onMediaSelected"
                />
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  :disabled="sending"
                  @click="triggerMediaPicker"
                  title="Attach media"
                >
                  <i class="fa fa-paperclip" aria-hidden="true" style="color: rgb(0, 175, 240);"></i>
                </button>
                <input
                  v-model="newMessage"
                  type="text"
                  class="form-control"
                  placeholder="Type your message as {{ modelName }}..."
                  :disabled="sending"
                />
                <button
                  type="submit"
                  class="btn"
                  :style="{ 'background-color': '#00aff0', 'border-color': '#00aff0', 'color': '#ffffff', 'font-weight': '600', 'border-radius': '8px', 'padding': '0.75rem 1.5rem', 'transition': 'all 0.2s ease', 'opacity': canSend ? 1 : 0.5 }"
                  @mouseover="e => { if(canSend) e.target.style.backgroundColor = '#0091ea'; }"
                  @mouseout="e => { if(canSend) e.target.style.backgroundColor = '#00aff0'; }"
                  :disabled="!canSend"
                >
                  <span v-if="sending" class="spinner-border spinner-border-sm me-1"></span>
                  <i v-else class="fas fa-paper-plane"></i>
                </button>
              </form>
              <div v-if="selectedMedia" class="selected-media-preview border-top px-3 py-3">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center">
                    <i :class="['fas', selectedMediaType === 'VIDEO' ? 'fa-video' : 'fa-image']"></i>
                    <span class="ms-2 fw-semibold">{{ selectedMedia.name }}</span>
                  </div>
                  <button type="button" class="btn btn-link text-danger p-0" @click="clearSelectedMedia">
                    Remove
                  </button>
                </div>
                <div class="mt-3">
                  <img v-if="selectedMediaType === 'IMAGE'" :src="selectedMediaPreview" class="img-fluid rounded" alt="Preview" />
                  <video v-else controls preload="metadata" class="w-100 rounded">
                    <source :src="selectedMediaPreview" :type="selectedMedia.type" />
                  </video>
                </div>
                <div class="form-check form-switch mt-3">
                  <input class="form-check-input" type="checkbox" id="lockMediaSwitch" v-model="lockMedia" />
                  <label class="form-check-label" for="lockMediaSwitch">Lock this media</label>
                </div>
                <div v-if="lockMedia" class="mt-2">
                  <label class="form-label small mb-1">Unlock price (USD)</label>
                  <input type="number" min="1" step="0.01" class="form-control form-control-sm" v-model="lockPrice" placeholder="e.g. 9.99" />
                  <small class="text-muted">Subscribers must pay to unlock this media.</small>
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
      modelId: null,
      selectedMedia: null,
      selectedMediaPreview: null,
      lockMedia: false,
      lockPrice: '',
      shouldScrollToBottom: false
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('socket', ['connected']),
    canSend() {
      const hasText = this.newMessage.trim().length > 0
      const hasMedia = !!this.selectedMedia

      if (!hasText && !hasMedia) return false

      if (this.lockMedia) {
        const parsedPrice = parseFloat(this.lockPrice)
        if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
          return false
        }
      }

      return !this.sending
    },
    selectedMediaType() {
      if (!this.selectedMedia) return null
      return this.selectedMedia.type?.startsWith('video/') ? 'VIDEO' : 'IMAGE'
    }
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
            this.updateMessageInList(message)
          }
        })
        socket.on('media_unlocked', (payload) => {
          const message = payload?.messageForManager || payload?.messageForUser || payload?.message
          if (!message) return
          if (message.user?.id === this.currentUserId) {
            this.updateMessageInList(message, { replaceOnly: true })
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
                this.updateMessageInList(message)
              }
            })
            retrySocket.on('media_unlocked', (payload) => {
              const message = payload?.messageForManager || payload?.messageForUser || payload?.message
              if (!message) return
              if (message.user?.id === this.currentUserId) {
                this.updateMessageInList(message, { replaceOnly: true })
              }
            })
          }
        }, 1000)
      }
    })
  },
  beforeUnmount() {
    this.clearSelectedMedia()
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
      this.shouldScrollToBottom = true

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
        if (this.shouldScrollToBottom) {
          this.$nextTick(() => {
            this.scrollToBottom()
            this.shouldScrollToBottom = false
          })
        }
      } catch (error) {
        console.error('Error loading messages:', error)
        this.shouldScrollToBottom = false
      } finally {
        this.messagesLoading = false
      }
    },

    async sendMessage() {
      if (!this.currentUserId) return

      const trimmedContent = this.newMessage.trim()
      const hasText = trimmedContent.length > 0
      const hasMedia = !!this.selectedMedia

      if (!hasText && !hasMedia) return

      if (this.lockMedia) {
        const parsedPrice = parseFloat(this.lockPrice)
        if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
          this.$swal({
            icon: 'warning',
            title: 'Invalid price',
            text: 'Please enter a valid unlock price greater than 0.',
            confirmButtonText: 'OK'
          })
          return
        }
      }

      this.sending = true

      try {
        const formData = new FormData()
        formData.append('userId', this.currentUserId)
        if (hasText) {
          formData.append('content', trimmedContent)
        }
        if (hasMedia) {
          formData.append('media', this.selectedMedia)
          if (this.lockMedia) {
            const parsedPrice = parseFloat(this.lockPrice)
            formData.append('isLocked', 'true')
            formData.append('lockPrice', parsedPrice.toString())
          }
        }

        console.log('Manager sending message:', { userId: this.currentUserId, hasText, hasMedia, lockMedia: this.lockMedia })

        const response = await api.post('/manager/messages', formData)

        console.log('Manager message sent successfully:', response.data)

        this.updateMessageInList(response.data.message, { scroll: false })
        this.resetComposer()
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

    triggerMediaPicker() {
      if (this.sending) return
      this.$refs.mediaInput?.click()
    },

    onMediaSelected(event) {
      const [file] = event.target.files || []
      if (!file) return

      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        this.$swal({
          icon: 'error',
          title: 'Unsupported file',
          text: 'Only image and video files are allowed.',
          confirmButtonText: 'OK'
        })
        event.target.value = ''
        return
      }

      if (this.selectedMediaPreview) {
        URL.revokeObjectURL(this.selectedMediaPreview)
      }

      this.selectedMedia = file
      this.selectedMediaPreview = URL.createObjectURL(file)
      this.lockMedia = false
      this.lockPrice = ''
    },

    clearSelectedMedia() {
      if (this.selectedMediaPreview) {
        URL.revokeObjectURL(this.selectedMediaPreview)
      }
      this.selectedMedia = null
      this.selectedMediaPreview = null
      this.lockMedia = false
      this.lockPrice = ''
      if (this.$refs.mediaInput) {
        this.$refs.mediaInput.value = ''
      }
    },

    resetComposer() {
      this.newMessage = ''
      this.clearSelectedMedia()
    },

    updateMessageInList(message, options = {}) {
      if (!message) return

      const { replaceOnly = false, scroll = false } = options

      let index = this.messages.findIndex((m) => m.id === message.id)
      if (index === -1 && message.media?.id) {
        index = this.messages.findIndex((m) => m.media?.id === message.media.id)
      }

      if (index === -1) {
        if (!replaceOnly) {
          this.messages.push(message)
          if (scroll) {
            this.$nextTick(() => {
              this.scrollToBottom()
            })
          }
        }
        return
      }

      this.$set(this.messages, index, message)

      if (!replaceOnly && scroll) {
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer
        if (!container) return

        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight
        })
      })
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

.message-bubble {
  max-width: 70%;
  position: relative;
}

.message-media {
  position: relative;
}

.message-media img,
.message-media video {
  max-height: 320px;
  width: 100%;
  object-fit: cover;
}

.locked-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  border-radius: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.message-composer {
  padding: 0.75rem 1rem;
  background-color: #ffffff;
}

.selected-media-preview img,
.selected-media-preview video {
  max-height: 280px;
  width: 100%;
  object-fit: cover;
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