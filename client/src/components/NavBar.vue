<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <span class="navbar-brand">
        <i class="fas fa-star me-2"></i>
        Social Platform
      </span>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <button class="nav-link btn btn-link" @click="goToHome">
              <i class="fas fa-home me-1"></i>
              Home
            </button>
          </li>
          

          <li v-if="isUser" class="nav-item">
            <router-link class="nav-link" to="/user/chat">
              <i class="fas fa-comments me-1"></i>
              Chats
            </router-link>
          </li>
        </ul>

        <ul class="navbar-nav ms-auto">
          <li v-if="!isAuthenticated" class="nav-item">
            <router-link class="nav-link" to="/login">
              <i class="fas fa-sign-in-alt me-1"></i>
              Login
            </router-link>
          </li>
          
          <li v-if="!isAuthenticated" class="nav-item">
            <router-link class="nav-link" to="/register">
              <i class="fas fa-user-plus me-1"></i>
              Register
            </router-link>
          </li>

          <!-- User Dropdown -->
          <li v-if="isAuthenticated" class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="userDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              @click="toggleDropdown"
            >
              <i class="fas fa-user me-1"></i>
              {{ user?.email }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown" :class="{ show: dropdownOpen }">
              <li>
                <button class="dropdown-item" @click="openChangePassword">
                  <i class="fas fa-key me-2"></i> Change Password
                </button>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <button class="dropdown-item text-danger" @click="logoutUser">
                  <i class="fas fa-sign-out-alt me-2"></i> Logout
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'NavBar',
  data() {
    return {
      dropdownOpen: false
    }
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'user', 'isUser'])
  },
  mounted() {
    // Initialize Bootstrap dropdowns
    this.$nextTick(() => {
      console.log('Initializing Bootstrap dropdowns...')
      this.initializeDropdowns()
    })
    
    // Add click outside handler
    document.addEventListener('click', this.handleClickOutside)
  },
  
  beforeUnmount() {
    // Remove click outside handler
    document.removeEventListener('click', this.handleClickOutside)
  },
  
  updated() {
    // Re-initialize dropdowns when component updates
    this.$nextTick(() => {
      this.initializeDropdowns()
    })
  },
  methods: {
    ...mapActions('auth', ['logout']),

    initializeDropdowns() {
      try {
        const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))
        console.log('Found dropdown elements:', dropdownElementList.length)
        dropdownElementList.forEach((dropdownToggleEl) => {
          console.log('Initializing dropdown for:', dropdownToggleEl.id)
          // Dispose existing dropdown if it exists
          const existingDropdown = bootstrap.Dropdown.getInstance(dropdownToggleEl)
          if (existingDropdown) {
            existingDropdown.dispose()
          }
          // Create new dropdown
          new bootstrap.Dropdown(dropdownToggleEl)
        })
      } catch (error) {
        console.error('Error initializing dropdowns:', error)
      }
    },

    toggleDropdown(event) {
      event.preventDefault()
      console.log('Toggle dropdown clicked')
      this.dropdownOpen = !this.dropdownOpen
    },

    handleClickOutside(event) {
      const dropdown = this.$el.querySelector('#userDropdown')
      if (dropdown && !dropdown.contains(event.target)) {
        this.dropdownOpen = false
      }
    },

    goToHome() {
      if (this.isAuthenticated) {
        switch (this.user.role) {
          case 'USER':
            this.$router.push('/user')
            break
          case 'MANAGER':
            this.$router.push('/manager')
            break
          case 'ADMIN':
            this.$router.push('/admin')
            break
          default:
            this.$router.push('/')
        }
      } else {
        this.$router.push('/')
      }
    },

    openChangePassword() {
      console.log('Change password clicked')
      this.dropdownOpen = false // Close dropdown
      this.$swal({
        title: 'Change Password',
        html: `
          <div class="text-start">
            <div class="mb-3">
              <label for="currentPassword" class="form-label">Current Password</label>
              <input type="password" class="form-control" id="currentPassword" placeholder="Enter current password">
            </div>
            <div class="mb-3">
              <label for="newPassword" class="form-label">New Password</label>
              <input type="password" class="form-control" id="newPassword" placeholder="Enter new password">
            </div>
            <div class="mb-3">
              <label for="confirmPassword" class="form-label">Confirm New Password</label>
              <input type="password" class="form-control" id="confirmPassword" placeholder="Confirm new password">
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Change Password',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
          const currentPassword = document.getElementById('currentPassword').value
          const newPassword = document.getElementById('newPassword').value
          const confirmPassword = document.getElementById('confirmPassword').value

          if (!currentPassword || !newPassword || !confirmPassword) {
            this.$swal.showValidationMessage('All fields are required')
            return false
          }

          if (newPassword !== confirmPassword) {
            this.$swal.showValidationMessage('New passwords do not match')
            return false
          }

          if (newPassword.length < 6) {
            this.$swal.showValidationMessage('New password must be at least 6 characters')
            return false
          }

          return { currentPassword, newPassword }
        }
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await this.$store.dispatch('auth/changePassword', result.value)
            this.$swal({
              icon: 'success',
              title: 'Password Changed!',
              text: 'Your password has been updated successfully.',
              confirmButtonText: 'OK'
            })
          } catch (error) {
            this.$swal({
              icon: 'error',
              title: 'Error',
              text: 'Failed to change password. Please try again.',
              confirmButtonText: 'OK'
            })
          }
        }
      })
    },

    logoutUser() {
      console.log('Logout clicked')
      this.dropdownOpen = false // Close dropdown
      this.$swal({
        title: 'Logout?',
        text: 'Are you sure you want to log out?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, log out',
        cancelButtonText: 'Cancel'
      }).then(result => {
        if (result.isConfirmed) {
          this.logout()
          // Redirect to homepage after logout
          this.$router.push('/')
        }
      })
    }
  }
}
</script>