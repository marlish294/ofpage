<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow">
          <div class="card-body p-5">
            <div class="text-center mb-4">
              <i class="fas fa-user-plus fa-3x text-primary mb-3"></i>
              <h2 class="fw-bold">Create Account</h2>
              <p class="text-muted">Join our platform today</p>
            </div>

            <form @submit.prevent="handleRegister">
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
                    placeholder="Create a password"
                    required
                    minlength="6"
                  />
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="showPassword = !showPassword"
                  >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <div class="form-text">
                  Password must be at least 6 characters long
                </div>
              </div>

              <div class="mb-4">
                <label for="role" class="form-label">Account Type</label>
                <div class="row">
                  <div class="col-6">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        id="roleUser"
                        v-model="form.role"
                        value="USER"
                      />
                      <label class="form-check-label" for="roleUser">
                        <i class="fas fa-user me-1"></i>
                        User
                        <small class="d-block text-muted">Subscribe to models</small>
                      </label>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        id="roleManager"
                        v-model="form.role"
                        value="MANAGER"
                      />
                      <label class="form-check-label" for="roleManager">
                        <i class="fas fa-user-tie me-1"></i>
                        Manager
                        <small class="d-block text-muted">Manage models</small>
                      </label>
                    </div>
                  </div>
                </div>
                <div v-if="form.role === 'MANAGER'" class="alert alert-info mt-2">
                  <i class="fas fa-info-circle me-2"></i>
                  Manager accounts require admin approval before activation.
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
                <i v-else class="fas fa-user-plus me-2"></i>
                {{ loading ? 'Creating Account...' : 'Create Account' }}
              </button>
            </form>

            <div class="text-center">
              <p class="mb-0">
                Already have an account?
                <router-link to="/login" class="text-primary text-decoration-none">
                  Sign in here
                </router-link>
              </p>
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
  name: 'Register',
  data() {
    return {
      form: {
        email: '',
        password: '',
        role: 'USER'
      },
      showPassword: false
    }
  },
  computed: {
    ...mapGetters('auth', ['loading', 'error'])
  },
  methods: {
    ...mapActions('auth', ['register', 'clearError']),

    async handleRegister() {
      const result = await this.register(this.form)
      
      if (result.success) {
        if (this.form.role === 'MANAGER') {
          // Show success message for manager registration
          this.$swal({
            icon: 'success',
            title: 'Registration Successful!',
            text: 'Your manager account has been created and is pending admin approval. You will receive an email when approved.',
            confirmButtonText: 'OK'
          }).then(() => {
            this.$router.push('/login')
          })
        } else {
          // Auto-login for regular users
          this.$swal({
            icon: 'success',
            title: 'Welcome!',
            text: 'Your account has been created successfully.',
            confirmButtonText: 'Get Started'
          }).then(() => {
            this.$router.push('/login')
          })
        }
      }
    }
  },

  mounted() {
    this.clearError()
  }
}
</script>
