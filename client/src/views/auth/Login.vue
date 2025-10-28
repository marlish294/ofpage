<!-- <template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body p-5">
            <div class="text-center mb-4">
              <i class="fas fa-star fa-3x text-primary mb-3"></i>
              <h2 class="fw-bold">Welcome Back</h2>
              <p class="text-muted">Sign in to your account</p>
            </div>

            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">Email Address</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-envelope"></i>
                  </span>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="form.email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-lock"></i>
                  </span>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    id="password"
                    v-model="form.password"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="showPassword = !showPassword"
                  >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
              </div>

              <div v-if="error" class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ error }}
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100 mb-3"
                :disabled="loading"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-sign-in-alt me-2"></i>
                {{ loading ? 'Signing In...' : 'Sign In' }}
              </button>
            </form>

            <div class="text-center">
              <p class="mb-0">
                Don't have an account?
                <router-link to="/register" class="text-primary text-decoration-none">
                  Sign up here
                </router-link>
              </p>
            </div>

            <hr class="my-4">

            <div class="text-center">
              <h6 class="text-muted mb-3">Demo Accounts</h6>
              <div class="d-grid gap-2">
                <button
                  class="btn btn-outline-primary btn-sm"
                  @click="fillDemoAccount('admin@gmail.com', 'admin123')"
                >
                  <i class="fas fa-crown me-1"></i>
                  Admin Account
                </button>
                <button
                  class="btn btn-outline-success btn-sm"
                  @click="fillDemoAccount('manager@example.com', 'manager123')"
                >
                  <i class="fas fa-user-tie me-1"></i>
                  Manager Account
                </button>
                <button
                  class="btn btn-outline-info btn-sm"
                  @click="fillDemoAccount('user@example.com', 'user123')"
                >
                  <i class="fas fa-user me-1"></i>
                  User Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      showPassword: false
    }
  },
  computed: {
    ...mapGetters('auth', ['loading', 'error'])
  },
  methods: {
    ...mapActions('auth', ['login', 'clearError']),

    async handleLogin() {
      const result = await this.login(this.form)
      
      if (result.success) {
        // Redirect based on user role
        switch (result.user.role) {
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
      }
    },

    fillDemoAccount(email, password) {
      this.form.email = email
      this.form.password = password
    }
  },

  mounted() {
    this.clearError()
  }
}
</script> -->
<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body p-5">
            <div class="text-center mb-4">
              <i class="fas fa-star fa-3x text-primary mb-3"></i>
              <h2 class="fw-bold">Welcome Back</h2>
              <p class="text-muted">Sign in to your account</p>
            </div>

            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">Email Address</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-envelope"></i>
                  </span>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="form.email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-lock"></i>
                  </span>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    id="password"
                    v-model="form.password"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="showPassword = !showPassword"
                  >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
              </div>

              <div v-if="error" class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ error }}
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100 mb-3"
                :disabled="loading"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-sign-in-alt me-2"></i>
                {{ loading ? 'Signing In...' : 'Sign In' }}
              </button>
            </form>

            <div class="text-center">
              <p class="mb-0">
                Don't have an account?
                <router-link to="/register" class="text-primary text-decoration-none">
                  Sign up here
                </router-link>
              </p>
            </div>

            <hr class="my-4">

            <div class="text-center">
              <h6 class="text-muted mb-3">Demo Accounts</h6>
              <div class="d-grid gap-2">
                <button
                  class="btn btn-outline-primary btn-sm"
                  @click="fillDemoAccount('admin@gmail.com', 'admin123')"
                >
                  <i class="fas fa-crown me-1"></i>
                  Admin Account
                </button>
                <button
                  class="btn btn-outline-success btn-sm"
                  @click="fillDemoAccount('manager@example.com', 'manager123')"
                >
                  <i class="fas fa-user-tie me-1"></i>
                  Manager Account
                </button>
                <button
                  class="btn btn-outline-info btn-sm"
                  @click="fillDemoAccount('user@example.com', 'user123')"
                >
                  <i class="fas fa-user me-1"></i>
                  User Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!-- 
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      showPassword: false
    }
  },
  computed: {
    ...mapGetters('auth', ['loading', 'error'])
  },
  methods: {
    ...mapActions('auth', ['login', 'clearError']),

    async handleLogin() {
      try {
        const result = await this.login(this.form)
        console.log('🔍 Login result:', result)

        if (result && result.success) {
          const role = result.user?.role?.toUpperCase()
          console.log('✅ Logged in as:', role)

          // Redirect based on role
          switch (role) {
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
          console.warn('❌ Login failed:', result?.error || 'Unknown error')
        }
      } catch (error) {
        console.error('⚠️ Unexpected login error:', error)
      }
    },

    fillDemoAccount(email, password) {
      this.form.email = email
      this.form.password = password
    }
  },

  mounted() {
    this.clearError()
  }
}
</script> -->
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      showPassword: false
    }
  },
  computed: {
    ...mapGetters('auth', ['loading', 'error'])
  },
  methods: {
    ...mapActions('auth', ['login', 'clearError']),

    async handleLogin() {
      console.log('🟢 [Login.vue] handleLogin fired with:', this.form)

      try {
        const result = await this.login(this.form)
        console.log('🟢 [Login.vue] login() result:', result)

        if (result.success) {
          const role = result.user?.role?.toUpperCase()
          console.log('✅ [Login.vue] Logged in as:', role)

          // Force redirect visibly
          switch (role) {
            case 'USER':
              alert('Redirecting to /user')
              this.$router.push('/user')
              break
            case 'MANAGER':
              alert('Redirecting to /manager')
              this.$router.push('/manager')
              break
            case 'ADMIN':
              alert('Redirecting to /admin')
              this.$router.push('/admin')
              break
            default:
              alert('Redirecting to home')
              this.$router.push('/')
          }
        } else {
          console.warn('❌ [Login.vue] Login failed:', result.error)
          alert(`Login failed: ${result.error || 'unknown error'}`)
        }
      } catch (err) {
        console.error('⚠️ [Login.vue] Unexpected error:', err)
        alert(`Unexpected login error: ${err.message}`)
      }
    },

    fillDemoAccount(email, password) {
      this.form.email = email
      this.form.password = password
    }
  },

  mounted() {
    this.clearError()
  }
}
</script>
