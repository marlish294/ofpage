<template>
  <div style="min-height: 100vh; background-color: #ffffff;">
    <div class="container" style="min-height: 100vh;">
      <div class="row align-items-center" style="min-height: 100vh;">
        <!-- Left Column: Branding -->
        <div class="col-12 col-lg-6 d-flex flex-column justify-content-center" style="padding: 4rem 2rem;">
          <!-- Logo and Brand -->
          <div class="mb-5">
            <div class="d-flex align-items-center mb-4" style="gap: 12px;">
              <router-link to="/" style="display: flex; align-items: center; gap: 12px; text-decoration: none;">
                <img src="/logo.png" alt="SilkFans Logo" style="height: 50px; width: auto; object-fit: contain;" />
                <span style="color: #00aff0; font-weight: 600; font-size: 1.75rem; letter-spacing: 0.3px; cursor: pointer; transition: color 0.3s ease;" @mouseover="e => e.target.style.color = '#0091ea'" @mouseout="e => e.target.style.color = '#00aff0'">SilkFans</span>
              </router-link>
            </div>
          </div>
          
          <!-- Headline -->
          <h1 style="color: #1a1a1a; font-size: 2.5rem; font-weight: 700; line-height: 1.2; margin-bottom: 1.5rem; max-width: 500px;">
            Sign up to support your favorite creators
          </h1>
          
          <!-- Intro Text -->
          <p style="color: #666666; font-size: 1.125rem; line-height: 1.6; margin-bottom: 2rem; max-width: 480px;">
            Join our community and connect with creators around the world. Your support helps creators thrive and create amazing content.
          </p>
        </div>

        <!-- Right Column: Login Form -->
        <div class="col-12 col-lg-6 d-flex flex-column justify-content-center" style="padding: 4rem 2rem;">
          <div style="max-width: 450px; margin: 0 auto; width: 100%;">

            <!-- Form Card -->
            <div style="background: #ffffff; border-radius: 12px; padding: 2.5rem;">
              <!-- Title -->
              <h2 style="color: #1a1a1a; font-size: 2rem; font-weight: 700; margin-bottom: 2rem;">Log in</h2>

              <!-- Error Message -->
              <div v-if="error" style="background-color: #ffeef2; border: 1px solid #ff4d6d; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem; color: #ff4d6d;">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ error }}
              </div>

              <!-- Login Form -->
              <form @submit.prevent="handleLogin">
                <!-- Email Input -->
                <div style="margin-bottom: 1.5rem; position: relative;">
                  <label 
                    for="email" 
                    :style="{
                      position: 'absolute',
                      left: '1rem',
                      top: form.email ? '0.5rem' : '50%',
                      transform: form.email ? 'translateY(0)' : 'translateY(-50%)',
                      fontSize: form.email ? '0.75rem' : '1rem',
                      color: form.email ? '#00aff0' : '#8a96a3',
                      transition: 'all 0.2s ease',
                      pointerEvents: 'none',
                      zIndex: 1,
                      backgroundColor: form.email ? '#ffffff' : 'transparent',
                      padding: form.email ? '0 0.5rem' : '0'
                    }"
                  >
                    Email
                  </label>
                  
                  <input
                    type="email"
                    id="email"
                    v-model="form.email"
                    required
                    style="
                      width: 100%;
                      padding: 1.25rem 1rem;
                      border: 2px solid #e0e0e0;
                      border-radius: 8px;
                      font-size: 1rem;
                      color: #1a1a1a;
                      background-color: #ffffff;
                      transition: all 0.2s ease;
                      outline: none;
                    "
                    @focus="e => e.target.style.borderColor = '#00aff0'"
                    @blur="e => e.target.style.borderColor = '#e0e0e0'"
                  />
                </div>

                <!-- Password Input -->
                <div style="margin-bottom: 1.5rem; position: relative;">
                  <label 
                    for="password" 
                    :style="{
                      position: 'absolute',
                      left: '1rem',
                      top: form.password || showPassword ? '0.5rem' : '50%',
                      transform: form.password || showPassword ? 'translateY(0)' : 'translateY(-50%)',
                      fontSize: form.password || showPassword ? '0.75rem' : '1rem',
                      color: form.password || showPassword ? '#00aff0' : '#8a96a3',
                      transition: 'all 0.2s ease',
                      pointerEvents: 'none',
                      zIndex: 1,
                      backgroundColor: form.password || showPassword ? '#ffffff' : 'transparent',
                      padding: form.password || showPassword ? '0 0.5rem' : '0'
                    }"
                  >
                    Password
                  </label>
                  <div style="position: relative;">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      id="password"
                      v-model="form.password"
                      required
                      style="
                        width: 100%;
                        padding: 1.25rem 3.5rem 1.25rem 1rem;
                        border: 2px solid #e0e0e0;
                        border-radius: 8px;
                        font-size: 1rem;
                        color: #1a1a1a;
                        background-color: #ffffff;
                        transition: all 0.2s ease;
                        outline: none;
                      "
                      @focus="e => e.target.style.borderColor = '#00aff0'"
                      @blur="e => e.target.style.borderColor = '#e0e0e0'"
                    />
                    <button
                      type="button"
                      @click="showPassword = !showPassword"
                      style="
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
                      "
                    >
                      <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" style="font-size: 1.125rem;"></i>
                    </button>
                  </div>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  :disabled="loading || !form.email || !form.password"
                  :style="{
                    width: '100%',
                    padding: '1rem 2rem',
                    backgroundColor: '#00aff0',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginBottom: '1.5rem',
                    opacity: (loading || !form.email || !form.password) ? 0.5 : 1
                  }"
                  @mouseover="e => { if (!loading && form.email && form.password) e.target.style.backgroundColor = '#0091ea'; }"
                  @mouseout="e => { if (!loading && form.email && form.password) e.target.style.backgroundColor = '#00aff0'; }"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" style="width: 1rem; height: 1rem; border-width: 2px;"></span>
                  <span v-else><i class="fas fa-sign-in-alt me-2"></i></span>
                  {{ loading ? 'Signing In...' : 'Log in' }}
                </button>
              </form>

              <!-- Legal Disclaimer -->
              <div style="margin-bottom: 1.5rem;">
                <p style="color: #8a96a3; font-size: 0.8125rem; line-height: 1.5; margin: 0;">
                  By logging in you agree to our <a href="#" style="color: #00aff0; text-decoration: none;">Terms of Service</a> and <a href="#" style="color: #00aff0; text-decoration: none;">Privacy Policy</a>.
                </p>
                <p style="color: #8a96a3; font-size: 0.8125rem; line-height: 1.5; margin-top: 0.5rem; margin-bottom: 0;">
                  You must be 18+ to use this platform.
                </p>
              </div>

              <!-- Action Links -->
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                <router-link to="/forgot-password" style="color: #00aff0; text-decoration: none; font-size: 0.9375rem; text-align: center; transition: color 0.3s ease;" @mouseover="e => e.target.style.color = '#0091ea'" @mouseout="e => e.target.style.color = '#00aff0'">
                  Forgot password?
                </router-link>
                <div style="text-align: center; color: #666666; font-size: 0.9375rem;">
                  Don't have an account? 
                  <router-link to="/register" style="color: #00aff0; text-decoration: none; font-weight: 600; transition: color 0.3s ease;" @mouseover="e => e.target.style.color = '#0091ea'" @mouseout="e => e.target.style.color = '#00aff0'">
                    Sign up
                  </router-link>
                </div>
                <router-link to="/" style="color: #00aff0; text-decoration: none; font-size: 0.9375rem; text-align: center; transition: color 0.3s ease;" @mouseover="e => e.target.style.color = '#0091ea'" @mouseout="e => e.target.style.color = '#00aff0'">
                  Back to Home?
                </router-link>
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
      
      if (result && result.success) {
        const role = result.user?.role?.toUpperCase()
        
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
      }
    }
  },

  mounted() {
    this.clearError()
  }
}
</script>

<style scoped>
a:hover {
  opacity: 0.8;
}
</style>
