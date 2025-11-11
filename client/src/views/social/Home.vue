<template>
  <div style="background-color: #ffffff;">
    <!-- Who we are Section - First Section After Navbar -->
    <section 
      class="who-we-are-section" 
      :style="backgroundStyle"
    >
      <!-- Background Image Overlay - Gradient from #b6edfd to transparent only in bottom 15% -->
      <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(0deg, #b6edfd 0%, transparent 15%, transparent 100%); z-index: 1;"></div>
      
      <div class="container" style="position: relative; z-index: 2;">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10">
            <h2 
              class="section-title" 
              style="
                color: #8a96a3; 
                font-size: 16px; 
                font-weight: 700; 
                margin-bottom: 2rem; 
                text-decoration: underline; 
                text-decoration-color: #00aff0; 
                text-decoration-thickness: 5px; 
                text-underline-offset: 15px;
                line-height: 1.2;
              "
            >
              Who we are
            </h2>
            <p class="who-we-are-text" style="color: #000; font-weight: 500; max-width: 950px;">
              SilkFans is a premium 18+ subscription platform designed to empower creators to own their craft, monetize exclusive content, and build genuine, meaningful connections with their audience.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission, Vision & Values Section -->
    <section 
      class="mission-section" 
      style="
        position: relative;
        background-color: #00aff0;
        padding: 6rem 0;
        display: flex;
        align-items: center;
        margin-top: 0;
      "
    >
      <div class="container" style="position: relative; z-index: 2;">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10">
            <h2 
              class="section-title" 
              style="
                color: #ffffff; 
                font-size: 16px; 
                font-weight: 700; 
                margin-bottom: 2rem; 
                text-decoration: underline; 
                text-decoration-color: #ffffff; 
                text-decoration-thickness: 5px; 
                text-underline-offset: 15px;
                line-height: 1.2;
              "
            >
              Mission, Vision & Values
            </h2>
            
            <!-- Images Row -->
            <div class="d-flex align-items-center mb-4" style="gap: 1.5rem; flex-wrap: wrap;">
              <img src="/ofphoto.png" alt="Mission icon" style="width: 38px; height: auto; object-fit: contain;" />
              <img src="/ofphoto2.png" alt="Vision icon" style="width: 38px; height: auto; object-fit: contain;" />
              <img src="/ofphoto3.png" alt="Values icon" style="width: 38px; height: auto; object-fit: contain;" />
              <img src="/ofphoto4.png" alt="Community icon" style="width: 38px; height: auto; object-fit: contain;" />
              <img src="/ofphoto5.png" alt="Platform icon" style="width: 38px; height: auto; object-fit: contain;" />
            </div>
            
            <p class="mission-text" style="color: #000; font-weight: 500; max-width: 950px; margin-top: 2rem;">
              As a creator-first platform, our community is at the heart of everything we do.
            </p>
            
            <div class="mt-4" style="margin-top: 2rem;">
              <router-link to="/values" class="btn btn-white" style="background-color: #ffffff; color: #00aff0; border: none; padding: 0.75rem 2rem; font-weight: 600; font-size: 14px; border-radius: 1000px; text-decoration: none; display: inline-block; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);" @mouseenter="e => { e.target.style.backgroundColor = '#f8f9fa'; e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'; }" @mouseleave="e => { e.target.style.backgroundColor = '#ffffff'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'; }">
                Our mission, vision and values
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Our approach to safety Section -->
    <section 
      class="safety-section" 
      style="
        position: relative;
        background-color: #ffffff;
        padding: 6rem 0;
        display: flex;
        align-items: center;
        margin-top: 4rem;
      "
    >
      <div class="container" style="position: relative; z-index: 2;">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 d-flex flex-column align-items-end">
            <!-- Image above heading -->
            <div class="mb-4" style="text-align: right;">
              <img src="/ourreq.png" alt="Safety approach icon" style="width: 78px; height: auto; object-fit: contain;" />
            </div>
            
            <h2 
              class="section-title" 
              style="
                color: #8a96a3; 
                font-size: 16px; 
                font-weight: 700; 
                margin-bottom: 2rem; 
                text-decoration: underline; 
                text-decoration-color: #00aff0; 
                text-decoration-thickness: 5px; 
                text-underline-offset: 15px;
                line-height: 1.2;
                text-align: right;
              "
            >
              Our approach to safety
            </h2>
            <p class="safety-text" style="color: #000; font-weight: 500; max-width: 950px; text-align: right;">
              We are committed to building the safest social media platform in the world.
            </p>
            
            <div class="mt-4" style="margin-top: 2rem; text-align: right;">
              <router-link to="/safety" class="btn btn-safety" style="background-color: #00aff0; color: #ffffff; border: none; padding: 0.75rem 2rem; font-weight: 600; font-size: 14px; border-radius: 1000px; text-decoration: none; display: inline-block; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);" @mouseenter="e => { e.target.style.backgroundColor = '#0099d6'; e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'; }" @mouseleave="e => { e.target.style.backgroundColor = '#00aff0'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'; }">
                Our approach to safety
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Our creators Section -->
    <section 
      class="our-creators-section" 
      style="
        position: relative;
        background: linear-gradient(90deg, #b6edfd 20%, #00aff0 20%, #00aff0 100%);
        padding: 6rem 0 12rem 0;
        margin-top: 4rem;
        overflow: visible;
      "
    >
      <div class="container" style="position: relative; z-index: 2;">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 d-flex flex-column align-items-end">
            <!-- Image above heading -->
            <div class="mb-4" style="text-align: right;">
              <img src="/ourcreators.png" alt="Our creators icon" style="width: 78px; height: auto; object-fit: contain;" />
            </div>
            
            <h2 
              class="section-title" 
              style="
                color: #ffffff; 
                font-size: 16px; 
                font-weight: 700; 
                margin-bottom: 2rem; 
                text-decoration: underline; 
                text-decoration-color: #ffffff; 
                text-decoration-thickness: 5px; 
                text-underline-offset: 15px;
                line-height: 1.2;
                text-align: right;
              "
            >
              Our creators
            </h2>
            <p class="creators-text" style="color: #000; font-weight: 500; max-width: 950px; margin-bottom: 3rem; text-align: right;">
              We provide an inclusive, welcoming platform for a diverse range of content creators. Discover more at of.tv.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Models Grid - positioned to hang out from blue section -->
    <div class="container-fluid models-grid-container" style="padding-top: 0; padding-bottom: 0; overflow: visible; position: relative; margin-top: -12rem; z-index: 10;">
      <div class="row">
        <div class="col-12">
          <h2 class="mb-4" style="display: none;">
            <i class="fas fa-users me-2"></i>
            Featured Models
          </h2>
        </div>
      </div>

      <div v-if="loading" class="row">
        <div class="col-12 text-center">
          <div class="loading">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="error" class="row">
        <div class="col-12">
          <div class="alert alert-danger" role="alert">
            <i class="fas fa-exclamation-triangle me-2"></i>
            {{ error }}
            <button class="btn btn-outline-danger btn-sm ms-2" @click="fetchModels()">
              <i class="fas fa-redo me-1"></i>
              Retry
            </button>
          </div>
        </div>
      </div>

      <div v-else class="row" style="margin-bottom: 0; justify-content: center; position: relative; z-index: 10;">
        <div
          v-for="model in firstThreeModels"
          :key="model.id"
          class="model-card-col"
          style="
            width: 389px;
            margin: 0 0.75rem 4rem 0.75rem;
            display: flex;
            position: relative;
          "
        >
          <div 
            class="model-card-wrapper"
            style="
              width: 100%;
              display: flex;
              flex-direction: column;
              height: 100%;
            "
          >
            <div 
              class="card model-card" 
              @click="viewModel(model.id)" 
              style="
                background-color: #ffffff; 
                border: none; 
                border-radius: 6px; 
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12); 
                overflow: hidden; 
                transition: all 0.3s ease;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                height: 418px;
                position: relative;
                width: 389px;
              "
              @mouseenter="handleCardHover"
              @mouseleave="handleCardLeave"
            >
              <!-- Timestamp at top right -->
              <div style="position: absolute; top: 1rem; right: 1rem; z-index: 10; font-size: 0.75rem; color: #8a96a3; font-weight: 500;">
                Yesterday
              </div>
              
              <!-- Top Section: Avatar, Name, Username -->
              <div style="padding: 1rem; display: flex; align-items: flex-start; gap: 0.75rem; flex-shrink: 0;">
                <!-- Circular Avatar -->
                <img
                  :src="model.photoUrl || 'https://via.placeholder.com/48'"
                  :alt="`${model.name} ${model.surname}`"
                  style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; flex-shrink: 0;"
                />
                
                <!-- Name and Username -->
                <div style="flex: 1; min-width: 0;">
                  <h5 style="margin: 0; font-size: 1.125rem; font-weight: 700; color: #1a1a1a; line-height: 1.3; margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.5rem;">
                    {{ model.name }} {{ model.surname }}
                    <svg class="m-verified g-icon" data-icon-name="icon-verified" aria-hidden="true" style="width: 18px; height: 18px; flex-shrink: 0;">
                      <use href="#icon-verified" xlink:href="#icon-verified"></use>
                    </svg>
                  </h5>
                  <p style="margin: 0; font-size: 0.875rem; font-weight: 500; color: #8a96a3; line-height: 1.3;">
                    @{{ (model.name + model.surname).toLowerCase().replace(/\s+/g, '') }}
                  </p>
                </div>
              </div>
              
              <!-- Bio Section -->
              <div style="padding: 0 1rem 0.75rem 1rem; flex-shrink: 0;">
                <p 
                  style="
                    margin: 0; 
                    font-size: 0.9375rem; 
                    line-height: 1.6; 
                    color: #2c3e50; 
                    font-weight: 400;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    min-height: 4.5rem;
                    max-height: 4.5rem;
                  "
                >
                  {{ model.bio || 'No bio available' }}
                </p>
                <button
                  v-if="model.bio && model.bio.length > 100"
                  @click.stop="viewModel(model.id)"
                  style="
                    margin-top: 0.5rem;
                    background: none;
                    border: none;
                    color: #00aff0;
                    font-size: 0.875rem;
                    font-weight: 600;
                    padding: 0;
                    cursor: pointer;
                    text-decoration: none;
                    transition: color 0.2s ease;
                  "
                  @mouseenter="e => e.target.style.color = '#0091ea'"
                  @mouseleave="e => e.target.style.color = '#00aff0'"
                >
                  ...read more
                </button>
              </div>
              
              <!-- Pricing Section -->
              <div style="padding: 0 1rem 1rem 1rem; margin-top: auto; flex-shrink: 0;">
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;">
                  <div style="flex: 1;">
                    <small style="font-size: 0.8125rem; color: #8a96a3; font-weight: 500; display: block; margin-bottom: 0.25rem;">
                      {{ model.plans.length }} {{ model.plans.length === 1 ? 'plan' : 'plans' }} available
                    </small>
                    <p style="margin: 0; font-size: 1.125rem; font-weight: 700; color: #00aff0;">
                      From ${{ model.plans && model.plans.length > 0 ? Math.min(...model.plans.map(p => p.price)) : '0' }}/month
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Main Photo/Media - Full width at bottom, corner to corner -->
              <div style="width: 100%; padding: 0; margin-top: auto; flex-shrink: 0;">
                <div class="model-image-container" style="width: 100%; height: 250px; overflow: hidden; background-color: #f0f0f0; position: relative; border-radius: 0 0 6px 6px;">
                  <img
                    :src="model.photoUrl || 'https://via.placeholder.com/400x400'"
                    :alt="`${model.name} ${model.surname}`"
                    class="model-card-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loading && firstThreeModels.length === 0" class="row">
        <div class="col-12 text-center py-5">
          <i class="fas fa-users fa-3x text-muted mb-3"></i>
          <h4 class="text-muted">No models available yet</h4>
          <p class="text-muted">Check back later for new models!</p>
        </div>
      </div>
    </div>

    <!-- Press inquiries Section -->
    <section 
      class="press-section" 
      style="
        position: relative;
        background: linear-gradient(90deg, #00aff0 80%, #b6edfd 80%, #b6edfd 100%);
        padding: 6rem 0;
        display: flex;
        align-items: center;
        margin-top: 6rem;
        z-index: 1;
      "
    >
      <div class="container" style="position: relative; z-index: 2;">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10">
            <!-- Image above heading -->
            <div class="mb-4">
              <img src="/press.png" alt="Press inquiries icon" style="width: 52px; height: auto; object-fit: contain;" />
            </div>
            
            <h2 
              class="section-title" 
              style="
                color: #ffffff; 
                font-size: 16px; 
                font-weight: 700; 
                margin-bottom: 2rem; 
                text-decoration: underline; 
                text-decoration-color: #ffffff; 
                text-decoration-thickness: 5px; 
                text-underline-offset: 15px;
                line-height: 1.2;
              "
            >
              Press inquiries
            </h2>
            <p class="press-text" style="color: #000; font-weight: 500; max-width: 950px;">
              Please contact media@silkfans.com with questions and a member of our team will review your inquiry.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Section -->
    <footer 
      class="footer-section" 
      style="
        background-color: #ffffff;
        padding: 4rem 0 2rem 0;
        border-top: 1px solid rgba(0, 0, 0, 0.08);
      "
    >
      <div class="container">
        <div class="row mb-4">
          <!-- Brand Section -->
          <div class="col-12 col-lg-4 mb-4 mb-lg-0 footer-brand">
            <div class="footer-logo" style="display: flex; align-items: center; gap: 12px; margin-bottom: 1rem;">
              <img src="/logo.png" alt="SilkFans Logo" style="height: 40px; width: auto; object-fit: contain;" />
              <span style="color: #00aff0; font-weight: 600; font-size: 1.35rem; letter-spacing: 0.3px;">SilkFans</span>
            </div>
          </div>

          <!-- Links Columns -->
          <div class="col-12 col-lg-8">
            <div class="row">
              <!-- Platform Column -->
              <div class="col-6 col-md-3 mb-4">
                <h4 style="color: #1a1a1a; font-size: 0.875rem; font-weight: 700; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.5px;">Platform</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 0.5rem;"><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'discover-creators' } }">Discover Creators</router-link></li>
                  <li style="margin-bottom: 0.5rem;"><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'explore-categories' } }">Explore Categories</router-link></li>
                  <li style="margin-bottom: 0.5rem;"><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'pricing' } }">Pricing</router-link></li>
                  <li style="margin-bottom: 0.5rem;"><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'support' } }">Support</router-link></li>
                </ul>
              </div>

              <!-- Company Column -->
              <div class="col-6 col-md-3 mb-4">
                <h4 style="color: #1a1a1a; font-size: 0.875rem; font-weight: 700; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.5px;">Company</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 0.5rem;"><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'about' } }">About</router-link></li>
                  <li style="margin-bottom: 0.5rem;"><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'blog' } }">Blog</router-link></li>
                  <li style="margin-bottom: 0.5rem;"><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'careers' } }">Careers</router-link></li>
                  <li style="margin-bottom: 0.5rem;"><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'press' } }">Press</router-link></li>
                </ul>
              </div>

              <!-- Safety Column -->
              <div class="col-6 col-md-3 mb-4">
                <h4 style="color: #1a1a1a; font-size: 0.875rem; font-weight: 700; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.5px;">Safety</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 0.5rem;"><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'safety-center' } }">Safety Center</router-link></li>
                  <li style="margin-bottom: 0.5rem;"><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'trust-transparency' } }">Trust & Transparency</router-link></li>
                  <li style="margin-bottom: 0.5rem;"><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'content-guidelines' } }">Content Guidelines</router-link></li>
                  <li style="margin-bottom: 0.5rem;"><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'report-issue' } }">Report Issue</router-link></li>
                </ul>
              </div>

              <!-- Legal Column -->
              <div class="col-6 col-md-3 mb-4">
                <h4 style="color: #1a1a1a; font-size: 0.875rem; font-weight: 700; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.5px;">Legal</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 0.5rem;"><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'terms-of-service' } }">Terms of Service</router-link></li>
                  <li style="margin-bottom: 0.5rem;"><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'privacy-policy' } }">Privacy Policy</router-link></li>
                  <li style="margin-bottom: 0.5rem;"><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'dmca-copyright' } }">DMCA & Copyright</router-link></li>
                  <li style="margin-bottom: 0.5rem;"><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'cookies-settings' } }">Cookies Settings</router-link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Description Section -->
        <div class="row mt-4 pt-4" style="border-top: 1px solid rgba(0, 0, 0, 0.08);">
          <div class="col-12 text-center">
            <p class="footer-description" style="color: #666666; font-size: 0.9375rem; line-height: 1.6; margin: 0; max-width: 100%;">
              Empowering creators worldwide with secure monetization, exclusive communities, and premium content experiences.
            </p>
          </div>
        </div>

        <!-- Copyright Section -->
        <div class="row mt-3">
          <div class="col-12 text-center">
            <p style="color: #8a96a3; font-size: 0.875rem; margin: 0; font-weight: 400;">
              © 2025 SilkFans — All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '../../services/api'

export default {
  name: 'SocialHome',
  data() {
    return {
      models: [],
      loading: true,
      error: null
    }
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
    backgroundStyle() {
      return {
        position: 'relative',
        height: '100vh',
        minHeight: '100vh',
        backgroundImage: `url(${process.env.BASE_URL}background.svg)`,
        backgroundSize: '40%',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '76px',
        paddingBottom: '0'
      }
    },
    // Only show the first 3 models on the home page
    firstThreeModels() {
      return this.models.slice(0, 3)
    }
  },
  async mounted() {
    await this.fetchModels()
  },
  methods: {
    async fetchModels(retryCount = 0) {
      try {
        this.loading = true
        this.error = null
        
        console.log('Fetching models from API...')
        const response = await api.get('/social/models', {
          timeout: 10000
        })
        
        console.log('API response:', response.data)
        
        if (response.data.success) {
          this.models = response.data.models || []
          console.log(`Loaded ${this.models.length} models`)
        } else {
          throw new Error(response.data.message || 'Failed to fetch models')
        }
        
        // If no models, show empty state
        if (this.models.length === 0) {
          console.log('No models available')
        }
      } catch (error) {
        console.error('Error fetching models:', error)
        
        // Retry logic for network errors
        if (retryCount < 3 && (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error') || !error.response)) {
          console.log(`Retrying fetch models (attempt ${retryCount + 1})`)
          setTimeout(() => {
            this.fetchModels(retryCount + 1)
          }, 1000 * (retryCount + 1)) // Exponential backoff
          return
        }
        
        this.error = error.response?.data?.message || 'Failed to load models. Please check your connection and try again.'
        this.models = []
      } finally {
        this.loading = false
      }
    },
    
    viewModel(modelId) {
      this.$router.push(`/model/${modelId}`)
    },
    
    handleCardHover(event) {
      const card = event.currentTarget
      card.style.transform = 'translateY(-12px) scale(1.02)'
      card.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.2)'
    },
    
    handleCardLeave(event) {
      const card = event.currentTarget
      card.style.transform = 'translateY(0) scale(1)'
      card.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)'
    }
  }
}
</script>

<style scoped>
.model-card-wrapper {
  position: relative;
}

.model-card {
  position: relative;
  z-index: 1;
}

.model-card::after {
  content: '';
  position: absolute;
  bottom: -2rem;
  left: 0;
  right: 0;
  height: 2rem;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), transparent);
  pointer-events: none;
  z-index: 0;
}

/* Ensure all cards have the same height */
.row .col-lg-4,
.row .col-md-6 {
  display: flex;
}

.model-card-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Make cards hang out/overflow downward */
.our-creators-section {
  overflow: visible !important;
  position: relative;
  min-height: auto;
}

.container-fluid.models-grid-container {
  overflow: visible !important;
  position: relative;
  z-index: 10;
  padding-bottom: 0 !important;
}

.model-card-col {
  position: relative;
  z-index: 20;
  margin-top: 0;
  margin-bottom: 4rem;
}

.model-card {
  margin-bottom: 0;
}

/* Ensure consistent card heights */
.model-card {
  height: 418px !important;
  min-height: 418px !important;
  max-height: 418px !important;
  display: flex;
  flex-direction: column;
}

/* Make cards hang out from the blue section */
.model-card-wrapper {
  position: relative;
  margin-bottom: 0;
}

.model-card {
  position: relative;
  z-index: 20;
  transform-origin: top center;
}

/* Bio text truncation */
.bio-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Model card image styling - ensures full image is visible */
.model-image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.model-card-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  display: block;
  margin: 0 auto;
}

/* Responsive text for who we are section */
.who-we-are-text {
  font-size: 45px;
  line-height: 50px;
}

@media (max-width: 992px) {
  .who-we-are-text {
    font-size: 36px;
    line-height: 42px;
  }
}

@media (max-width: 768px) {
  .who-we-are-text {
    font-size: 28px;
    line-height: 34px;
  }
}

@media (max-width: 576px) {
  .who-we-are-text {
    font-size: 22px;
    line-height: 28px;
  }
}

/* Responsive text for mission section */
.mission-text {
  font-size: 45px;
  line-height: 50px;
}

@media (max-width: 992px) {
  .mission-text {
    font-size: 36px;
    line-height: 42px;
  }
}

@media (max-width: 768px) {
  .mission-text {
    font-size: 28px;
    line-height: 34px;
  }
}

@media (max-width: 576px) {
  .mission-text {
    font-size: 22px;
    line-height: 28px;
  }
}

/* Responsive text for safety section */
.safety-text {
  font-size: 45px;
  line-height: 50px;
}

@media (max-width: 992px) {
  .safety-text {
    font-size: 36px;
    line-height: 42px;
  }
}

@media (max-width: 768px) {
  .safety-text {
    font-size: 28px;
    line-height: 34px;
  }
}

@media (max-width: 576px) {
  .safety-text {
    font-size: 22px;
    line-height: 28px;
  }
}

/* Responsive text for creators section */
.creators-text {
  font-size: 45px;
  line-height: 50px;
}

@media (max-width: 992px) {
  .creators-text {
    font-size: 36px;
    line-height: 42px;
  }
}

@media (max-width: 768px) {
  .creators-text {
    font-size: 28px;
    line-height: 34px;
  }
}

@media (max-width: 576px) {
  .creators-text {
    font-size: 22px;
    line-height: 28px;
  }
}

/* Responsive text for press section */
.press-text {
  font-size: 45px;
  line-height: 50px;
}

@media (max-width: 992px) {
  .press-text {
    font-size: 36px;
    line-height: 42px;
  }
}

@media (max-width: 768px) {
  .press-text {
    font-size: 28px;
    line-height: 34px;
  }
}

@media (max-width: 576px) {
  .press-text {
    font-size: 22px;
    line-height: 28px;
  }
}

/* Footer responsive styles */
.footer-brand {
  margin-bottom: 2rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1rem;
}

.footer-logo img {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.footer-logo span {
  color: #00aff0;
  font-weight: 600;
  font-size: 1.35rem;
  letter-spacing: 0.3px;
}

.footer-description {
  color: #666666;
  font-size: 0.9375rem;
  line-height: 1.6;
  margin: 0;
  max-width: 100%;
}

.footer-link {
  color: #666666;
  text-decoration: none;
  font-size: 0.9375rem;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #00aff0 !important;
}

@media (max-width: 992px) {
  .footer-brand {
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .footer-logo {
    justify-content: center;
  }
  
  .footer-description {
    max-width: 100%;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .footer-logo img {
    height: 35px;
  }
  
  .footer-logo span {
    font-size: 1.2rem;
  }
  
  .footer-description {
    font-size: 0.875rem;
  }
}

@media (max-width: 576px) {
  .footer-logo {
    gap: 10px;
  }
  
  .footer-logo img {
    height: 32px;
  }
  
  .footer-logo span {
    font-size: 1.1rem;
  }
  
  .footer-description {
    font-size: 0.8125rem;
  }
}
</style>
