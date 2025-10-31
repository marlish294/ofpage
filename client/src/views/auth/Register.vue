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

        <!-- Right Column: Register Form -->
        <div class="col-12 col-lg-6 d-flex flex-column justify-content-center" style="padding: 4rem 2rem;">
          <div style="max-width: 450px; margin: 0 auto; width: 100%;">

            <!-- Form Card -->
            <div style="background: #ffffff; border-radius: 12px; padding: 2.5rem;">
              <!-- Title -->
              <h2 style="color: #1a1a1a; font-size: 2rem; font-weight: 700; margin-bottom: 2rem;">Sign up</h2>

              <!-- Error Message -->
              <div v-if="error" style="background-color: #ffeef2; border: 1px solid #ff4d6d; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem; color: #ff4d6d;">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ error }}
              </div>

              <!-- Register Form -->
              <form @submit.prevent="handleRegister">
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
                      minlength="6"
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
                        justifyContent: center;
                      "
                    >
                      <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" style="font-size: 1.125rem;"></i>
                    </button>
                  </div>
                  <div style="margin-top: 0.5rem; color: #8a96a3; font-size: 0.8125rem;">
                    Password must be at least 6 characters
                  </div>
                </div>

                <!-- Account Type Selection -->
                <div style="margin-bottom: 1.5rem;">
                  <label style="display: block; color: #1a1a1a; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.75rem;">Account Type</label>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <label style="
                      border: 2px solid #e0e0e0;
                      border-radius: 8px;
                      padding: 1rem;
                      cursor: pointer;
                      transition: all 0.2s ease;
                      background-color: form.role === 'USER' ? '#f0f9ff' : '#ffffff';
                      border-color: form.role === 'USER' ? '#00aff0' : '#e0e0e0';
                      position: relative;
                    ">
                      <input
                        type="radio"
                        v-model="form.role"
                        value="USER"
                        style="display: none;"
                      />
                      <!-- Checkmark indicator -->
                      <div v-if="form.role === 'USER'" style="
                        position: absolute;
                        top: 0.5rem;
                        right: 0.5rem;
                        width: 20px;
                        height: 20px;
                        background-color: #00aff0;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #ffffff;
                        font-size: 0.75rem;
                      ">
                        <i class="fas fa-check"></i>
                      </div>
                      <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-user" :style="{ color: form.role === 'USER' ? '#00aff0' : '#8a96a3' }"></i>
                        <div>
                          <div style="font-weight: 600; color: #1a1a1a; font-size: 0.9375rem;">User</div>
                          <div style="font-size: 0.8125rem; color: #8a96a3;">Subscribe</div>
                        </div>
                      </div>
                    </label>
                    <label style="
                      border: 2px solid #e0e0e0;
                      border-radius: 8px;
                      padding: 1rem;
                      cursor: pointer;
                      transition: all 0.2s ease;
                      background-color: form.role === 'MANAGER' ? '#f0f9ff' : '#ffffff';
                      border-color: form.role === 'MANAGER' ? '#00aff0' : '#e0e0e0';
                      position: relative;
                    ">
                      <input
                        type="radio"
                        v-model="form.role"
                        value="MANAGER"
                        style="display: none;"
                      />
                      <!-- Checkmark indicator -->
                      <div v-if="form.role === 'MANAGER'" style="
                        position: absolute;
                        top: 0.5rem;
                        right: 0.5rem;
                        width: 20px;
                        height: 20px;
                        background-color: #00aff0;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #ffffff;
                        font-size: 0.75rem;
                      ">
                        <i class="fas fa-check"></i>
                      </div>
                      <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-user-tie" :style="{ color: form.role === 'MANAGER' ? '#00aff0' : '#8a96a3' }"></i>
                        <div>
                          <div style="font-weight: 600; color: #1a1a1a; font-size: 0.9375rem;">Manager</div>
                          <div style="font-size: 0.8125rem; color: #8a96a3;">Manage</div>
                        </div>
                      </div>
                    </label>
                  </div>
                  <div v-if="form.role === 'MANAGER'" style="margin-top: 1rem; padding: 0.75rem; background-color: #e3f2fd; border-radius: 8px; border-left: 3px solid #00aff0;">
                    <p style="color: #1565c0; font-size: 0.8125rem; margin: 0;">
                      <i class="fas fa-info-circle me-2"></i>
                      Manager accounts require admin approval before activation.
                    </p>
                  </div>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  :disabled="loading || !form.email || !form.password || form.password.length < 6"
                  style="
                    width: 100%;
                    padding: 1rem 2rem;
                    background-color: #00aff0;
                    color: #ffffff;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    margin-bottom: 1.5rem;
                    opacity: loading || !form.email || !form.password || form.password.length < 6 ? 0.5 : 1;
                  "
                  @mouseover="e => { if (!loading && form.email && form.password && form.password.length >= 6) e.target.style.backgroundColor = '#0091ea'; }"
                  @mouseout="e => { if (!loading && form.email && form.password && form.password.length >= 6) e.target.style.backgroundColor = '#00aff0'; }"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" style="width: 1rem; height: 1rem; border-width: 2px;"></span>
                  <span v-else><i class="fas fa-user-plus me-2"></i></span>
                  {{ loading ? 'Creating Account...' : 'Sign up' }}
                </button>
              </form>

              <!-- Legal Disclaimer -->
              <div style="margin-bottom: 1.5rem;">
                <p style="color: #8a96a3; font-size: 0.8125rem; line-height: 1.5; margin: 0;">
                  By signing up you agree to our <a href="#" style="color: #00aff0; text-decoration: none;">Terms of Service</a> and <a href="#" style="color: #00aff0; text-decoration: none;">Privacy Policy</a>.
                </p>
                <p style="color: #8a96a3; font-size: 0.8125rem; line-height: 1.5; margin-top: 0.5rem; margin-bottom: 0;">
                  You must be 18+ to use this platform.
                </p>
              </div>

              <!-- Action Links -->
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                <div style="text-align: center; color: #666666; font-size: 0.9375rem;">
                  Already have an account? 
                  <router-link to="/login" style="color: #00aff0; text-decoration: none; font-weight: 600; transition: color 0.3s ease;" @mouseover="e => e.target.style.color = '#0091ea'" @mouseout="e => e.target.style.color = '#00aff0'">
                    Log in
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
      
      if (result && result.success) {
        if (this.form.role === 'MANAGER') {
          this.$swal({
            icon: 'success',
            title: 'Registration Successful!',
            text: 'Your manager account has been created and is pending admin approval. You will receive an email when approved.',
            confirmButtonText: 'OK'
          }).then(() => {
            this.$router.push('/login')
          })
        } else {
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

<style scoped>
a:hover {
  opacity: 0.8;
}
</style>
