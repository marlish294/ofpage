<template>
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <div class="col-12">
        <h2>
          <i class="fas fa-users me-2"></i>
          User Management
        </h2>
        <p class="text-muted">Manage users, managers, and permissions</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h6 class="card-title">Filter by Role</h6>
            <div class="btn-group" role="group">
              <button
                type="button"
                class="btn btn-outline-primary"
                :class="{ active: selectedRole === '' }"
                @click="filterByRole('')"
              >
                All
              </button>
              <button
                type="button"
                class="btn btn-outline-success"
                :class="{ active: selectedRole === 'USER' }"
                @click="filterByRole('USER')"
              >
                Users
              </button>
              <button
                type="button"
                class="btn btn-outline-warning"
                :class="{ active: selectedRole === 'MANAGER' }"
                @click="filterByRole('MANAGER')"
              >
                Managers
              </button>
              <button
                type="button"
                class="btn btn-outline-danger"
                :class="{ active: selectedRole === 'ADMIN' }"
                @click="filterByRole('ADMIN')"
              >
                Admins
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">All Users ({{ pagination.total }})</h5>
        <button class="btn btn-primary btn-sm" @click="refreshUsers">
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
        
        <div v-else-if="users.length === 0" class="text-center py-5">
          <i class="fas fa-users fa-3x text-muted mb-3"></i>
          <h4 class="text-muted">No users found</h4>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Manager Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar me-3" style="width: 40px; height: 40px; background-color: #6f42c1; color: white; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
                      {{ user.email.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <div class="fw-bold">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge" :class="getRoleBadgeClass(user.role)">
                    <i :class="getRoleIcon(user.role)" class="me-1"></i>
                    {{ user.role }}
                  </span>
                </td>
                <td>
                  <span class="badge" :class="user.isActive ? 'bg-success' : 'bg-danger'">
                    {{ user.isActive ? 'Active' : 'Blocked' }}
                  </span>
                </td>
                <td>{{ formatDate(user.createdAt) }}</td>
                <td>
                  <span v-if="user.manager" class="badge" :class="user.manager.isApproved ? 'bg-success' : 'bg-warning'">
                    {{ user.manager.isApproved ? 'Approved' : 'Pending' }}
                  </span>
                  <span v-else class="text-muted">-</span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button
                      v-if="user.role !== 'ADMIN'"
                      class="btn"
                      :class="user.isActive ? 'btn-outline-danger' : 'btn-outline-success'"
                      @click="toggleUserStatus(user)"
                      :disabled="processingUser === user.id"
                    >
                      <span v-if="processingUser === user.id" class="spinner-border spinner-border-sm me-1"></span>
                      <i :class="user.isActive ? 'fas fa-ban' : 'fas fa-check'" class="me-1"></i>
                      {{ user.isActive ? 'Block' : 'Unblock' }}
                    </button>
                    <button
                      class="btn btn-outline-info"
                      @click="viewUserDetails(user)"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                  </div>
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
  name: 'AdminUsers',
  data() {
    return {
      users: [],
      loading: true,
      selectedRole: '',
      processingUser: null,
      pagination: {
        page: 1,
        limit: 20,
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
    await this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      try {
        this.loading = true
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit
        }
        
        if (this.selectedRole) {
          params.role = this.selectedRole
        }
        
        const response = await api.get('/admin/users', { params })
        this.users = response.data.users
        this.pagination = response.data.pagination
      } catch (error) {
        console.error('Error fetching users:', error)
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch users. Please try again.',
          confirmButtonText: 'OK'
        })
      } finally {
        this.loading = false
      }
    },

    async filterByRole(role) {
      this.selectedRole = role
      this.pagination.page = 1
      await this.fetchUsers()
    },

    async changePage(page) {
      this.pagination.page = page
      await this.fetchUsers()
    },

    async refreshUsers() {
      await this.fetchUsers()
    },

    async toggleUserStatus(user) {
      const action = user.isActive ? 'block' : 'unblock'
      const confirmText = user.isActive ? 'block this user' : 'unblock this user'
      
      const result = await this.$swal({
        icon: 'warning',
        title: `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
        text: `Are you sure you want to ${confirmText}?`,
        showCancelButton: true,
        confirmButtonText: `Yes, ${action}`,
        cancelButtonText: 'Cancel'
      })

      if (result.isConfirmed) {
        try {
          this.processingUser = user.id
          await api.post(`/admin/users/${user.id}/block`, {
            isActive: !user.isActive
          })
          
          this.$swal({
            icon: 'success',
            title: 'Success!',
            text: `User ${action}ed successfully.`,
            confirmButtonText: 'OK'
          })
          
          await this.fetchUsers()
        } catch (error) {
          console.error('Error toggling user status:', error)
          this.$swal({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update user status. Please try again.',
            confirmButtonText: 'OK'
          })
        } finally {
          this.processingUser = null
        }
      }
    },

    viewUserDetails(user) {
      this.$swal({
        title: 'User Details',
        html: `
          <div class="text-start">
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Role:</strong> ${user.role}</p>
            <p><strong>Status:</strong> ${user.isActive ? 'Active' : 'Blocked'}</p>
            <p><strong>Created:</strong> ${this.formatDate(user.createdAt)}</p>
            ${user.manager ? `<p><strong>Manager Status:</strong> ${user.manager.isApproved ? 'Approved' : 'Pending'}</p>` : ''}
          </div>
        `,
        confirmButtonText: 'Close'
      })
    },

    getRoleBadgeClass(role) {
      switch (role) {
        case 'ADMIN': return 'bg-danger'
        case 'MANAGER': return 'bg-warning'
        case 'USER': return 'bg-success'
        default: return 'bg-secondary'
      }
    },

    getRoleIcon(role) {
      switch (role) {
        case 'ADMIN': return 'fas fa-crown'
        case 'MANAGER': return 'fas fa-user-tie'
        case 'USER': return 'fas fa-user'
        default: return 'fas fa-question'
      }
    },

    formatDate(timestamp) {
      return new Date(timestamp).toLocaleDateString()
    }
  }
}
</script>
