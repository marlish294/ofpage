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
                      <div
                        class="message-bubble"
                        :class="message.isFromUser ? 'bubble-user' : 'bubble-model'"
                      >
                        <div v-if="message.media" class="message-media position-relative mb-2">
                          <template v-if="message.media.type === 'IMAGE'">
                            <img
                              :src="message.media.url"
                              class="img-fluid rounded"
                              :class="{ 'locked-blur': message.media.isLocked && !message.media.isUnlocked }"
                              alt="Chat media"
                            />
                          </template>
                          <template v-else>
                            <video
                              :src="message.media.url"
                              controls
                              preload="metadata"
                              class="w-100 rounded"
                              :class="{ 'locked-blur': message.media.isLocked && !message.media.isUnlocked }"
                            ></video>
                          </template>
                          <div
                            v-if="message.media.isLocked && !message.media.isUnlocked"
                            class="locked-overlay"
                          >
                            <i class="fas fa-lock fa-lg"></i>
                            <span class="d-block small mt-1">Locked</span>
                            <button
                              type="button"
                              class="btn btn-sm btn-light mt-2"
                              @click="openUnlockModal(message)"
                            >
                              Unlock for {{ formatPrice(message.media.lockPrice) }}
                            </button>
                          </div>
                        </div>
                        <p v-if="message.content" class="mb-0">{{ message.content }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Message Input -->
          <div class="card-footer">
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
                placeholder="Type your message..."
                :disabled="sending"
              />
              <button
                type="submit"
                class="btn"
                :disabled="!canSend"
                :style="{ 'background-color': '#00aff0', 'border-color': '#00aff0', 'color': '#ffffff', 'font-weight': '600', 'border-radius': '8px', 'padding': '0.75rem 1.5rem', 'transition': 'all 0.2s ease', 'opacity': canSend ? 1 : 0.5 }"
                @mouseover="e => { if(canSend) e.target.style.backgroundColor = '#0091ea'; }"
                @mouseout="e => { if(canSend) e.target.style.backgroundColor = '#00aff0'; }"
              >
                <span v-if="sending" class="spinner-border spinner-border-sm me-1" style="width: 1rem; height: 1rem; border-width: 2px;"></span>
                <i v-else class="fas fa-paper-plane"></i>
              </button>
            </form>
            <div v-if="selectedMedia" class="selected-media-preview border-top px-3 py-3 mt-3">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Unlock Modal -->
  <div class="modal fade" id="unlockModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title"><i class="fas fa-lock-open me-2 text-warning"></i> Unlock Media</h5>
          <button type="button" class="btn-close" @click="closeUnlockModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="unlockingMessage" class="mb-3">
            <p class="mb-1">You're unlocking premium content from <strong>{{ currentModel?.name }}</strong>.</p>
            <p class="fw-semibold">Amount: {{ formatPrice(unlockingMessage.media?.lockPrice || 0) }}</p>
          </div>
          <div class="mb-3">
            <label class="form-label">Card Number</label>
            <input type="text" class="form-control" v-model="unlockPaymentData.cardNumber" placeholder="1234 5678 9012 3456" />
          </div>
          <div class="row">
            <div class="col">
              <label class="form-label">Expiry Date</label>
              <input type="text" class="form-control" v-model="unlockPaymentData.expiryDate" placeholder="MM/YY" />
            </div>
            <div class="col">
              <label class="form-label">CVV</label>
              <input type="password" class="form-control" v-model="unlockPaymentData.cvv" placeholder="123" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" @click="closeUnlockModal" :disabled="unlockProcessing">Cancel</button>
          <button type="button" class="btn btn-primary" @click="processUnlock" :disabled="unlockProcessing">
            <span v-if="unlockProcessing" class="spinner-border spinner-border-sm me-2"></span>
            {{ unlockProcessing ? 'Processing...' : 'Unlock Now' }}
          </button>
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
      loadingMore: false,
      selectedMedia: null,
      selectedMediaPreview: null,
      unlockingMessage: null,
      unlockPaymentData: {
        cardNumber: '',
        expiryDate: '',
        cvv: ''
      },
      unlockProcessing: false,
      unlockModalInstance: null
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('socket', ['connected']),
    canSend() {
      const hasText = this.newMessage.trim().length > 0
      const hasMedia = !!this.selectedMedia
      return (hasText || hasMedia) && !this.sending
    },
    selectedMediaType() {
      if (!this.selectedMedia) return null
      return this.selectedMedia.type?.startsWith('video/') ? 'VIDEO' : 'IMAGE'
    }
  },
  async mounted() {
    this.connectSocket()

    await this.fetchChatModels()

    if (this.modelId) {
      await this.switchChat(this.modelId)
    } else if (this.chatModels.length > 0) {
      await this.switchChat(this.chatModels[0].id)
    }

    const setupSocketListeners = (socketInstance) => {
      socketInstance.on('new_message', this.handleNewMessage)
      socketInstance.on('media_unlocked', this.handleMediaUnlocked)
    }

    this.$nextTick(() => {
      const socket = this.$store.state.socket?.socket
      if (socket) {
        setupSocketListeners(socket)
      } else {
        console.log('Socket not available yet, will retry...')
        setTimeout(() => {
          const retrySocket = this.$store.state.socket?.socket
          if (retrySocket) {
            setupSocketListeners(retrySocket)
          }
        }, 1000)
      }
    })
  },
  beforeUnmount() {
    this.clearSelectedMedia()
    this.destroyUnlockModal()
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

      if (this.currentModelId) {
        this.leaveChat({ modelId: this.currentModelId })
      }

      this.currentModelId = modelId
      this.currentModel = this.chatModels.find((m) => m.id === modelId) || null
      this.messages = []
      this.setCurrentChat(modelId)

      this.joinChat({ modelId })

      await this.loadMessages()
    },

    async loadMessages() {
      if (!this.currentModelId) return

      try {
        this.messagesLoading = true
        const response = await api.get(`/user/chats/${this.currentModelId}`)
        this.messages = response.data.messages
        this.hasMoreMessages = response.data.hasMore

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
      if (!this.currentModelId) return

      const trimmedContent = this.newMessage.trim()
      const hasText = trimmedContent.length > 0
      const hasMedia = !!this.selectedMedia

      if (!hasText && !hasMedia) return

      this.sending = true

      try {
        const formData = new FormData()
        formData.append('modelId', this.currentModelId)
        if (hasText) {
          formData.append('content', trimmedContent)
        }
        if (hasMedia) {
          formData.append('media', this.selectedMedia)
        }

        console.log('Sending message:', { modelId: this.currentModelId, hasText, hasMedia })

        const response = await api.post('/user/messages', formData)

        console.log('Message sent successfully:', response.data)

        this.updateMessageInList(response.data.message)
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

    handleNewMessage(message) {
      console.log('Received message in chat view:', message)
      if (message.model?.id === this.currentModelId) {
        this.updateMessageInList(message)
      }
    },

    handleMediaUnlocked(payload) {
      const message = payload?.messageForUser || payload?.message || payload?.messageForManager
      if (!message) return
      if (message.model?.id === this.currentModelId) {
        this.updateMessageInList(message, { replaceOnly: true })
      }
    },

    updateMessageInList(message, options = {}) {
      if (!message) return

      let index = this.messages.findIndex((m) => m.id === message.id)
      if (index === -1 && message.media?.id) {
        index = this.messages.findIndex((m) => m.media?.id === message.media.id)
      }

      if (index === -1) {
        if (!options.replaceOnly) {
          this.messages.push(message)
          this.$nextTick(() => {
            this.scrollToBottom()
          })
        }
        return
      }

      this.$set(this.messages, index, message)

      if (!options.replaceOnly) {
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
    },

    goBack() {
      this.$router.push('/user')
    },

    formatTime(timestamp) {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date

      if (diff < 60000) {
        return 'Just now'
      } else if (diff < 3600000) {
        return `${Math.floor(diff / 60000)}m ago`
      } else if (diff < 86400000) {
        return `${Math.floor(diff / 3600000)}h ago`
      }
      return date.toLocaleDateString()
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
    },

    clearSelectedMedia() {
      if (this.selectedMediaPreview) {
        URL.revokeObjectURL(this.selectedMediaPreview)
      }
      this.selectedMedia = null
      this.selectedMediaPreview = null
      if (this.$refs.mediaInput) {
        this.$refs.mediaInput.value = ''
      }
    },

    resetComposer() {
      this.newMessage = ''
      this.clearSelectedMedia()
    },

    openUnlockModal(message) {
      if (!message?.media) return
      this.unlockingMessage = message
      this.resetUnlockPaymentData()

      if (!this.unlockModalInstance) {
        this.unlockModalInstance = new bootstrap.Modal(document.getElementById('unlockModal'))
      }
      this.unlockModalInstance.show()
    },

    closeUnlockModal() {
      if (this.unlockModalInstance) {
        this.unlockModalInstance.hide()
      }
      this.unlockingMessage = null
    },

    destroyUnlockModal() {
      if (this.unlockModalInstance) {
        this.unlockModalInstance.hide()
        this.unlockModalInstance = null
      }
    },

    resetUnlockPaymentData() {
      this.unlockPaymentData = {
        cardNumber: '',
        expiryDate: '',
        cvv: ''
      }
    },

    async processUnlock() {
      if (!this.unlockingMessage?.media) return

      if (!this.unlockPaymentData.cardNumber || !this.unlockPaymentData.expiryDate || !this.unlockPaymentData.cvv) {
        this.$swal({
          icon: 'error',
          title: 'Incomplete details',
          text: 'Please fill in your payment information to continue.',
          confirmButtonText: 'OK'
        })
        return
      }

      this.unlockProcessing = true

      try {
        const response = await api.post(`/user/media/${this.unlockingMessage.media.id}/unlock`, {
          paymentData: this.unlockPaymentData
        })

        this.updateMessageInList(response.data.message, { replaceOnly: true })

        this.$swal({
          icon: 'success',
          title: 'Unlocked!',
          text: 'Enjoy your unlocked media.',
          confirmButtonText: 'Great!'
        })

        this.closeUnlockModal()
        await this.loadMessages()
      } catch (error) {
        console.error('Unlock media error:', error)
        const apiMessage = error.response?.data?.message || error.message
        const isAlreadyUnlocked = apiMessage && apiMessage.toLowerCase().includes('already unlocked')

        if (isAlreadyUnlocked) {
          this.$swal({
            icon: 'info',
            title: 'Already unlocked',
            text: 'You already have access to this media.',
            confirmButtonText: 'OK'
          })
          this.updateMessageInList(this.unlockingMessage, { replaceOnly: true })
          await this.loadMessages()
          this.closeUnlockModal()
        } else {
          await this.loadMessages()
          const mediaId = this.unlockingMessage?.media?.id
          const unlockedNow = mediaId && this.messages.some((m) => m.media?.id === mediaId && !m.media.isLocked)

          if (unlockedNow) {
            this.$swal({
              icon: 'success',
              title: 'Unlocked!',
              text: 'Enjoy your unlocked media.',
              confirmButtonText: 'Great!'
            })
            this.closeUnlockModal()
          } else {
          const toastTitle = apiMessage && apiMessage.toLowerCase().includes('subscription') ? 'Unlock failed' : 'Payment failed'
          this.$swal({
            icon: 'error',
            title: toastTitle,
            text: apiMessage || 'Unable to unlock media. Please try again.',
            confirmButtonText: 'OK'
          })
          }
        }
      } finally {
        this.unlockProcessing = false
      }
    },

    formatPrice(amount) {
      const value = parseFloat(amount || 0)
      return `$${value.toFixed(2)}`
    }
  },

  watch: {
    modelId(newId) {
      if (newId && newId !== this.currentModelId) {
        this.switchChat(newId)
      }
    }
  }
}
</script>

<style scoped>
.message {
  margin-bottom: 1rem;
}

.message-bubble {
  border-radius: 16px;
  padding: 1rem;
  background-color: #f5f5f5;
}

.bubble-user {
  background-color: #00aff0;
  color: #ffffff;
}

.bubble-model {
  background-color: #ffffff;
  color: #1a1a1a;
  border: 1px solid #e0e0e0;
}

.message-media {
  position: relative;
  overflow: hidden;
}

.message-media img,
.message-media video {
  width: 100%;
  max-height: 320px;
  object-fit: cover;
  border-radius: 12px;
}

.locked-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.locked-blur {
  filter: blur(12px);
}

.message-composer {
  background-color: #ffffff;
  padding: 0.75rem 0;
}

.selected-media-preview {
  background-color: #f8f9fa;
  border-radius: 12px;
}

.selected-media-preview img,
.selected-media-preview video {
  width: 100%;
  max-height: 280px;
  object-fit: cover;
}
</style>
