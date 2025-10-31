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
            <p style="color: #000; font-size: 45px; line-height: 50px; font-weight: 500; max-width: 950px;">
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
              <img src="/ofphoto.png" alt="Mission icon" style="height: 50px; width: auto; object-fit: contain;" />
              <img src="/ofphoto2.png" alt="Vision icon" style="height: 50px; width: auto; object-fit: contain;" />
              <img src="/ofphoto3.png" alt="Values icon" style="height: 50px; width: auto; object-fit: contain;" />
              <img src="/ofphoto4.png" alt="Community icon" style="height: 50px; width: auto; object-fit: contain;" />
              <img src="/ofphoto5.png" alt="Platform icon" style="height: 50px; width: auto; object-fit: contain;" />
            </div>
            
            <p style="color: #000; font-size: 45px; line-height: 50px; font-weight: 500; max-width: 950px; margin-top: 2rem;">
              As a creator-first platform, our community is at the heart of everything we do.
            </p>
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
              <img src="/ourreq.png" alt="Safety approach icon" style="height: 60px; width: auto; object-fit: contain;" />
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
            <p style="color: #000; font-size: 45px; line-height: 50px; font-weight: 500; max-width: 950px; text-align: right;">
              We are committed to building the safest social media platform in the world.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Our creators Section -->
    <section 
      class="our-creators-section" 
      style="
        position: relative;
        background: linear-gradient(180deg, #b6edfd 30%, #00aff0 70%);
        padding: 6rem 0 3rem 0;
        margin-top: 4rem;
      "
    >
      <div class="container" style="position: relative; z-index: 2;">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 d-flex flex-column align-items-end">
            <!-- Image above heading -->
            <div class="mb-4" style="text-align: right;">
              <img src="/ourcreators.png" alt="Our creators icon" style="height: 60px; width: auto; object-fit: contain;" />
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
            <p style="color: #000; font-size: 45px; line-height: 50px; font-weight: 500; max-width: 950px; margin-bottom: 3rem; text-align: right;">
              We provide an inclusive, welcoming platform for a diverse range of content creators. Discover more at of.tv.
            </p>
          </div>
        </div>
      </div>
      
      <!-- Models Grid inside Our creators section -->
      <div class="container-fluid" style="padding-top: 2rem; padding-bottom: 4rem;">
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

    <div v-else class="row">
      <div
        v-for="model in models"
        :key="model.id"
        class="col-lg-4 col-md-6 mb-4"
      >
        <div class="card model-card h-100" @click="viewModel(model.id)" style="background-color: #ffffff; border: none; border-radius: 16px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); overflow: hidden; transition: all 0.2s ease;">
          <!-- Top Section: Avatar, Name, Username -->
          <div style="padding: 1.25rem; display: flex; align-items: flex-start; gap: 0.75rem;">
            <!-- Circular Avatar -->
            <img
              :src="model.photoUrl || 'https://via.placeholder.com/48'"
              :alt="`${model.name} ${model.surname}`"
              style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; flex-shrink: 0;"
            />
            
            <!-- Name and Username -->
            <div style="flex: 1; min-width: 0;">
              <h5 style="margin: 0; font-size: 1.125rem; font-weight: 700; color: #1a1a1a; line-height: 1.3; margin-bottom: 0.25rem;">
                {{ model.name }} {{ model.surname }}
              </h5>
              <p style="margin: 0; font-size: 0.875rem; font-weight: 500; color: #8a96a3; line-height: 1.3;">
                @{{ (model.name + model.surname).toLowerCase().replace(/\s+/g, '') }}
              </p>
            </div>
          </div>
          
          <!-- Bio Section -->
          <div style="padding: 0 1.25rem 1rem 1.25rem;">
            <p style="margin: 0; font-size: 0.9375rem; line-height: 1.6; color: #2c3e50; font-weight: 400;">
              {{ model.bio || 'No bio available' }}
            </p>
          </div>
          
          <!-- Main Photo/Media -->
          <div style="width: 100%; padding: 0 1.25rem 1rem 1.25rem;">
            <div style="width: 100%; height: 280px; border-radius: 12px; overflow: hidden; background-color: #f0f0f0; position: relative; display: flex; align-items: center; justify-content: center;">
              <img
                :src="model.photoUrl || 'https://via.placeholder.com/400x400'"
                :alt="`${model.name} ${model.surname}`"
                style="max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; object-position: center; display: block;"
              />
            </div>
          </div>
          
          <!-- Pricing Section -->
          <div style="padding: 0 1.25rem 1.25rem 1.25rem;">
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
        </div>
      </div>
    </div>

    <div v-if="!loading && models.length === 0" class="row">
      <div class="col-12 text-center py-5">
        <i class="fas fa-users fa-3x text-muted mb-3"></i>
        <h4 class="text-muted">No models available yet</h4>
        <p class="text-muted">Check back later for new models!</p>
      </div>
    </div>
      </div>
    </section>

    <!-- Press inquiries Section -->
    <section 
      class="press-section" 
      style="
        position: relative;
        background: linear-gradient(90deg, #00aff0 80%, #b6edfd 80%, #b6edfd 100%);
        padding: 6rem 0;
        display: flex;
        align-items: center;
        margin-top: 4rem;
      "
    >
      <div class="container" style="position: relative; z-index: 2;">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10">
            <!-- Image above heading -->
            <div class="mb-4">
              <img src="/press.png" alt="Press inquiries icon" style="height: 60px; width: auto; object-fit: contain;" />
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
            <p style="color: #000; font-size: 45px; line-height: 50px; font-weight: 500; max-width: 950px;">
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
          <div class="col-12 col-lg-4 mb-4 mb-lg-0">
            <h3 style="color: #1a1a1a; font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">SilkFans</h3>
            <p style="color: #666666; font-size: 0.9375rem; line-height: 1.6; margin: 0; max-width: 300px;">
              Empowering creators worldwide with secure monetization, exclusive communities, and premium content experiences.
            </p>
          </div>

          <!-- Links Columns -->
          <div class="col-12 col-lg-8">
            <div class="row">
              <!-- Platform Column -->
              <div class="col-6 col-md-3 mb-4">
                <h4 style="color: #1a1a1a; font-size: 0.875rem; font-weight: 700; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.5px;">Platform</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 0.5rem;"><a href="#" style="color: #666666; text-decoration: none; font-size: 0.9375rem; transition: color 0.2s ease;" onmouseover="this.style.color='#00aff0'" onmouseout="this.style.color='#666666'">Discover Creators</a></li>
                  <li style="margin-bottom: 0.5rem;"><a href="#" style="color: #666666; text-decoration: none; font-size: 0.9375rem; transition: color 0.2s ease;" onmouseover="this.style.color='#00aff0'" onmouseout="this.style.color='#666666'">Explore Categories</a></li>
                  <li style="margin-bottom: 0.5rem;"><a href="#" style="color: #666666; text-decoration: none; font-size: 0.9375rem; transition: color 0.2s ease;" onmouseover="this.style.color='#00aff0'" onmouseout="this.style.color='#666666'">Pricing</a></li>
                  <li style="margin-bottom: 0.5rem;"><a href="#" style="color: #666666; text-decoration: none; font-size: 0.9375rem; transition: color 0.2s ease;" onmouseover="this.style.color='#00aff0'" onmouseout="this.style.color='#666666'">Support</a></li>
                </ul>
              </div>

              <!-- Company Column -->
              <div class="col-6 col-md-3 mb-4">
                <h4 style="color: #1a1a1a; font-size: 0.875rem; font-weight: 700; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.5px;">Company</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 0.5rem;"><a href="#" style="color: #666666; text-decoration: none; font-size: 0.9375rem; transition: color 0.2s ease;" onmouseover="this.style.color='#00aff0'" onmouseout="this.style.color='#666666'">About</a></li>
                  <li style="margin-bottom: 0.5rem;"><a href="#" style="color: #666666; text-decoration: none; font-size: 0.9375rem; transition: color 0.2s ease;" onmouseover="this.style.color='#00aff0'" onmouseout="this.style.color='#666666'">Blog</a></li>
                  <li style="margin-bottom: 0.5rem;"><a href="#" style="color: #666666; text-decoration: none; font-size: 0.9375rem; transition: color 0.2s ease;" onmouseover="this.style.color='#00aff0'" onmouseout="this.style.color='#666666'">Careers</a></li>
                  <li style="margin-bottom: 0.5rem;"><a href="#" style="color: #666666; text-decoration: none; font-size: 0.9375rem; transition: color 0.2s ease;" onmouseover="this.style.color='#00aff0'" onmouseout="this.style.color='#666666'">Press</a></li>
                </ul>
              </div>

              <!-- Safety Column -->
              <div class="col-6 col-md-3 mb-4">
                <h4 style="color: #1a1a1a; font-size: 0.875rem; font-weight: 700; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.5px;">Safety</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 0.5rem;"><a href="#" style="color: #666666; text-decoration: none; font-size: 0.9375rem; transition: color 0.2s ease;" onmouseover="this.style.color='#00aff0'" onmouseout="this.style.color='#666666'">Safety Center</a></li>
                  <li style="margin-bottom: 0.5rem;"><a href="#" style="color: #666666; text-decoration: none; font-size: 0.9375rem; transition: color 0.2s ease;" onmouseover="this.style.color='#00aff0'" onmouseout="this.style.color='#666666'">Trust & Transparency</a></li>
                  <li style="margin-bottom: 0.5rem;"><a href="#" style="color: #666666; text-decoration: none; font-size: 0.9375rem; transition: color 0.2s ease;" onmouseover="this.style.color='#00aff0'" onmouseout="this.style.color='#666666'">Content Guidelines</a></li>
                  <li style="margin-bottom: 0.5rem;"><a href="#" style="color: #666666; text-decoration: none; font-size: 0.9375rem; transition: color 0.2s ease;" onmouseover="this.style.color='#00aff0'" onmouseout="this.style.color='#666666'">Report Issue</a></li>
                </ul>
              </div>

              <!-- Legal Column -->
              <div class="col-6 col-md-3 mb-4">
                <h4 style="color: #1a1a1a; font-size: 0.875rem; font-weight: 700; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.5px;">Legal</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 0.5rem;"><a href="#" style="color: #666666; text-decoration: none; font-size: 0.9375rem; transition: color 0.2s ease;" onmouseover="this.style.color='#00aff0'" onmouseout="this.style.color='#666666'">Terms of Service</a></li>
                  <li style="margin-bottom: 0.5rem;"><a href="#" style="color: #666666; text-decoration: none; font-size: 0.9375rem; transition: color 0.2s ease;" onmouseover="this.style.color='#00aff0'" onmouseout="this.style.color='#666666'">Privacy Policy</a></li>
                  <li style="margin-bottom: 0.5rem;"><a href="#" style="color: #666666; text-decoration: none; font-size: 0.9375rem; transition: color 0.2s ease;" onmouseover="this.style.color='#00aff0'" onmouseout="this.style.color='#666666'">DMCA & Copyright</a></li>
                  <li style="margin-bottom: 0.5rem;"><a href="#" style="color: #666666; text-decoration: none; font-size: 0.9375rem; transition: color 0.2s ease;" onmouseover="this.style.color='#00aff0'" onmouseout="this.style.color='#666666'">Cookies Settings</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Copyright Section -->
        <div class="row mt-4 pt-4" style="border-top: 1px solid rgba(0, 0, 0, 0.08);">
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
    }
  }
}
</script>
