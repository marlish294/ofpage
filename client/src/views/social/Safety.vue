<template>
  <div style="background-color: #ffffff; min-height: 100vh;">
    <!-- Navbar is included via the layout -->
    
    <!-- Header Section -->
    <section 
      style="
        background-color: #00aff0;
        padding: 6rem 0;
        margin-top: 0;
      "
    >
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 text-center">
            <h1 class="safety-header" style="color: #ffffff; font-size: 64px; font-weight: 700; margin: 0;">
              Safety & Transparency Center
            </h1>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Main Content -->
    <div class="container" style="padding-top: 6rem; padding-bottom: 4rem;">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-10">
          <!-- Main Content Paragraphs -->
          <section style="margin-bottom: 4rem;">
            <p class="safety-content-text" style="color: #000; font-weight: 500; max-width: 950px; margin-bottom: 2rem;">
              <span style="color: #00aff0;">SilkFans</span> empowers creators from all genres to own their potential. We are committed to building the safest digital media platform in the world. <span style="color: #00aff0;">SilkFans</span> goes above and beyond the legal requirements, and our peers, to provide a safe platform for Creator and Fans while maximizing the freedom of Creators and Fans to control and monetize the lawful content they produce and view.
            </p>
            
            <p class="safety-content-text" style="color: #000; font-weight: 500; max-width: 950px;">
              This Safety & Transparency Center is designed to give Creators, Fans and other stakeholders visibility into how <span style="color: #00aff0;">SilkFans</span> keeps our community safe and provide an overview of some of our key safety and transparency measures. These guides below are summaries and should be read alongside our Terms of Service, Acceptable Use Policy and Community Guidelines.
            </p>
          </section>

          <!-- Topics List -->
          <section>
            <ul class="safety-topics-list" style="list-style: none; padding: 0; margin: 0;">
              <li class="safety-topic-item">
                <router-link class="safety-topic-link" :to="{ name: 'InfoPage', params: { slug: 'age-identity-verification' } }">
                  Age & Identity Verification
                </router-link>
              </li>
              <li class="safety-topic-item">
                <router-link class="safety-topic-link" :to="{ name: 'InfoPage', params: { slug: 'appeals-policy' } }">
                  Appeals policy
                </router-link>
              </li>
              <li class="safety-topic-item">
                <router-link class="safety-topic-link" :to="{ name: 'InfoPage', params: { slug: 'assisting-law-enforcement' } }">
                  Assisting Law Enforcement
                </router-link>
              </li>
              <li class="safety-topic-item">
                <router-link class="safety-topic-link" :to="{ name: 'InfoPage', params: { slug: 'combatting-csam' } }">
                  Combatting CSAM
                </router-link>
              </li>
              <li class="safety-topic-item">
                <router-link class="safety-topic-link" :to="{ name: 'InfoPage', params: { slug: 'content-moderation-policy' } }">
                  Content moderation policy
                </router-link>
              </li>
              <li class="safety-topic-item">
                <router-link class="safety-topic-link" :to="{ name: 'InfoPage', params: { slug: 'ensuring-consent-intimate-images' } }">
                  Ensuring Consent for Intimate Images
                </router-link>
              </li>
              <li class="safety-topic-item">
                <router-link class="safety-topic-link" :to="{ name: 'InfoPage', params: { slug: 'dsa-transparency-report' } }">
                  EU Digital Services Act Transparency Report
                </router-link>
              </li>
              <li class="safety-topic-item">
                <router-link class="safety-topic-link" :to="{ name: 'InfoPage', params: { slug: 'protect-copyright' } }">
                  Helping Creators Protect their Copyright
                </router-link>
              </li>
              <li class="safety-topic-item">
                <router-link class="safety-topic-link" :to="{ name: 'InfoPage', params: { slug: 'mission-vision-values' } }">
                  <span style="color: inherit;">SilkFans</span> Mission, Vision and Values
                </router-link>
              </li>
              <li class="safety-topic-item">
                <router-link class="safety-topic-link" :to="{ name: 'InfoPage', params: { slug: 'monthly-transparency-reports' } }">
                  <span style="color: inherit;">SilkFans</span> Monthly Transparency Reports
                </router-link>
              </li>
              <li class="safety-topic-item">
                <router-link class="safety-topic-link" :to="{ name: 'InfoPage', params: { slug: 'commitment-safety-transparency' } }">
                  <span style="color: inherit;">SilkFans</span> Commitment Safety & Transparency
                </router-link>
              </li>
              <li class="safety-topic-item">
                <router-link class="safety-topic-link" :to="{ name: 'InfoPage', params: { slug: 'preventing-modern-slavery' } }">
                  Preventing Modern Slavery & Human Trafficking
                </router-link>
              </li>
              <li class="safety-topic-item">
                <router-link class="safety-topic-link" :to="{ name: 'InfoPage', params: { slug: 'respecting-your-privacy' } }">
                  Respecting Your Privacy
                </router-link>
              </li>
              <li class="safety-topic-item">
                <router-link class="safety-topic-link" :to="{ name: 'InfoPage', params: { slug: 'money-laundering-fraud' } }">
                  Safeguarding Against Money Laundering & Fraud
                </router-link>
              </li>
              <li class="safety-topic-item">
                <router-link class="safety-topic-link" :to="{ name: 'InfoPage', params: { slug: 'tackling-hate-speech' } }">
                  Tackling Hate Speech
                </router-link>
              </li>
              <li class="safety-topic-item">
                <router-link class="safety-topic-link" :to="{ name: 'InfoPage', params: { slug: 'tax-policy' } }">
                  Tax Policy
                </router-link>
              </li>
              <li class="safety-topic-item" style="border-bottom: none;">
                <router-link class="safety-topic-link" :to="{ name: 'InfoPage', params: { slug: 'tax-strategy' } }">
                  Tax Strategy
                </router-link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>

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
                  <li style="margin-bottom: 0.5rem;">
                    <router-link
                      class="footer-link"
                      :to="{ name: 'InfoPage', params: { slug: 'discover-creators' } }"
                    >
                      Discover Creators
                    </router-link>
                  </li>
                  <li style="margin-bottom: 0.5rem;">
                    <router-link
                      class="footer-link"
                      :to="{ name: 'InfoPage', params: { slug: 'explore-categories' } }"
                    >
                      Explore Categories
                    </router-link>
                  </li>
                  <li style="margin-bottom: 0.5rem;">
                    <router-link
                      class="footer-link"
                      :to="{ name: 'InfoPage', params: { slug: 'pricing' } }"
                    >
                      Pricing
                    </router-link>
                  </li>
                  <li style="margin-bottom: 0.5rem;">
                    <router-link
                      class="footer-link"
                      :to="{ name: 'InfoPage', params: { slug: 'support' } }"
                    >
                      Support
                    </router-link>
                  </li>
                </ul>
              </div>

              <!-- Company Column -->
              <div class="col-6 col-md-3 mb-4">
                <h4 style="color: #1a1a1a; font-size: 0.875rem; font-weight: 700; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.5px;">Company</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 0.5rem;">
                    <router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'about' } }">
                      About
                    </router-link>
                  </li>
                  <li style="margin-bottom: 0.5rem;">
                    <router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'blog' } }">
                      Blog
                    </router-link>
                  </li>
                  <li style="margin-bottom: 0.5rem;">
                    <router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'careers' } }">
                      Careers
                    </router-link>
                  </li>
                  <li style="margin-bottom: 0.5rem;">
                    <router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'press' } }">
                      Press
                    </router-link>
                  </li>
                </ul>
              </div>

              <!-- Safety Column -->
              <div class="col-6 col-md-3 mb-4">
                <h4 style="color: #1a1a1a; font-size: 0.875rem; font-weight: 700; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.5px;">Safety</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 0.5rem;">
                    <router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'safety-center' } }">
                      Safety Center
                    </router-link>
                  </li>
                  <li style="margin-bottom: 0.5rem;">
                    <router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'trust-transparency' } }">
                      Trust & Transparency
                    </router-link>
                  </li>
                  <li style="margin-bottom: 0.5rem;">
                    <router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'content-guidelines' } }">
                      Content Guidelines
                    </router-link>
                  </li>
                  <li style="margin-bottom: 0.5rem;">
                    <router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'report-issue' } }">
                      Report Issue
                    </router-link>
                  </li>
                </ul>
              </div>

              <!-- Legal Column -->
              <div class="col-6 col-md-3 mb-4">
                <h4 style="color: #1a1a1a; font-size: 0.875rem; font-weight: 700; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.5px;">Legal</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 0.5rem;">
                    <router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'terms-of-service' } }">
                      Terms of Service
                    </router-link>
                  </li>
                  <li style="margin-bottom: 0.5rem;">
                    <router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'privacy-policy' } }">
                      Privacy Policy
                    </router-link>
                  </li>
                  <li style="margin-bottom: 0.5rem;">
                    <router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'dmca-copyright' } }">
                      DMCA & Copyright
                    </router-link>
                  </li>
                  <li style="margin-bottom: 0.5rem;">
                    <router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'cookies-settings' } }">
                      Cookies Settings
                    </router-link>
                  </li>
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
export default {
  name: 'Safety'
}
</script>

<style scoped>
/* Header for safety page */
.safety-header {
  font-size: 64px;
  font-weight: 700;
  color: #ffffff;
}

@media (max-width: 992px) {
  .safety-header {
    font-size: 48px;
  }
}

@media (max-width: 768px) {
  .safety-header {
    font-size: 36px;
  }
}

@media (max-width: 576px) {
  .safety-header {
    font-size: 28px;
  }
}

/* Content text for safety page */
.safety-content-text {
  font-size: 16px;
  line-height: 1.6;
}

/* Topics list styling */
.safety-topics-list {
  margin-top: 2rem;
}

.safety-topic-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.safety-topic-item:last-child {
  border-bottom: none;
}

.safety-topic-link {
  color: #00aff0;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  display: block;
  padding: 0.75rem 0;
  transition: color 0.2s ease;
}

.safety-topic-link:hover {
  color: #0099d6;
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

