<template>
  <div style="min-height: 100vh; background-color: #ffffff;" class="container-fluid py-4">
    <div class="container">
      <div class="row mb-4">
        <div class="col-12">
          <h2 style="color: #1a1a1a; font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">
            <i class="fas fa-users me-2" style="color: #00aff0;"></i>
            Manage Subscribers
          </h2>
          <p style="color: #666666; font-size: 1rem; margin-bottom: 2rem;">Block and unblock subscribers</p>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card" style="border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); margin-bottom: 1.5rem;">
          <div class="card-header d-flex justify-content-between align-items-center" style="background-color: #ffffff; border-bottom: 1px solid #e0e0e0; padding: 1.25rem 1.5rem; border-radius: 12px 12px 0 0;">
            <h5 class="mb-0" style="color: #1a1a1a; font-weight: 700;">
              <i class="fas fa-list me-2" style="color: #00aff0;"></i>
              Subscribers List
            </h5>
            <button class="btn btn-sm" @click="fetchSubscribers" :disabled="loading" style="background-color: #00aff0; border-color: #00aff0; color: #ffffff; font-weight: 600; border-radius: 8px; padding: 0.5rem 1rem; transition: all 0.2s ease;" @mouseover="e => { if(!loading) e.target.style.backgroundColor = '#0091ea'; }" @mouseout="e => { if(!loading) e.target.style.backgroundColor = '#00aff0'; }">
              <i class="fas fa-sync-alt me-1" :class="{ 'fa-spin': loading }"></i>
              Refresh
            </button>
          </div>
          <div class="card-body" style="padding: 1.5rem;">
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border" role="status" style="color: #00aff0;">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <div v-else-if="subscribers.length === 0" class="text-center py-5">
              <i class="fas fa-users fa-3x text-muted mb-3"></i>
              <h4 class="text-muted">No subscribers yet</h4>
              <p class="text-muted">You don't have any active subscribers at the moment.</p>
            </div>

            <div v-else class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th style="color: #1a1a1a; font-weight: 600;">Email</th>
                    <th style="color: #1a1a1a; font-weight: 600;">Subscribed Date</th>
                    <th style="color: #1a1a1a; font-weight: 600;">Status</th>
                    <th style="color: #1a1a1a; font-weight: 600; text-align: center;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="subscriber in subscribers" :key="subscriber.id">
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="avatar me-3" style="width: 40px; height: 40px; background-color: #6f42c1; color: white; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
                          {{ subscriber.user.email.charAt(0).toUpperCase() }}
                        </div>
                        <span style="font-weight: 500;">{{ subscriber.user.email }}</span>
                      </div>
                    </td>
                    <td>
                      <span style="color: #666666;">{{ formatDate(subscriber.createdAt) }}</span>
                    </td>
                    <td>
                      <span v-if="subscriber.isBlocked" class="badge" style="background-color: #dc3545; color: white; padding: 0.5rem 0.75rem; border-radius: 6px;">
                        <i class="fas fa-ban me-1"></i>
                        Blocked
                      </span>
                      <span v-else class="badge" style="background-color: #28a745; color: white; padding: 0.5rem 0.75rem; border-radius: 6px;">
                        <i class="fas fa-check-circle me-1"></i>
                        Active
                      </span>
                    </td>
                    <td style="text-align: center;">
                      <button
                        v-if="!subscriber.isBlocked"
                        @click="blockSubscriber(subscriber.userId, subscriber.user.email)"
                        class="btn btn-sm"
                        style="background-color: #dc3545; border-color: #dc3545; color: #ffffff; font-weight: 600; border-radius: 8px; padding: 0.5rem 1rem; transition: all 0.2s ease;"
                        @mouseover="e => e.target.style.backgroundColor = '#c82333'"
                        @mouseout="e => e.target.style.backgroundColor = '#dc3545'"
                      >
                        <i class="fas fa-ban me-1"></i>
                        Block
                      </button>
                      <button
                        v-else
                        @click="unblockSubscriber(subscriber.userId, subscriber.user.email)"
                        class="btn btn-sm"
                        style="background-color: #28a745; border-color: #28a745; color: #ffffff; font-weight: 600; border-radius: 8px; padding: 0.5rem 1rem; transition: all 0.2s ease;"
                        @mouseover="e => e.target.style.backgroundColor = '#218838'"
                        @mouseout="e => e.target.style.backgroundColor = '#28a745'"
                      >
                        <i class="fas fa-check me-1"></i>
                        Unblock
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
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
  name: 'ManagerSubscribers',
  data() {
    return {
      subscribers: [],
      loading: false
    }
  },
  async mounted() {
    await this.fetchSubscribers()
  },
  methods: {
    async fetchSubscribers() {
      try {
        this.loading = true
        const response = await api.get('/manager/subscribers')
        this.subscribers = response.data.subscribers || []
      } catch (error) {
        console.error('Error fetching subscribers:', error)
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load subscribers. Please try again.',
          confirmButtonText: 'OK'
        })
      } finally {
        this.loading = false
      }
    },

    async blockSubscriber(userId, email) {
      const result = await this.$swal({
        icon: 'info',
        iconColor: '#00aff0',
        title: 'Block Subscriber',
        text: `Are you sure you want to block ${email}? They will no longer be able to subscribe or interact with your model.`,
        showCancelButton: true,
        confirmButtonText: 'Yes, block',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#dc3545'
      })

      if (!result.isConfirmed) return

      try {
        await api.post(`/manager/subscribers/${userId}/block`)
        
        this.$swal({
          icon: 'success',
          title: 'Blocked!',
          text: `${email} has been blocked successfully.`,
          timer: 2000,
          showConfirmButton: false
        })

        // Refresh the list
        await this.fetchSubscribers()
      } catch (error) {
        console.error('Error blocking subscriber:', error)
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to block subscriber. Please try again.',
          confirmButtonText: 'OK'
        })
      }
    },

    async unblockSubscriber(userId, email) {
      const result = await this.$swal({
        icon: 'info',
        title: 'Unblock Subscriber',
        text: `Are you sure you want to unblock ${email}? They will be able to subscribe and interact with your model again.`,
        showCancelButton: true,
        confirmButtonText: 'Yes, unblock',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#28a745'
      })

      if (!result.isConfirmed) return

      try {
        await api.post(`/manager/subscribers/${userId}/unblock`)
        
        this.$swal({
          icon: 'success',
          title: 'Unblocked!',
          text: `${email} has been unblocked successfully.`,
          timer: 2000,
          showConfirmButton: false
        })

        // Refresh the list
        await this.fetchSubscribers()
      } catch (error) {
        console.error('Error unblocking subscriber:', error)
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to unblock subscriber. Please try again.',
          confirmButtonText: 'OK'
        })
      }
    },

    formatDate(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
.table {
  margin-bottom: 0;
}

.table thead th {
  border-bottom: 2px solid #e0e0e0;
  padding: 1rem;
}

.table tbody td {
  padding: 1rem;
  vertical-align: middle;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.avatar {
  font-weight: 600;
  font-size: 0.875rem;
}
</style>

