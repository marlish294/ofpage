<template>
  <nav 
    class="navbar navbar-expand-lg" 
    :class="{ 'fixed-top': isHomePage }"
    style="background-color: #ffffff; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); z-index: 1000;"
  >
    <div class="container">
      <router-link v-if="isHomePage" to="/" class="navbar-brand" style="text-decoration: none; display: flex; align-items: center; gap: 12px;">
        <img src="/logo.png" alt="SilkFans Logo" style="height: 40px; width: auto; object-fit: contain;" />
        <span style="color: #00aff0; font-weight: 600; font-size: 1.35rem; letter-spacing: 0.3px;">SilkFans</span>
      </router-link>
      <div v-else class="navbar-brand" style="display: flex; align-items: center; gap: 12px;">
        <img src="/logo.png" alt="SilkFans Logo" style="height: 40px; width: auto; object-fit: contain;" />
        <span style="color: #00aff0; font-weight: 600; font-size: 1.35rem; letter-spacing: 0.3px;">SilkFans</span>
      </div>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        style="border: none;"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <!-- Home - Left Side -->
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <button class="nav-link btn btn-link" @click="goToHome" style="color: #00aff0 !important; text-decoration: none; border: none; background: none; padding: 0.5rem 1rem;">
              <i class="fas fa-home me-1" style="color: #00aff0 !important;"></i>
              Home
            </button>
          </li>
        </ul>

        <!-- All Other Menus - Right Side -->
        <ul class="navbar-nav ms-auto">
          <!-- Creators Link - On public pages (right side) -->
          <li v-if="showCreatorsLinkOnPublicPages" class="nav-item">
            <router-link class="nav-link" to="/models" style="color: #00aff0 !important; text-decoration: none;">
              <i class="fas fa-users me-1" style="color: #00aff0 !important;"></i>
              Creators
            </router-link>
          </li>
          <!-- Creators Link - Only on user pages (right side) -->
          <li v-if="showCreatorsLinkOnUserPages" class="nav-item">
            <router-link class="nav-link" to="/models" style="color: #00aff0 !important; text-decoration: none;">
              <i class="fas fa-users me-1" style="color: #00aff0 !important;"></i>
              Creators
            </router-link>
          </li>
          <!-- User Quick Access -->
          <li v-if="isUser" class="nav-item">
            <router-link class="nav-link" to="/user/models" style="color: #00aff0 !important; text-decoration: none;">
              <i class="fas fa-images me-1" style="color: #00aff0 !important;"></i>
              Models
            </router-link>
          </li>
          <li v-if="isUser" class="nav-item">
            <router-link class="nav-link" to="/user/chat" style="color: #00aff0 !important; text-decoration: none;">
              <i class="fas fa-comments me-1" style="color: #00aff0 !important;"></i>
              Chats
            </router-link>
          </li>

          <!-- Manager Quick Access -->
          <li v-if="isManager" class="nav-item">
            <router-link class="nav-link" to="/manager/model" style="color: #00aff0 !important; text-decoration: none;">
              <i class="fas fa-user-edit me-1" style="color: #00aff0 !important;"></i>
              Model
            </router-link>
          </li>
          <li v-if="isManager" class="nav-item">
            <router-link class="nav-link" to="/manager/chats" style="color: #00aff0 !important; text-decoration: none;">
              <i class="fas fa-comments me-1" style="color: #00aff0 !important;"></i>
              Chats
            </router-link>
          </li>
          <li v-if="isManager" class="nav-item">
            <router-link class="nav-link" to="/manager/subscribers" style="color: #00aff0 !important; text-decoration: none;">
              <i class="fas fa-users me-1" style="color: #00aff0 !important;"></i>
              Subscribers
            </router-link>
          </li>

          <!-- Admin Quick Access -->
          <li v-if="isAdmin" class="nav-item">
            <router-link class="nav-link" to="/admin/users" style="color: #00aff0 !important; text-decoration: none;">
              <i class="fas fa-users me-1" style="color: #00aff0 !important;"></i>
              Users
            </router-link>
          </li>
          <li v-if="isAdmin" class="nav-item">
            <router-link class="nav-link" to="/admin/models" style="color: #00aff0 !important; text-decoration: none;">
              <i class="fas fa-images me-1" style="color: #00aff0 !important;"></i>
              Models
            </router-link>
          </li>
          <li v-if="isAdmin" class="nav-item">
            <router-link class="nav-link" to="/admin/chats" style="color: #00aff0 !important; text-decoration: none;">
              <i class="fas fa-comments me-1" style="color: #00aff0 !important;"></i>
              Chats
            </router-link>
          </li>

          <!-- Auth Links -->
          <li v-if="!isAuthenticated" class="nav-item">
            <router-link class="nav-link" to="/login" style="color: #00aff0 !important; text-decoration: none;">
              <i class="fas fa-sign-in-alt me-1" style="color: #00aff0 !important;"></i>
              Login
            </router-link>
          </li>
          
          <li v-if="!isAuthenticated" class="nav-item">
            <router-link class="nav-link" to="/register" style="color: #00aff0 !important; text-decoration: none;">
              <i class="fas fa-user-plus me-1" style="color: #00aff0 !important;"></i>
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
              style="color: #00aff0 !important; text-decoration: none; cursor: pointer;"
            >
              <i class="fas fa-user me-1" style="color: #00aff0 !important;"></i>
              {{ user?.email }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown" :class="{ show: dropdownOpen }" style="border: 1px solid rgba(0, 175, 240, 0.2); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
              <li>
                <button class="dropdown-item" @click="openChangePassword" style="color: #00aff0; padding: 0.5rem 1rem;">
                  <i class="fas fa-key me-2" style="color: #00aff0;"></i> Change Password
                </button>
              </li>
              <li><hr class="dropdown-divider" style="margin: 0.5rem 0; border-color: rgba(0, 175, 240, 0.2);" /></li>
              <li>
                <button class="dropdown-item" @click="logoutUser" style="color: #ff4d6d; padding: 0.5rem 1rem;">
                  <i class="fas fa-sign-out-alt me-2" style="color: #ff4d6d;"></i> Logout
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
    ...mapGetters('auth', ['isAuthenticated', 'user', 'isUser', 'isManager', 'isAdmin']),
    isHomePage() {
      return this.$route.path === '/'
    },
    showCreatorsLink() {
      // Show on public pages (/, /models, /model/:id, /values, /safety) and user pages (/user/*)
      // Hide on manager (/manager/*) and admin (/admin/*) pages
      const path = this.$route.path
      const isPublicPage = path === '/' || 
                          path === '/models' || 
                          path.startsWith('/model/') || 
                          path === '/values' || 
                          path === '/safety'
      const isUserPage = path.startsWith('/user')
      const isManagerPage = path.startsWith('/manager')
      const isAdminPage = path.startsWith('/admin')
      
      return (isPublicPage || isUserPage) && !isManagerPage && !isAdminPage
    },
    showCreatorsLinkOnPublicPages() {
      // Show only on public pages (localhost:8080), not on user/manager/admin pages
      const path = this.$route.path
      const isPublicPage = path === '/' || 
                          path === '/models' || 
                          path.startsWith('/model/') || 
                          path === '/values' || 
                          path === '/safety'
      const isManagerPage = path.startsWith('/manager')
      const isAdminPage = path.startsWith('/admin')
      
      return isPublicPage && !isManagerPage && !isAdminPage
    },
    showCreatorsLinkOnUserPages() {
      // Show only on user pages, on the right side
      const path = this.$route.path
      const isUserPage = path.startsWith('/user')
      const isManagerPage = path.startsWith('/manager')
      const isAdminPage = path.startsWith('/admin')
      
      return isUserPage && !isManagerPage && !isAdminPage
    }
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
      
      // Track password visibility states
      let showCurrentPassword = false
      let showNewPassword = false
      let showConfirmPassword = false
      
      this.$swal({
        title: '<h2 style="color: #1a1a1a; font-size: 2rem; font-weight: 700; margin-bottom: 2rem;">Change Password</h2>',
        html: `
          <style>
            .swal2-popup {
              width: 450px !important;
              padding: 2.5rem !important;
            }
            .swal2-title {
              padding: 0 !important;
              margin: 0 !important;
            }
            .change-password-input {
              position: relative;
              margin-bottom: 1.5rem;
            }
            .change-password-label {
              position: absolute;
              left: 1rem;
              top: 50%;
              transform: translateY(-50%);
              font-size: 1rem;
              color: #8a96a3;
              transition: all 0.2s ease;
              pointer-events: none;
              z-index: 1;
              background-color: transparent;
              padding: 0;
            }
            .change-password-label.floating {
              top: 0.5rem;
              transform: translateY(0);
              font-size: 0.75rem;
              color: #00aff0;
              background-color: #ffffff;
              padding: 0 0.5rem;
            }
            .change-password-field {
              width: 100%;
              padding: 1.25rem 3.5rem 1.25rem 1rem;
              border: 2px solid #e0e0e0;
              border-radius: 8px;
              font-size: 1rem;
              color: #1a1a1a;
              background-color: #ffffff;
              transition: all 0.2s ease;
              outline: none;
            }
            .change-password-field:focus {
              border-color: #00aff0;
            }
            .change-password-toggle {
              position: absolute;
              right: 1rem;
              top: 50%;
              transform: translateY(-50%);
              background: none;
              border: none;
              color: #8a96a3;
              cursor: pointer;
              padding: 0.5rem;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 1.125rem;
            }
            .change-password-toggle:hover {
              color: #00aff0;
            }
            .swal2-actions {
              margin-top: 1.5rem !important;
            }
            .swal2-confirm {
              width: 100% !important;
              padding: 1rem 2rem !important;
              background-color: #00aff0 !important;
              color: #ffffff !important;
              border: none !important;
              border-radius: 8px !important;
              font-size: 1rem !important;
              font-weight: 700 !important;
              cursor: pointer !important;
              transition: all 0.2s ease !important;
            }
            .swal2-confirm:hover {
              background-color: #0091ea !important;
            }
            .swal2-confirm:disabled {
              opacity: 0.5 !important;
            }
            .swal2-cancel {
              width: 100% !important;
              padding: 0.75rem 2rem !important;
              background-color: transparent !important;
              color: #666666 !important;
              border: 2px solid #e0e0e0 !important;
              border-radius: 8px !important;
              font-size: 1rem !important;
              font-weight: 500 !important;
              cursor: pointer !important;
              transition: all 0.2s ease !important;
              margin-top: 0.75rem !important;
            }
            .swal2-cancel:hover {
              border-color: #00aff0 !important;
              color: #00aff0 !important;
            }
          </style>
          <div style="text-align: left;">
            <!-- Current Password -->
            <div class="change-password-input">
              <label for="currentPassword" class="change-password-label" id="currentPasswordLabel">Current Password</label>
              <div style="position: relative;">
                <input 
                  type="password" 
                  class="change-password-field" 
                  id="currentPassword" 
                  onfocus="document.getElementById('currentPasswordLabel').classList.add('floating'); document.getElementById('currentPassword').style.borderColor = '#00aff0';"
                  onblur="if(!this.value) { document.getElementById('currentPasswordLabel').classList.remove('floating'); } document.getElementById('currentPassword').style.borderColor = '#e0e0e0';"
                  oninput="if(this.value) { document.getElementById('currentPasswordLabel').classList.add('floating'); } else { document.getElementById('currentPasswordLabel').classList.remove('floating'); }"
                />
                <button 
                  type="button" 
                  class="change-password-toggle" 
                  id="toggleCurrentPassword"
                  onclick="
                    const input = document.getElementById('currentPassword');
                    const button = document.getElementById('toggleCurrentPassword');
                    if(input.type === 'password') {
                      input.type = 'text';
                      button.innerHTML = '<i class=\\'fas fa-eye-slash\\'></i>';
                    } else {
                      input.type = 'password';
                      button.innerHTML = '<i class=\\'fas fa-eye\\'></i>';
                    }
                  "
                >
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </div>
            
            <!-- New Password -->
            <div class="change-password-input">
              <label for="newPassword" class="change-password-label" id="newPasswordLabel">New Password</label>
              <div style="position: relative;">
                <input 
                  type="password" 
                  class="change-password-field" 
                  id="newPassword" 
                  onfocus="document.getElementById('newPasswordLabel').classList.add('floating'); document.getElementById('newPassword').style.borderColor = '#00aff0';"
                  onblur="if(!this.value) { document.getElementById('newPasswordLabel').classList.remove('floating'); } document.getElementById('newPassword').style.borderColor = '#e0e0e0';"
                  oninput="if(this.value) { document.getElementById('newPasswordLabel').classList.add('floating'); } else { document.getElementById('newPasswordLabel').classList.remove('floating'); }"
                />
                <button 
                  type="button" 
                  class="change-password-toggle" 
                  id="toggleNewPassword"
                  onclick="
                    const input = document.getElementById('newPassword');
                    const button = document.getElementById('toggleNewPassword');
                    if(input.type === 'password') {
                      input.type = 'text';
                      button.innerHTML = '<i class=\\'fas fa-eye-slash\\'></i>';
                    } else {
                      input.type = 'password';
                      button.innerHTML = '<i class=\\'fas fa-eye\\'></i>';
                    }
                  "
                >
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </div>
            
            <!-- Confirm Password -->
            <div class="change-password-input">
              <label for="confirmPassword" class="change-password-label" id="confirmPasswordLabel">Confirm New Password</label>
              <div style="position: relative;">
                <input 
                  type="password" 
                  class="change-password-field" 
                  id="confirmPassword" 
                  onfocus="document.getElementById('confirmPasswordLabel').classList.add('floating'); document.getElementById('confirmPassword').style.borderColor = '#00aff0';"
                  onblur="if(!this.value) { document.getElementById('confirmPasswordLabel').classList.remove('floating'); } document.getElementById('confirmPassword').style.borderColor = '#e0e0e0';"
                  oninput="if(this.value) { document.getElementById('confirmPasswordLabel').classList.add('floating'); } else { document.getElementById('confirmPasswordLabel').classList.remove('floating'); }"
                />
                <button 
                  type="button" 
                  class="change-password-toggle" 
                  id="toggleConfirmPassword"
                  onclick="
                    const input = document.getElementById('confirmPassword');
                    const button = document.getElementById('toggleConfirmPassword');
                    if(input.type === 'password') {
                      input.type = 'text';
                      button.innerHTML = '<i class=\\'fas fa-eye-slash\\'></i>';
                    } else {
                      input.type = 'password';
                      button.innerHTML = '<i class=\\'fas fa-eye\\'></i>';
                    }
                  "
                >
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </div>
            <div style="margin-top: 0.5rem; color: #8a96a3; font-size: 0.8125rem;">
              Password must be at least 6 characters
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Change Password',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#00aff0',
        width: '450px',
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
              confirmButtonText: 'OK',
              confirmButtonColor: '#00aff0'
            })
          } catch (error) {
            this.$swal({
              icon: 'error',
              title: 'Error',
              text: 'Failed to change password. Please try again.',
              confirmButtonText: 'OK',
              confirmButtonColor: '#00aff0'
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
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#ff4d6d',
        cancelButtonColor: '#00aff0',
        buttonsStyling: true,
        customClass: {
          icon: 'logout-warning-icon'
        },
        didOpen: () => {
          // Set icon color to blue when modal opens
          const icon = document.querySelector('.logout-warning-icon')
          if (icon) {
            icon.style.borderColor = '#00aff0'
            icon.style.color = '#00aff0'
            const iconContent = icon.querySelector('.swal2-icon-content')
            if (iconContent) {
              iconContent.style.color = '#00aff0'
            }
          }
        }
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

<style scoped>
.nav-link {
  color: #00aff0 !important;
  transition: color 0.2s ease;
}

.nav-link:hover,
.navbar-brand:hover {
  color: #0091ea !important;
}

.nav-link:hover i,
.nav-link:hover .fas {
  color: #0091ea !important;
}

.nav-link.btn-link {
  color: #00aff0 !important;
  transition: color 0.2s ease;
}

.nav-link.btn-link:hover {
  color: #0091ea !important;
}

.nav-link.btn-link:hover i,
.nav-link.btn-link:hover .fas {
  color: #0091ea !important;
}

.nav-link i {
  color: #00aff0 !important;
  transition: color 0.2s ease;
}

.dropdown-toggle {
  color: #00aff0 !important;
  transition: color 0.2s ease;
}

.dropdown-toggle:hover {
  color: #0091ea !important;
}

.dropdown-toggle:hover i,
.dropdown-toggle:hover .fas {
  color: #0091ea !important;
}

.dropdown-toggle i {
  color: #00aff0 !important;
  transition: color 0.2s ease;
}

.dropdown-item:hover {
  background-color: rgba(0, 175, 240, 0.1);
}

.dropdown-item i {
  color: #00aff0 !important;
}
</style>

<style>
.logout-warning-icon,
.swal2-warning.logout-warning-icon {
  border-color: #00aff0 !important;
}

.logout-warning-icon .swal2-icon-content,
.swal2-warning.logout-warning-icon .swal2-icon-content,
.logout-warning-icon .swal2-icon-content::before,
.swal2-warning.logout-warning-icon .swal2-icon-content::before,
.logout-warning-icon .swal2-icon-content::after,
.swal2-warning.logout-warning-icon .swal2-icon-content::after {
  color: #00aff0 !important;
}

/* Target the exclamation mark text */
.logout-warning-icon .swal2-icon-content,
.swal2-warning.logout-warning-icon .swal2-icon-content {
  color: #00aff0 !important;
  border-color: #00aff0 !important;
}
</style>

