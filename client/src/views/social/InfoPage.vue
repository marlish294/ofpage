<template>
  <div class="info-page">
    <section class="hero" :style="{ background: currentPage?.heroGradient || defaultGradient }">
      <div class="container py-5">
        <div class="row justify-content-center text-center">
          <div class="col-12 col-lg-10">
            <span class="hero-label">{{ currentPage?.category || 'SilkFans' }}</span>
            <h1 class="hero-title">{{ currentPage?.heroTitle || 'Insight Hub' }}</h1>
            <p class="hero-subtitle" v-if="currentPage?.heroSubtitle">
              {{ currentPage.heroSubtitle }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section v-if="currentPage" class="content">
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10">
            <div class="intro-card shadow-sm">
              <p class="intro-text">
                {{ currentPage.intro }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="currentPage.highlights?.length" class="row mt-4 g-4 justify-content-center">
          <div
            v-for="highlight in currentPage.highlights"
            :key="highlight.title"
            class="col-12 col-md-6 col-lg-4"
          >
            <div class="highlight-card">
              <div class="badge-icon">
                <i :class="highlight.icon || defaultHighlightIcon"></i>
              </div>
              <h3>{{ highlight.title }}</h3>
              <p>{{ highlight.description }}</p>
            </div>
          </div>
        </div>

        <div
          v-for="section in currentPage.sections || []"
          :key="section.heading"
          class="section-card mt-5"
        >
          <h2>{{ section.heading }}</h2>
          <p>{{ section.description }}</p>
          <ul v-if="section.bullets?.length" class="section-list">
            <li v-for="bullet in section.bullets" :key="bullet">
              <i class="fas fa-check-circle text-primary me-2"></i>
              {{ bullet }}
            </li>
          </ul>
        </div>

        <div
          v-if="currentPage.resources?.length"
          class="resources-card mt-5"
        >
          <h2>Additional Resources</h2>
          <div class="row g-4">
            <div
              v-for="resource in currentPage.resources"
              :key="resource.title"
              class="col-12 col-md-6"
            >
              <div class="resource-item">
                <h3>{{ resource.title }}</h3>
                <p>{{ resource.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="currentPage.cta"
          class="cta-card mt-5 text-center shadow-sm"
        >
          <h2>{{ currentPage.cta.title }}</h2>
          <p>{{ currentPage.cta.description }}</p>
          <router-link
            v-if="currentPage.cta.buttonText"
            :to="currentPage.cta.buttonTo || '/register'"
            class="btn btn-primary px-4 py-3"
          >
            {{ currentPage.cta.buttonText }}
          </router-link>
        </div>
      </div>
    </section>

    <section v-else class="content">
      <div class="container py-5">
        <div class="row justify-content-center text-center">
          <div class="col-12 col-lg-8">
            <div class="missing-card shadow-sm">
              <i class="fas fa-compass mb-3 text-primary" style="font-size: 2.5rem;"></i>
              <h2>We're updating this space</h2>
              <p class="mb-4">
                The topic you're looking for isn't available yet. Check back soon or explore another guide.
              </p>
              <router-link to="/" class="btn btn-outline-primary px-4 py-2">
                Return Home
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="info-footer">
      <div class="container py-5">
        <div class="row mb-4">
          <div class="col-12 col-lg-4 mb-4 mb-lg-0 footer-brand">
            <div class="footer-logo">
              <img src="/logo.png" alt="SilkFans Logo" />
              <span>SilkFans</span>
            </div>
            <p class="footer-description">
              Empowering creators worldwide with secure monetization, exclusive communities, and premium content experiences.
            </p>
          </div>

          <div class="col-12 col-lg-8">
            <div class="row">
              <div class="col-6 col-md-3 mb-4">
                <h4>Platform</h4>
                <ul class="footer-list">
                  <li><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'discover-creators' } }">Discover Creators</router-link></li>
                  <li><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'explore-categories' } }">Explore Categories</router-link></li>
                  <li><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'pricing' } }">Pricing</router-link></li>
                  <li><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'support' } }">Support</router-link></li>
                </ul>
              </div>

              <div class="col-6 col-md-3 mb-4">
                <h4>Company</h4>
                <ul class="footer-list">
                  <li><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'about' } }">About</router-link></li>
                  <li><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'blog' } }">Blog</router-link></li>
                  <li><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'careers' } }">Careers</router-link></li>
                  <li><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'press' } }">Press</router-link></li>
                </ul>
              </div>

              <div class="col-6 col-md-3 mb-4">
                <h4>Safety</h4>
                <ul class="footer-list">
                  <li><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'safety-center' } }">Safety Center</router-link></li>
                  <li><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'trust-transparency' } }">Trust & Transparency</router-link></li>
                  <li><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'content-guidelines' } }">Content Guidelines</router-link></li>
                  <li><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'report-issue' } }">Report Issue</router-link></li>
                </ul>
              </div>

              <div class="col-6 col-md-3 mb-4">
                <h4>Legal</h4>
                <ul class="footer-list">
                  <li><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'terms-of-service' } }">Terms of Service</router-link></li>
                  <li><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'privacy-policy' } }">Privacy Policy</router-link></li>
                  <li><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'dmca-copyright' } }">DMCA & Copyright</router-link></li>
                  <li><router-link class="footer-link" :to="{ name: 'InfoPage', params: { slug: 'cookies-settings' } }">Cookies Settings</router-link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="row border-top pt-4 mt-3">
          <div class="col-12 text-center">
            <p class="footer-note">© {{ new Date().getFullYear() }} SilkFans — All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
const defaultGradient = 'linear-gradient(135deg, #00aff0 0%, #00c6ff 100%)'
const defaultHighlightIcon = 'fas fa-star'

const pages = {
  platform: {
    category: 'Platform',
    heroTitle: 'The SilkFans Platform',
    heroSubtitle: 'A creator-first ecosystem for premium experiences.',
    intro: 'SilkFans combines community, monetization, and safety into a single platform that lets creators focus on what they love. Our infrastructure is built to scale with your ambitions—from the first subscriber to global fandoms.',
    highlights: [
      {
        title: 'Creator Economy Ready',
        description: 'Subscription tiers, pay-per-view unlocks, and automated revenue splits designed for flexibility.',
        icon: 'fas fa-layer-group'
      },
      {
        title: 'Engagement Tools',
        description: 'Live messaging, exclusive drops, and fan segmentation keep your community energized.',
        icon: 'fas fa-bolt'
      },
      {
        title: 'Enterprise Grade Safety',
        description: 'Identity verification, compliance workflows, and transparent reporting keep everyone protected.',
        icon: 'fas fa-shield-alt'
      }
    ],
    sections: [
      {
        heading: 'Built For Modern Creators',
        description: 'Control your storefront, pricing, and brand narrative with intuitive tools and data-rich dashboards.',
        bullets: [
          'Customizable subscription plans with promotional codes',
          'Native media hosting optimized for HD content delivery',
          'Insights that surface top fans, churn indicators, and growth trends'
        ]
      },
      {
        heading: 'Fan-Centric Experiences',
        description: 'Fans get a frictionless onboarding flow, secure payments, and curated content discovery.',
        bullets: [
          'Localized payment acceptance across major regions',
          'Personalized recommendations based on interests and history',
          'Fail-safe billing and graceful grace-period handling'
        ]
      }
    ],
    resources: [
      {
        title: 'Platform Roadmap',
        description: 'See what we are shipping next and how to contribute feedback.'
      },
      {
        title: 'Creator Onboarding Playbook',
        description: 'A step-by-step launch guide used by our top-performing creators.'
      }
    ],
    cta: {
      title: 'Launch your SilkFans hub in minutes',
      description: 'Create an account, activate your profile, and welcome your first members with guided setup.',
      buttonText: 'Start Creating'
    },
    heroGradient: 'linear-gradient(135deg, #00aff0 0%, #00d7d0 100%)'
  },
  'discover-creators': {
    category: 'Platform',
    heroTitle: 'Discover Creators',
    heroSubtitle: 'Spotlight on emerging talent and iconic voices.',
    intro: 'SilkFans makes it easy for fans to find creators that match their interests. Our discovery engine blends editorial curation, smart data, and community signals to highlight who\'s making waves.',
    highlights: [
      {
        title: 'Curated Collections',
        description: 'Weekly showcases across genres, themes, and trending formats.',
        icon: 'fas fa-fire'
      },
      {
        title: 'Smart Search',
        description: 'Filter by category, price, live availability, or interaction style.',
        icon: 'fas fa-search'
      },
      {
        title: 'Community Signals',
        description: 'Reviews, fan badges, and engagement streaks help you decide where to subscribe next.',
        icon: 'fas fa-users'
      }
    ],
    sections: [
      {
        heading: 'Browse With Confidence',
        description: 'Every creator is verified and reviewed, so you can explore SilkFans with total peace of mind.',
        bullets: [
          'Detailed profile previews with highlight reels and membership perks',
          'Transparent pricing with currency conversions at checkout',
          'Instant access to welcome bundles after subscribing'
        ]
      },
      {
        heading: 'Follow Your Curiosity',
        description: 'Our recommendation engine mixes machine learning with human curation to surface inspiring creators.',
        bullets: [
          'Save favorites and build custom watchlists',
          'Opt-in alerts for new drops, events, and live sessions',
          'Cross-platform sharing for spotlighted moments'
        ]
      }
    ],
    cta: {
      title: 'Meet your next favorite creator',
      description: 'Create a free fan account and personalize your discovery feed in seconds.',
      buttonText: 'Explore Creators',
      buttonTo: '/models'
    }
  },
  'explore-categories': {
    category: 'Platform',
    heroTitle: 'Explore Categories',
    heroSubtitle: 'Dive into curated collections tailored to every fandom.',
    intro: 'Whether you are into behind-the-scenes artistry, fitness coaching, gaming marathons, or premium lifestyle content, SilkFans has a category built for you.',
    highlights: [
      {
        title: 'Genre Diversity',
        description: 'From education to entertainment, creators tag their expertise for precision discovery.',
        icon: 'fas fa-th-large'
      },
      {
        title: 'Seasonal Spotlights',
        description: 'Limited-run collections celebrate cultural moments and platform-wide events.',
        icon: 'fas fa-calendar-star'
      },
      {
        title: 'Category Champions',
        description: 'Recognizing top creators who deliver unforgettable subscriber experiences.',
        icon: 'fas fa-trophy'
      }
    ],
    sections: [
      {
        heading: 'Curated Journeys',
        description: 'Our editorial team packages themed lineups so you can binge without decision fatigue.',
        bullets: [
          'Weekly "New & Noteworthy" creator playlists',
          'Cross-genre blends that combine fitness, food, art, and more',
          'Fan polls that influence upcoming spotlights'
        ]
      },
      {
        heading: 'Category Filters That Work',
        description: 'Sort by session format (live, recorded, 1:1), language, or monetization style.',
        bullets: [
          'Toggle between free previews and premium-only content',
          'See average response times before joining a community',
          'Compare membership tiers without leaving the page'
        ]
      }
    ],
    cta: {
      title: 'Tailor SilkFans to your interests',
      description: 'Update your fan profile preferences to receive curated category emails each week.',
      buttonText: 'Update Preferences',
      buttonTo: '/login'
    }
  },
  pricing: {
    category: 'Platform',
    heroTitle: 'Pricing & Plans',
    heroSubtitle: 'Flexible monetization that scales with your audience.',
    intro: 'SilkFans keeps pricing transparent for fans and creators alike. Choose from subscriptions, direct unlocks, bundles, and bespoke offers without hidden fees.',
    highlights: [
      {
        title: 'Creator-Friendly Split',
        description: 'Creators keep the majority of their earnings, with instant access to performance insights.',
        icon: 'fas fa-hand-holding-usd'
      },
      {
        title: 'Currency Coverage',
        description: 'We accept major cards, digital wallets, and localized payment methods in 40+ countries.',
        icon: 'fas fa-globe'
      },
      {
        title: 'Predictable Fees',
        description: 'Simple revenue share and flat processing costs—no surprises on payout day.',
        icon: 'fas fa-balance-scale'
      }
    ],
    sections: [
      {
        heading: 'Subscriptions Your Way',
        description: 'Creators set membership pricing and perks, with optional trial periods and gift passes.',
        bullets: [
          'Tier up or down at any time without losing historical analytics',
          'Offer loyalty discounts for long-term fans',
          'Automated renewal reminders and fail-safe retries'
        ]
      },
      {
        heading: 'Pay-Per-View Unlocks',
        description: 'Release premium drops, custom content, or live event replays as standalone purchases.',
        bullets: [
          'Bundles support multiple assets with tiered pricing',
          'Time-limited unlocks create urgency and exclusivity',
          'Detailed revenue breakdown per unlock'
        ]
      }
    ],
    resources: [
      {
        title: 'Pricing Strategy Guide',
        description: 'Best practices from creators who doubled their ARPU in 90 days.'
      },
      {
        title: 'Fee Transparency Statement',
        description: 'Full breakdown of platform and processing fees across regions.'
      }
    ],
    cta: {
      title: 'Design your revenue model today',
      description: 'Log in to experiment with pricing scenarios using our built-in planner.',
      buttonText: 'Open Pricing Planner',
      buttonTo: '/login'
    }
  },
  support: {
    category: 'Platform',
    heroTitle: 'Support & Success',
    heroSubtitle: 'Dedicated help for creators, managers, and fans.',
    intro: 'Our support ecosystem combines proactive education, responsive agents, and community-to-community help so you are never stuck.',
    highlights: [
      {
        title: '24/7 Assistance',
        description: 'Priority queues for urgent issues plus real-time system status updates.',
        icon: 'fas fa-headset'
      },
      {
        title: 'Creator Success Team',
        description: 'Strategic check-ins, launch audits, and campaign consultation for eligible creators.',
        icon: 'fas fa-handshake'
      },
      {
        title: 'Knowledge Library',
        description: 'Hundreds of guides, templates, and video walkthroughs to keep you moving.',
        icon: 'fas fa-book-open'
      }
    ],
    sections: [
      {
        heading: 'Support Channels',
        description: 'Choose the support format that matches your workflow.',
        bullets: [
          'In-dashboard ticketing with guaranteed response times',
          'Live chat for billing, access, and trust & safety escalations',
          'Creator community forums moderated by SilkFans staff'
        ]
      },
      {
        heading: 'Proactive Education',
        description: 'Monthly webinars, office hours, and data deep-dives keep you ahead of platform best practices.',
        bullets: [
          'Launch labs for new creators onboarding to SilkFans',
          'Growth workshops featuring top-performing creators',
          'Compliance briefings for regional regulation updates'
        ]
      }
    ],
    cta: {
      title: 'Need help right now?',
      description: 'Open a ticket or explore the Help Center for step-by-step answers.',
      buttonText: 'Visit Help Center',
      buttonTo: '/login'
    }
  },
  company: {
    category: 'Company',
    heroTitle: 'Inside SilkFans',
    heroSubtitle: 'Building the future of direct-to-fan connections.',
    intro: 'SilkFans is a global team of builders, storytellers, and community advocates who believe creators deserve better tools. We operate remotely-first with regional collaboration hubs.',
    highlights: [
      {
        title: 'Mission Driven',
        description: 'Empower independent creators to build sustainable careers without compromising authenticity.',
        icon: 'fas fa-heart'
      },
      {
        title: 'Global Perspective',
        description: 'Our leadership and advisory network spans entertainment, fintech, and digital safety.',
        icon: 'fas fa-globe-americas'
      },
      {
        title: 'Responsible Growth',
        description: 'We invest heavily in trust & safety, compliance, and equitable creator programs.',
        icon: 'fas fa-leaf'
      }
    ],
    sections: [
      {
        heading: 'Our Story',
        description: 'SilkFans launched with the belief that creators deserve transparent economics and supportive technology.',
        bullets: [
          'Founded by former creators, engineers, and brand strategists',
          'Backed by mission-aligned investors prioritizing long-term sustainability',
          'Committed to reinvesting in safety, accessibility, and community impact'
        ]
      },
      {
        heading: 'Our Principles',
        description: 'Every product decision is guided by creator-first thinking, inclusivity, and accountability.',
        bullets: [
          'Creators own their audience relationships',
          'Fans control their experience and privacy',
          'We publish regular transparency and impact reports'
        ]
      }
    ],
    cta: {
      title: 'Join the SilkFans community',
      description: 'Whether you are a creator, partner, or future teammate—there\'s room at our table.',
      buttonText: 'Explore Careers',
      buttonTo: '/info/careers'
    }
  },
  about: {
    category: 'Company',
    heroTitle: 'About SilkFans',
    heroSubtitle: 'Empowering creators. Delighting fans.',
    intro: 'SilkFans is the go-to platform for creators who want control of their content, data, and revenue. We bridge premium fan experiences with enterprise-level trust & safety.',
    highlights: [
      {
        title: 'Creator Advocacy',
        description: 'We negotiate better payment rails, legal protections, and growth opportunities on behalf of creators.',
        icon: 'fas fa-bullhorn'
      },
      {
        title: 'Community-First',
        description: 'Feedback programs, creator councils, and fan advisory boards shape our roadmap.',
        icon: 'fas fa-comments'
      },
      {
        title: 'Responsible Technology',
        description: 'AI-assisted moderation, accessibility tooling, and privacy-by-design principles are built in.',
        icon: 'fas fa-robot'
      }
    ],
    sections: [
      {
        heading: 'What Sets Us Apart',
        description: 'From flexible monetization to unmatched support, SilkFans helps creators build enduring brands.',
        bullets: [
          'Unified hub for subscriptions, messaging, drops, and analytics',
          'Compliance-ready infrastructure for markets around the world',
          'Programs that celebrate diversity, inclusion, and creator well-being'
        ]
      },
      {
        heading: 'Giving Back',
        description: 'We reinvest into creator education, mental health resources, and community-driven initiatives.',
        bullets: [
          'Creator wellness grants for emerging talent',
          'Partnerships with advocacy organizations protecting digital expression',
          'Environmental commitments to sustainable hosting'
        ]
      }
    ],
    cta: {
      title: 'See how SilkFans supports you',
      description: 'Contact partnerships to learn about launches, collaborations, and community events.',
      buttonText: 'Contact Partnerships',
      buttonTo: '/login'
    }
  },
  blog: {
    category: 'Company',
    heroTitle: 'SilkFans Blog',
    heroSubtitle: 'Thought leadership, creator wins, and platform updates.',
    intro: 'Our blog spotlights product releases, best practices, and stories from creators thriving on SilkFans.',
    highlights: [
      {
        title: 'Creator Spotlight Series',
        description: 'Monthly deep dives into how top creators experiment and grow.',
        icon: 'fas fa-pen-fancy'
      },
      {
        title: 'Product Diaries',
        description: 'Behind-the-scenes looks at features, design decisions, and data learnings.',
        icon: 'fas fa-flask'
      },
      {
        title: 'Industry Intel',
        description: 'Macro trends affecting the creator economy, with actionable takeaways.',
        icon: 'fas fa-lightbulb'
      }
    ],
    sections: [
      {
        heading: 'Subscribe to Stay Informed',
        description: 'Receive curated updates directly in your inbox.',
        bullets: [
          'Creator case studies and playbooks',
          'Upcoming live webinars and events',
          'Trust & safety policy explanations in plain language'
        ]
      },
      {
        heading: 'Pitch Your Story',
        description: 'We celebrate the wins, experiments, and lessons from our community.',
        bullets: [
          'Email editorial@silkfans.com with your story idea',
          'Include metrics, visuals, and key takeaways',
          'We feature creators across every industry and stage'
        ]
      }
    ],
    cta: {
      title: 'Never miss an update',
      description: 'Follow the SilkFans Blog and share your story with the community.',
      buttonText: 'Visit Blog',
      buttonTo: '/login'
    }
  },
  careers: {
    category: 'Company',
    heroTitle: 'Careers at SilkFans',
    heroSubtitle: 'Help us build the world\'s most creator-friendly platform.',
    intro: 'We are a distributed team obsessed with innovation, inclusion, and impact. Join engineers, strategists, and creators solving meaningful problems every day.',
    highlights: [
      {
        title: 'Remote-First Culture',
        description: 'Work from where you thrive, with collaborative hubs for team meetups.',
        icon: 'fas fa-laptop-house'
      },
      {
        title: 'Growth Mindset',
        description: 'Professional development stipends, mentorship circles, and learning credits for every team member.',
        icon: 'fas fa-seedling'
      },
      {
        title: 'Inclusive Benefits',
        description: 'Comprehensive healthcare, generous leave, wellness resources, and flexible schedules.',
        icon: 'fas fa-hands-helping'
      }
    ],
    sections: [
      {
        heading: 'What We Value',
        description: 'Our culture is rooted in trust, transparency, and the courage to build boldly.',
        bullets: [
          'Creator empathy guides our product decisions',
          'We prioritize psychological safety and respectful debate',
          'Impact is measured in creator success stories'
        ]
      },
      {
        heading: 'Hiring Process',
        description: 'We aim to create a hiring experience that is transparent, inclusive, and efficient.',
        bullets: [
          'Structured interviews focused on problem solving and collaboration',
          'Inclusive panels representing multiple disciplines and backgrounds',
          'Timely feedback and clear expectations at every stage'
        ]
      }
    ],
    cta: {
      title: 'Shape the future with us',
      description: 'Browse open roles or join our talent network for upcoming opportunities.',
      buttonText: 'View Roles',
      buttonTo: '/login'
    }
  },
  press: {
    category: 'Company',
    heroTitle: 'Press & Media',
    heroSubtitle: 'Brand assets, press releases, and media contacts.',
    intro: 'Covering SilkFans? Access company stats, executive bios, and high-resolution media packages all in one place.',
    highlights: [
      {
        title: 'Press Kit',
        description: 'Logos, product screenshots, and brand guidelines for accurate storytelling.',
        icon: 'fas fa-folder-open'
      },
      {
        title: 'Media Briefings',
        description: 'Regular updates on product launches, partnerships, and creator milestones.',
        icon: 'fas fa-microphone'
      },
      {
        title: 'Executive Access',
        description: 'Schedule interviews with SilkFans leadership and subject matter experts.',
        icon: 'fas fa-user-tie'
      }
    ],
    sections: [
      {
        heading: 'Press Resources',
        description: 'Stay up-to-date with SilkFans announcements and ecosystem insights.',
        bullets: [
          'Downloadable press kit with approved visuals',
          'Timeline of major product and policy updates',
          'Creator success metrics and market data snapshots'
        ]
      },
      {
        heading: 'Contact Our Team',
        description: 'For press inquiries, please include your publication, deadline, and areas of interest.',
        bullets: [
          'Email press@silkfans.com for interview requests',
          'Access embargoed briefings with proper credentials',
          'Media partnerships and sponsorship opportunities available'
        ]
      }
    ],
    cta: {
      title: 'Request press access',
      description: 'Reach out to our communications team for embargoed releases or feature stories.',
      buttonText: 'Contact Press',
      buttonTo: '/login'
    }
  },
  safety: {
    category: 'Safety',
    heroTitle: 'Safety & Wellbeing',
    heroSubtitle: 'Keeping creators and fans safe is non-negotiable.',
    intro: 'SilkFans invests in robust moderation, proactive detection, and transparent processes. Our safety program protects against abuse while preserving expression.',
    highlights: [
      {
        title: 'Trust & Safety Experts',
        description: 'Global team with backgrounds in policy, law enforcement collaboration, and child protection.',
        icon: 'fas fa-user-shield'
      },
      {
        title: 'Continuous Monitoring',
        description: 'AI-assisted detection, human review, and multi-language support keep communities healthy.',
        icon: 'fas fa-eye'
      },
      {
        title: 'Transparent Policies',
        description: 'Clear standards plus appeals processes ensure accountability for everyone.',
        icon: 'fas fa-scroll'
      }
    ],
    sections: [
      {
        heading: 'Safety Principles',
        description: 'We design product experiences that encourage positive interactions and swift resolution of risks.',
        bullets: [
          'Mandatory verification for creators and managers',
          'Clear escalation paths for sensitive reports',
          'Dedicated response teams for high-priority issues'
        ]
      },
      {
        heading: 'Continuous Improvement',
        description: 'We audit safety operations quarterly and publish transparency insights regularly.',
        bullets: [
          'Independent penetration testing and policy reviews',
          'Collaboration with NGOs and regulatory bodies',
          'Feedback loops with creators and fans'
        ]
      }
    ],
    cta: {
      title: 'Visit the Safety Center',
      description: 'Learn more about reporting tools, education resources, and policy documentation.',
      buttonText: 'Open Safety Center',
      buttonTo: '/info/safety-center'
    }
  },
  'safety-center': {
    category: 'Safety',
    heroTitle: 'Safety Center',
    heroSubtitle: 'Guides, reporting tools, and response timelines in one hub.',
    intro: 'The Safety Center offers practical resources for creators and fans, outlining how we handle reports and protect our community.',
    highlights: [
      {
        title: 'Report Management',
        description: 'Track the status of your reports and see expected response times.',
        icon: 'fas fa-clipboard-check'
      },
      {
        title: 'Education Library',
        description: 'Guides covering consent, privacy, and secure account practices.',
        icon: 'fas fa-book'
      },
      {
        title: 'Emergency Protocols',
        description: 'Immediate contact points for urgent trust & safety escalations.',
        icon: 'fas fa-ambulance'
      }
    ],
    sections: [
      {
        heading: 'How Reporting Works',
        description: 'We built a reporting workflow that is transparent, respectful, and efficient.',
        bullets: [
          'Submit reports directly from content, profiles, or chat',
          'Receive confirmation and a case ID instantly',
          'Dedicated triage teams ensure sensitive reports are prioritized'
        ]
      },
      {
        heading: 'Safety Education',
        description: 'We partner with digital safety experts to publish actionable advice.',
        bullets: [
          'Account security checklists and two-factor best practices',
          'Consent and content usage guidelines',
          'Mental health and wellbeing resources for creators'
        ]
      }
    ],
    cta: {
      title: 'Need immediate assistance?',
      description: 'Visit the reporting dashboard or reach out to safety@silkfans.com for urgent issues.',
      buttonText: 'Open Reporting Dashboard',
      buttonTo: '/login'
    }
  },
  'trust-transparency': {
    category: 'Safety',
    heroTitle: 'Trust & Transparency',
    heroSubtitle: 'Accountability is at the heart of SilkFans.',
    intro: 'We share data about enforcement actions, policy changes, and safety investments so our community understands how decisions are made.',
    highlights: [
      {
        title: 'Monthly Reports',
        description: 'Key metrics covering policy actions, moderation trends, and appeals outcomes.',
        icon: 'fas fa-chart-bar'
      },
      {
        title: 'Independent Audits',
        description: 'Third-party assessments evaluate our compliance and integrity programs.',
        icon: 'fas fa-gavel'
      },
      {
        title: 'Policy Changelog',
        description: 'See what changed, why it changed, and how it impacts you.',
        icon: 'fas fa-file-alt'
      }
    ],
    sections: [
      {
        heading: 'Transparency Reports',
        description: 'We publish high-level statistics and highlight notable policy updates.',
        bullets: [
          'Breakdown of reports received and actions taken',
          'Appeal volumes and reinstatement rates',
          'Emerging risk areas and mitigation steps'
        ]
      },
      {
        heading: 'Governance Oversight',
        description: 'Our advisory councils—composed of creators, fans, and industry leaders—review key safety decisions.',
        bullets: [
          'Quarterly summit to review policy shifts',
          'Public summaries detailing outcomes and next steps',
          'Anonymous feedback channels for community concerns'
        ]
      }
    ],
    cta: {
      title: 'Read the latest transparency brief',
      description: 'Stay informed about platform governance and policy direction.',
      buttonText: 'View Report',
      buttonTo: '/login'
    }
  },
  'content-guidelines': {
    category: 'Safety',
    heroTitle: 'Content Guidelines',
    heroSubtitle: 'Clear standards for a respectful, creative community.',
    intro: 'Our Content Guidelines outline what is allowed on SilkFans, the rationale behind each policy, and how enforcement works.',
    highlights: [
      {
        title: 'Creativity Within Bounds',
        description: 'We celebrate creative freedom while safeguarding against harmful or illegal content.',
        icon: 'fas fa-palette'
      },
      {
        title: 'Plain-Language Rules',
        description: 'Policies structured around real scenarios, not legal jargon.',
        icon: 'fas fa-language'
      },
      {
        title: 'Consistent Enforcement',
        description: 'Tiered responses ranging from warnings to permanent removal, all documented and appealable.',
        icon: 'fas fa-balance-scale-right'
      }
    ],
    sections: [
      {
        heading: 'Guideline Categories',
        description: 'Understand what is prohibited, restricted, or age-gated on SilkFans.',
        bullets: [
          'Prohibited content: illegal activity, non-consensual imagery, exploitative material',
          'Restricted content: mature themes with required disclosures',
          'Sensitive content: allowed with safety labels and audience gating'
        ]
      },
      {
        heading: 'Enforcement Lifecycle',
        description: 'We communicate each enforcement decision along with steps to resolve or appeal.',
        bullets: [
          'Automated detection flags potential violations',
          'Human review ensures context and fairness',
          'Appeals reviewed by a separate moderation team'
        ]
      }
    ],
    cta: {
      title: 'Review the detailed policy',
      description: 'Understand the do\'s and don\'ts before publishing your next drop.',
      buttonText: 'Read Guidelines',
      buttonTo: '/login'
    }
  },
  'report-issue': {
    category: 'Safety',
    heroTitle: 'Report an Issue',
    heroSubtitle: 'Fast, respectful support whenever something feels off.',
    intro: 'Use the report workflow to flag content, billing concerns, technical bugs, or policy violations. We treat every report seriously and transparently.',
    highlights: [
      {
        title: 'Streamlined Workflow',
        description: 'Contextual forms gather the right details so we can take action quickly.',
        icon: 'fas fa-paper-plane'
      },
      {
        title: 'Status Tracking',
        description: 'Receive updates on your report and know when it is resolved.',
        icon: 'fas fa-tasks'
      },
      {
        title: 'Escalation Paths',
        description: 'Critical incidents route directly to the Trust & Safety leadership team.',
        icon: 'fas fa-exclamation-triangle'
      }
    ],
    sections: [
      {
        heading: 'How To Report',
        description: 'You can report from any content module or via the Help Center.',
        bullets: [
          'Include as much context as possible for faster triage',
          'Use screenshots or message IDs when available',
          'Flag if you believe there is immediate danger'
        ]
      },
      {
        heading: 'Our Commitment',
        description: 'We prioritize safety, confidentiality, and fairness throughout the review.',
        bullets: [
          'Reporters will never face retaliation',
          'We provide outcome summaries whenever possible',
          'If we make a mistake, appeals are encouraged'
        ]
      }
    ],
    cta: {
      title: 'Submit a report',
      description: 'Visit the Help Center to log a report or email safety@silkfans.com for urgent matters.',
      buttonText: 'Open Help Center',
      buttonTo: '/login'
    }
  },
  'age-identity-verification': {
    category: 'Safety',
    heroTitle: 'Age & Identity Verification',
    heroSubtitle: 'Verified communities start with verified people.',
    intro: 'SilkFans requires every creator and manager to complete enhanced identity verification. Fans benefit from additional fraud protection and optional verification badges.',
    highlights: [
      {
        title: 'Multi-Step KYC',
        description: 'Government ID capture, biometric checks, and liveness detection protect our ecosystem.',
        icon: 'fas fa-id-card'
      },
      {
        title: 'Continuous Monitoring',
        description: 'We re-verify high-risk accounts, monitor device fingerprints, and flag suspicious changes.',
        icon: 'fas fa-user-check'
      },
      {
        title: 'Fan Controls',
        description: 'Fans can opt into visibility preferences that highlight verified creators or managers.',
        icon: 'fas fa-user-shield'
      }
    ],
    sections: [
      {
        heading: 'Creator Verification',
        description: 'All creators and managers must pass identity verification before publishing content or earning revenue.',
        bullets: [
          'Global coverage via trusted KYC vendors with localized document support',
          'Biometric comparisons and liveness checks to prevent spoofing',
          'Ongoing sanctions, PEP, and adverse media screening'
        ]
      },
      {
        heading: 'Fan Protections',
        description: 'Fans benefit from contextual cues and optional multi-factor authentication for account safety.',
        bullets: [
          'Optional fan verification badges for enhanced trust in peer-to-peer interactions',
          'Two-step verification reminders for billing changes or large unlocks',
          'Notification center that highlights suspicious account activity in real time'
        ]
      }
    ],
    cta: {
      title: 'Complete verification now',
      description: 'Access the verification dashboard to upload documents or check status updates.',
      buttonText: 'Open Verification',
      buttonTo: '/login'
    }
  },
  'appeals-policy': {
    category: 'Safety',
    heroTitle: 'Appeals Policy',
    heroSubtitle: 'Transparency and fairness for every enforcement decision.',
    intro: 'SilkFans provides a clear, timely process for creators and fans to appeal moderation outcomes. We review every appeal with a separate enforcement team to ensure impartiality.',
    highlights: [
      {
        title: 'Dedicated Appeals Desk',
        description: 'Specialized moderators handle appeals independent of the original reviewer.',
        icon: 'fas fa-balance-scale'
      },
      {
        title: 'Status Tracking',
        description: 'Submit and track appeals from the Safety Center with real-time notifications.',
        icon: 'fas fa-clipboard-list'
      },
      {
        title: 'Policy Education',
        description: 'Outcome summaries include references to policies and tips to avoid future violations.',
        icon: 'fas fa-graduation-cap'
      }
    ],
    sections: [
      {
        heading: 'When to Appeal',
        description: 'You may appeal removal of content, suspension notices, monetization freezes, or account closures.',
        bullets: [
          'Appeals must be filed within 30 days of the enforcement notice',
          'Provide contextual evidence, timestamps, or clarifying details',
          'Multiple appeals are allowed if new evidence is available'
        ]
      },
      {
        heading: 'Review Timeline',
        description: 'Our team aims to resolve appeals within five business days, prioritizing severe account actions.',
        bullets: [
          'Emergency escalations handled within 24 hours',
          'Automatic status updates sent via email and dashboard messaging',
          'If an appeal is upheld, access is restored immediately with written confirmation'
        ]
      }
    ],
    cta: {
      title: 'Submit an appeal',
      description: 'Visit the enforcement dashboard to review decisions and lodge an appeal.',
      buttonText: 'Open Appeals Dashboard',
      buttonTo: '/login'
    }
  },
  'assisting-law-enforcement': {
    category: 'Safety',
    heroTitle: 'Assisting Law Enforcement',
    heroSubtitle: 'Coordinated responses to protect our community.',
    intro: 'SilkFans responds promptly to lawful requests from law enforcement while prioritizing user privacy and due process.',
    highlights: [
      {
        title: '24/7 Response Team',
        description: 'Our investigations unit handles urgent law enforcement requests around the clock.',
        icon: 'fas fa-shield-alt'
      },
      {
        title: 'Legal Compliance',
        description: 'We require valid legal process before disclosing data, unless there is an imminent threat to life.',
        icon: 'fas fa-scale-balanced'
      },
      {
        title: 'Transparency Reporting',
        description: 'Aggregate statistics about law enforcement requests are shared in our transparency reports.',
        icon: 'fas fa-file-alt'
      }
    ],
    sections: [
      {
        heading: 'Request Guidelines',
        description: 'Law enforcement agencies can submit requests via our secure portal.',
        bullets: [
          'Include applicable legal authority and scope of information requested',
          'Emergency requests must certify risk of death or serious physical harm',
          'We notify affected users where permitted by law'
        ]
      },
      {
        heading: 'Cross-Border Cooperation',
        description: 'We comply with international treaties and mutual legal assistance frameworks.',
        bullets: [
          'Dedicated regional counsel supports localized compliance',
          'We ensure all data transfers follow privacy and security regulations',
          'Child protection and human trafficking matters receive immediate prioritization'
        ]
      }
    ],
    cta: {
      title: 'Visit the law enforcement portal',
      description: 'Accredited agencies can access our secure request workflow and escalation contacts.',
      buttonText: 'Open Portal',
      buttonTo: '/login'
    }
  },
  'combatting-csam': {
    category: 'Safety',
    heroTitle: 'Combatting CSAM',
    heroSubtitle: 'Zero tolerance for child sexual abuse material (CSAM).',
    intro: 'We deploy advanced detection, proactive moderation, and strong partnerships to identify and eradicate CSAM from SilkFans.',
    highlights: [
      {
        title: 'Trusted Technology',
        description: 'Hash-matching, AI detection, and human moderation work together to identify harmful content.',
        icon: 'fas fa-brain'
      },
      {
        title: 'Rapid Escalation',
        description: 'Any suspected CSAM is immediately escalated to safety leadership and relevant authorities.',
        icon: 'fas fa-bolt'
      },
      {
        title: 'Global Partnerships',
        description: 'We collaborate with NCMEC, INHOPE, and other organizations to strengthen industry defenses.',
        icon: 'fas fa-handshake'
      }
    ],
    sections: [
      {
        heading: 'Detection & Prevention',
        description: 'We combine automation with expert review to detect CSAM before it spreads.',
        bullets: [
          'Deploy PhotoDNA, AI classifiers, and perceptual hashing technologies',
          'Regularly retrain models using vetted datasets and expert feedback',
          'Mandatory training for all moderators handling sensitive escalation queues'
        ]
      },
      {
        heading: 'Reporting & Law Enforcement',
        description: 'We submit reports to NCMEC and cooperate fully with law enforcement investigations.',
        bullets: [
          'Immediate account suspension and evidence preservation',
          'Notification to relevant authorities within legal timeframes',
          'Victim-centered approach that prioritizes safety and support resources'
        ]
      }
    ],
    cta: {
      title: 'Report suspected abuse',
      description: 'Contact safety@silkfans.com or use the in-product reporting tools to flag violations.',
      buttonText: 'Open Reporting Tools',
      buttonTo: '/login'
    }
  },
  'content-moderation-policy': {
    category: 'Safety',
    heroTitle: 'Content Moderation Policy',
    heroSubtitle: 'Balanced moderation that protects creativity and safety.',
    intro: 'Our moderation framework combines automated detection with human expertise. We aim to enforce policies consistently, fairly, and transparently.',
    highlights: [
      {
        title: 'Layered Review',
        description: 'Automation flags potential issues while trained moderators examine context.',
        icon: 'fas fa-layer-group'
      },
      {
        title: 'Cultural Fluency',
        description: 'Moderation teams span multiple regions and languages for contextual accuracy.',
        icon: 'fas fa-language'
      },
      {
        title: 'Audit & Quality',
        description: 'We run regular calibration sessions and quality audits to reduce false positives.',
        icon: 'fas fa-clipboard-check'
      }
    ],
    sections: [
      {
        heading: 'Enforcement Standards',
        description: 'We categorize violations to match enforcement outcomes to severity and intent.',
        bullets: [
          'Warnings and education for low-severity or accidental issues',
          'Temporary restrictions for repeat or moderate violations',
          'Permanent removal for egregious or illegal content'
        ]
      },
      {
        heading: 'Moderator Wellbeing',
        description: 'We provide support, tools, and rotation schedules to protect moderator wellbeing.',
        bullets: [
          'Access to mental health resources and peer support programs',
          'Tooling that masks or blurs sensitive imagery by default',
          'Rotation schedules to minimize exposure fatigue'
        ]
      }
    ],
    cta: {
      title: 'Read the full moderation framework',
      description: 'Dive deeper into how SilkFans enforces policies and supports creators.',
      buttonText: 'Download Moderation Guide',
      buttonTo: '/login'
    }
  },
  'ensuring-consent-intimate-images': {
    category: 'Safety',
    heroTitle: 'Ensuring Consent for Intimate Images',
    heroSubtitle: 'Consent is non-negotiable on SilkFans.',
    intro: 'We require proof of consent for intimate or collaborative content. Our verification workflows ensure that everyone featured has granted explicit permission.',
    highlights: [
      {
        title: 'Release Forms',
        description: 'Creators upload signed releases for collaborators appearing in premium content.',
        icon: 'fas fa-file-signature'
      },
      {
        title: 'Audit Trails',
        description: 'We store consent documentation securely and tie it to published assets.',
        icon: 'fas fa-archive'
      },
      {
        title: 'Rapid Takedowns',
        description: 'Suspected non-consensual content triggers immediate review and removal.',
        icon: 'fas fa-exclamation-circle'
      }
    ],
    sections: [
      {
        heading: 'Consent Verification',
        description: 'Our portal guides creators through uploading releases and ID matches for collaborators.',
        bullets: [
          'Smart forms collect signatures, contact data, and ID verification',
          'Collaborators can confirm consent via secure email links',
          'Releases must be updated for new content featuring collaborators'
        ]
      },
      {
        heading: 'Protecting Survivors',
        description: 'Individuals can request rapid takedown of content they believe is non-consensual.',
        bullets: [
          'Dedicated hotline and email for urgent survivor support',
          'Temporary suspensions applied while investigations proceed',
          'Referrals to counseling and legal assistance networks'
        ]
      }
    ],
    cta: {
      title: 'Manage consent documentation',
      description: 'Upload collaboration releases or review existing approvals in the creator dashboard.',
      buttonText: 'Open Consent Manager',
      buttonTo: '/login'
    }
  },
  'dsa-transparency-report': {
    category: 'Safety',
    heroTitle: 'EU Digital Services Act Transparency',
    heroSubtitle: 'Our commitments under the DSA.',
    intro: 'SilkFans aligns with the EU Digital Services Act by publishing Risk Assessment Reports, transparency metrics, and mitigation strategies for systemic risks.',
    highlights: [
      {
        title: 'Risk Assessments',
        description: 'Annual evaluations measure systemic risks like disinformation and exploitation.',
        icon: 'fas fa-chart-area'
      },
      {
        title: 'Independent Audits',
        description: 'External auditors assess our compliance posture and mitigation efforts.',
        icon: 'fas fa-user-tie'
      },
      {
        title: 'User Empowerment',
        description: 'Tools for flagging illegal content, appealing decisions, and controlling recommendations.',
        icon: 'fas fa-toolbox'
      }
    ],
    sections: [
      {
        heading: 'Transparency Disclosures',
        description: 'We publish semi-annual reports detailing content moderation statistics and appeals outcomes.',
        bullets: [
          'Breakdowns by Member State and violation category',
          'Information on average moderation timelines',
          'Details on automated tools and human review ratios'
        ]
      },
      {
        heading: 'Mitigation Strategies',
        description: 'We implement targeted safeguards for high-risk areas like minors\' safety and disinformation.',
        bullets: [
          'Algorithmic audits to reduce amplification of harmful content',
          'Age-appropriate design adjustments and parental controls',
          'Crisis protocols for rapid response to emerging threats'
        ]
      }
    ],
    cta: {
      title: 'View the latest DSA report',
      description: 'Download our Digital Services Act transparency briefing and risk assessments.',
      buttonText: 'Download Report',
      buttonTo: '/login'
    }
  },
  'protect-copyright': {
    category: 'Safety',
    heroTitle: 'Protecting Creator Copyright',
    heroSubtitle: 'Tools and policies that guard your original work.',
    intro: 'SilkFans invests in proactive copyright protection so creators can focus on content instead of chasing piracy.',
    highlights: [
      {
        title: 'Fingerprinting Technology',
        description: 'Automated scans detect unauthorized re-uploads of protected content.',
        icon: 'fas fa-fingerprint'
      },
      {
        title: 'Legal Support',
        description: 'We guide creators through takedown notices, counter-notices, and legal escalations.',
        icon: 'fas fa-gavel'
      },
      {
        title: 'Proactive Enforcement',
        description: 'We monitor third-party platforms and marketplaces to reduce content theft.',
        icon: 'fas fa-user-secret'
      }
    ],
    sections: [
      {
        heading: 'Rights Management Suite',
        description: 'Upload reference files to create digital fingerprints and monitor unauthorized use.',
        bullets: [
          'Automated detection of matching audio, video, and imagery',
          'Dashboard to review, approve, or remove flagged matches',
          'Optional watermarking tools for premium drops'
        ]
      },
      {
        heading: 'Enforcement Assistance',
        description: 'Our trust & safety team partners with creators to pursue difficult cases.',
        bullets: [
          'Template notices for takedowns across major platforms',
          'Escalation to legal counsel for chronic infringers',
          'Coordination with payment providers to block monetization of stolen content'
        ]
      }
    ],
    cta: {
      title: 'Activate copyright protection',
      description: 'Upload reference files and configure monitoring preferences in the creator dashboard.',
      buttonText: 'Open Rights Manager',
      buttonTo: '/login'
    }
  },
  'mission-vision-values': {
    category: 'Company',
    heroTitle: 'Mission, Vision & Values',
    heroSubtitle: 'Guiding principles that shape every SilkFans decision.',
    intro: 'We exist to help creators build sustainable businesses without sacrificing authenticity. Our values ensure we deliver on that mission every day.',
    highlights: [
      {
        title: 'Empowerment',
        description: 'Creators own their audience, storytelling, and monetization strategies.',
        icon: 'fas fa-hands'
      },
      {
        title: 'Integrity',
        description: 'Transparency, trust, and accountability underpin product and policy choices.',
        icon: 'fas fa-compass'
      },
      {
        title: 'Community',
        description: 'We celebrate diversity, inclusion, and meaningful fan connections.',
        icon: 'fas fa-people-carry'
      }
    ],
    sections: [
      {
        heading: 'Our Mission',
        description: 'Empower creators to monetize safely, sustainably, and globally.',
        bullets: [
          'Provide best-in-class creator tooling, analytics, and support',
          'Ensure fans feel respected, included, and protected',
          'Invest in innovation that benefits the entire creator economy'
        ]
      },
      {
        heading: 'Our Vision',
        description: 'A world where every creator can turn passion into a thriving business.',
        bullets: [
          'Champion creator-first policies and ethical technology',
          'Cultivate communities that reward creativity and respect',
          'Lead the industry in safety, compliance, and transparency'
        ]
      }
    ],
    cta: {
      title: 'See how we live our values',
      description: 'Read impact updates, diversity reports, and product commitments.',
      buttonText: 'Explore Impact Reports',
      buttonTo: '/login'
    }
  },
  'monthly-transparency-reports': {
    category: 'Safety',
    heroTitle: 'Monthly Transparency Reports',
    heroSubtitle: 'Visibility into moderation, enforcement, and systemic risks.',
    intro: 'Each month we share anonymized metrics about reports, enforcement outcomes, and policy changes so the community stays informed.',
    highlights: [
      {
        title: 'Breakdowns by Category',
        description: 'View moderation stats across policy areas, including safety, IP, and conduct.',
        icon: 'fas fa-chart-pie'
      },
      {
        title: 'Appeals Insights',
        description: 'Understand appeal rates, reinstatement percentages, and response times.',
        icon: 'fas fa-undo-alt'
      },
      {
        title: 'Emerging Trends',
        description: 'We highlight new risks and how we are mitigating them.',
        icon: 'fas fa-binoculars'
      }
    ],
    sections: [
      {
        heading: 'What We Publish',
        description: 'Reports include anonymized data along with context and actions taken.',
        bullets: [
          'Volume of reports by policy type and region',
          'Average response times for different enforcement tiers',
          'Updates to moderation tooling and human review capacity'
        ]
      },
      {
        heading: 'Why It Matters',
        description: 'Transparency builds accountability and trust.',
        bullets: [
          'Community feedback influences future policy updates',
          'Creators can understand how enforcement operations scale',
          'Fans gain confidence in the health of SilkFans communities'
        ]
      }
    ],
    cta: {
      title: 'Read the latest report',
      description: 'Download monthly transparency highlights in PDF format.',
      buttonText: 'View Reports',
      buttonTo: '/login'
    }
  },
  'commitment-safety-transparency': {
    category: 'Safety',
    heroTitle: 'SilkFans Safety & Transparency Commitment',
    heroSubtitle: 'Safety is built into our roadmap, not bolted on.',
    intro: 'We publish our commitments so creators and fans can hold us accountable to high safety standards.',
    highlights: [
      {
        title: 'Investing in People',
        description: 'We grow specialized trust & safety teams with deep industry expertise.',
        icon: 'fas fa-user-tie'
      },
      {
        title: 'Iterative Policy',
        description: 'Policies evolve with community feedback and regulatory changes.',
        icon: 'fas fa-sync'
      },
      {
        title: 'Open Channels',
        description: 'We maintain advisory councils and community forums for safety feedback.',
        icon: 'fas fa-comments'
      }
    ],
    sections: [
      {
        heading: 'Core Pledges',
        description: 'Our commitments guide product, policy, and staffing decisions.',
        bullets: [
          'Publish regular transparency and risk assessment reports',
          'Maintain 24/7 coverage for critical trust & safety escalations',
          'Invest in R&D to detect new forms of abuse and exploitation'
        ]
      },
      {
        heading: 'Measuring Progress',
        description: 'We set goals and publicly report on our progress annually.',
        bullets: [
          'Quarterly goals for moderation accuracy and response times',
          'Creator and fan satisfaction surveys focused on trust',
          'Independent audits of our commitments and disclosures'
        ]
      }
    ],
    cta: {
      title: 'Review our commitments',
      description: 'Read the full statement and learn how we track progress.',
      buttonText: 'View Commitment Statement',
      buttonTo: '/login'
    }
  },
  'preventing-modern-slavery': {
    category: 'Safety',
    heroTitle: 'Preventing Modern Slavery & Human Trafficking',
    heroSubtitle: 'Protecting the vulnerable is a shared responsibility.',
    intro: 'SilkFans enforces strict policies to detect and remove any content or activity linked to modern slavery or human trafficking.',
    highlights: [
      {
        title: 'Zero-Tolerance Enforcement',
        description: 'Suspected trafficking content is removed immediately and escalated to authorities.',
        icon: 'fas fa-hand-paper'
      },
      {
        title: 'Training & Awareness',
        description: 'Teams receive ongoing training from NGOs and survivor advocates.',
        icon: 'fas fa-ribbon'
      },
      {
        title: 'Partnerships',
        description: 'We collaborate with global organizations to improve detection and survivor support.',
        icon: 'fas fa-globe'
      }
    ],
    sections: [
      {
        heading: 'Detection Controls',
        description: 'We monitor for keywords, behavioral signals, and payment anomalies.',
        bullets: [
          'Automated systems flag suspicious recruitment or coercive language',
          'Financial monitoring detects forced payout patterns',
          'Human review teams specialize in trafficking indicators'
        ]
      },
      {
        heading: 'Supporting Survivors',
        description: 'We take a victim-centered approach and provide direct resources.',
        bullets: [
          'Rapid takedown and account locking to prevent further harm',
          'Introductions to survivor advocacy organizations',
          'Guidance for law enforcement statements when survivors are ready'
        ]
      }
    ],
    cta: {
      title: 'Report concerns confidentially',
      description: 'Email safety@silkfans.com or use the hotline listed in our Safety Center.',
      buttonText: 'Contact Safety Team',
      buttonTo: '/login'
    }
  },
  'respecting-your-privacy': {
    category: 'Safety',
    heroTitle: 'Respecting Your Privacy',
    heroSubtitle: 'Security and privacy are foundational to SilkFans.',
    intro: 'We give users control over how their information is used and protect personal data with enterprise-grade security.',
    highlights: [
      {
        title: 'Privacy Controls',
        description: 'Manage visibility, account data, and communication preferences from one dashboard.',
        icon: 'fas fa-user-cog'
      },
      {
        title: 'Security Practices',
        description: 'Encryption, key management, and continuous monitoring safeguard your data.',
        icon: 'fas fa-shield-virus'
      },
      {
        title: 'Minimal Collection',
        description: 'We collect only the data needed to deliver our services and delete it when no longer required.',
        icon: 'fas fa-trash-restore'
      }
    ],
    sections: [
      {
        heading: 'Data Controls',
        description: 'Easily access, download, or delete your data without filing support tickets.',
        bullets: [
          'Self-service data export and deletion tools',
          'Granular controls for email, SMS, and push messaging',
          'Privacy dashboard summarizing connected apps and sessions'
        ]
      },
      {
        heading: 'Security Posture',
        description: 'We align with industry best practices and regulatory frameworks.',
        bullets: [
          'Regular penetration tests and bug bounty participation',
          'Strict vendor assessments and contractual safeguards',
          'Incident response playbooks tested multiple times a year'
        ]
      }
    ],
    cta: {
      title: 'Manage your privacy settings',
      description: 'Visit the privacy dashboard to update preferences in real time.',
      buttonText: 'Open Privacy Dashboard',
      buttonTo: '/login'
    }
  },
  'money-laundering-fraud': {
    category: 'Safety',
    heroTitle: 'Safeguarding Against Money Laundering & Fraud',
    heroSubtitle: 'Robust compliance programs keep SilkFans secure.',
    intro: 'We deploy financial crime controls to detect, prevent, and investigate money laundering or fraudulent activity.',
    highlights: [
      {
        title: 'AML Monitoring',
        description: 'Transaction monitoring and behavioral analytics surface suspicious activity.',
        icon: 'fas fa-search-dollar'
      },
      {
        title: 'Risk Scoring',
        description: 'Accounts receive dynamic risk scores based on activity, geography, and verification status.',
        icon: 'fas fa-chart-line'
      },
      {
        title: 'Special Investigations',
        description: 'Dedicated analysts handle escalations and collaborate with financial partners.',
        icon: 'fas fa-user-secret'
      }
    ],
    sections: [
      {
        heading: 'Preventative Measures',
        description: 'We design controls that block suspect activity before funds move.',
        bullets: [
          'Velocity checks on earnings, withdrawals, and unlock purchases',
          'Blacklist screening against sanctions and watch lists',
          'Adaptive MFA for high-risk account changes or payouts'
        ]
      },
      {
        heading: 'Investigation & Reporting',
        description: 'If potential fraud is detected, we act quickly and thoroughly.',
        bullets: [
          'Immediate hold on payouts linked to suspicious activity',
          'Escalation to payment processors and banking partners',
          'Filing of Suspicious Activity Reports (SARs) where required'
        ]
      }
    ],
    cta: {
      title: 'Learn about our AML program',
      description: 'Review our compliance overview and how we work with financial partners.',
      buttonText: 'View Compliance Overview',
      buttonTo: '/login'
    }
  },
  'tackling-hate-speech': {
    category: 'Safety',
    heroTitle: 'Tackling Hate Speech',
    heroSubtitle: 'Zero tolerance for harassment or discrimination.',
    intro: 'SilkFans enforces clear policies against hateful conduct and rhetoric across all communities.',
    highlights: [
      {
        title: 'Comprehensive Policies',
        description: 'We prohibit hateful slurs, symbols, and content targeting protected classes.',
        icon: 'fas fa-ban'
      },
      {
        title: 'Community Reporting',
        description: 'Fans and creators can report hate speech easily from any content surface.',
        icon: 'fas fa-flag'
      },
      {
        title: 'Education & Accountability',
        description: 'We provide educational resources and escalating enforcement for violators.',
        icon: 'fas fa-lightbulb'
      }
    ],
    sections: [
      {
        heading: 'Policy Overview',
        description: 'Our policy covers hate speech, hateful conduct, and organized hate.',
        bullets: [
          'Immediate removal of content praising or promoting violence',
          'Account penalties for harassment or hateful slurs',
          'Stronger actions for coordinated or repeated offenses'
        ]
      },
      {
        heading: 'Support for Impacted Users',
        description: 'We prioritize the wellbeing of those targeted by hateful content.',
        bullets: [
          'Dedicated support channel for impacted creators and fans',
          'Proactive outreach when severe incidents occur',
          'Guidance on using filters and moderation tools to curate experiences'
        ]
      }
    ],
    cta: {
      title: 'Review hate speech policy',
      description: 'Read the detailed standards and enforcement actions.',
      buttonText: 'Open Policy',
      buttonTo: '/login'
    }
  },
  'tax-policy': {
    category: 'Compliance',
    heroTitle: 'Tax Policy',
    heroSubtitle: 'Transparent taxation for a global creator economy.',
    intro: 'We explain how SilkFans handles taxes for creators and fans, including VAT, GST, and US tax forms.',
    highlights: [
      {
        title: 'Global Coverage',
        description: 'We calculate and remit taxes in supported jurisdictions automatically.',
        icon: 'fas fa-globe-europe'
      },
      {
        title: 'Creator Guidance',
        description: 'Step-by-step instructions for submitting tax forms and tracking earnings.',
        icon: 'fas fa-file-invoice-dollar'
      },
      {
        title: 'Fan Transparency',
        description: 'Fans see applicable taxes at checkout with localized breakdowns.',
        icon: 'fas fa-receipt'
      }
    ],
    sections: [
      {
        heading: 'Tax Collection',
        description: 'We handle indirect tax calculations at the point of sale.',
        bullets: [
          'Automatic VAT/GST collection based on fan location',
          'Digital services taxes remitted where required',
          'Receipts show tax amounts for fan record keeping'
        ]
      },
      {
        heading: 'Creator Obligations',
        description: 'Creators receive annual statements and access year-round reporting tools.',
        bullets: [
          'Submit W-9, W-8BEN, or relevant local tax forms inside the dashboard',
          'Download monthly and annual earnings summaries',
          'Access resources explaining deductible business expenses'
        ]
      }
    ],
    cta: {
      title: 'Visit the tax resource center',
      description: 'Find documentation and support for managing creator taxes.',
      buttonText: 'Open Tax Resources',
      buttonTo: '/login'
    }
  },
  'tax-strategy': {
    category: 'Compliance',
    heroTitle: 'Tax Strategy',
    heroSubtitle: 'Responsible tax governance for SilkFans operations.',
    intro: 'Our tax strategy outlines how SilkFans approaches compliance, risk management, and collaboration with tax authorities.',
    highlights: [
      {
        title: 'Compliance First',
        description: 'We comply with applicable tax laws in every jurisdiction where we operate.',
        icon: 'fas fa-gavel'
      },
      {
        title: 'Risk Management',
        description: 'Internal controls and audits ensure accurate reporting and payments.',
        icon: 'fas fa-clipboard-check'
      },
      {
        title: 'Open Dialogue',
        description: 'We maintain transparent relationships with tax authorities and stakeholders.',
        icon: 'fas fa-comments-dollar'
      }
    ],
    sections: [
      {
        heading: 'Governance',
        description: 'SilkFans\' tax strategy is overseen by senior leadership and reviewed annually.',
        bullets: [
          'Board-level visibility into tax planning and risk',
          'Sarbanes-Oxley aligned controls on financial reporting',
          'Use of reputable advisors to monitor regulatory change'
        ]
      },
      {
        heading: 'Risk Appetite',
        description: 'We do not pursue aggressive tax positions that conflict with the letter or spirit of the law.',
        bullets: [
          'Transfer pricing policies aligned with OECD guidelines',
          'Documentation maintained for every jurisdiction we operate in',
          'Cooperative compliance approach with regulators'
        ]
      }
    ],
    cta: {
      title: 'Read the tax strategy statement',
      description: 'Download our annual tax governance overview.',
      buttonText: 'Download Statement',
      buttonTo: '/login'
    }
  },
  legal: {
    category: 'Legal',
    heroTitle: 'Legal Overview',
    heroSubtitle: 'Policies that protect the community and the company.',
    intro: 'SilkFans is committed to clarity, compliance, and fairness. Our legal center explains how we operate, the rights you have, and the responsibilities everyone shares.',
    highlights: [
      {
        title: 'Transparent Policies',
        description: 'We keep terms concise, accessible, and localized where possible.',
        icon: 'fas fa-file-contract'
      },
      {
        title: 'Global Compliance',
        description: 'From GDPR to COPPA, we build SilkFans to align with regional requirements.',
        icon: 'fas fa-scale-balanced'
      },
      {
        title: 'User Rights',
        description: 'You can access, export, or delete your data—no hoops attached.',
        icon: 'fas fa-user-check'
      }
    ],
    sections: [
      {
        heading: 'Legal Documents',
        description: 'We maintain dedicated sections for terms, privacy, copyright, and cookies.',
        bullets: [
          'Terms of Service define the rules of engagement on SilkFans',
          'Privacy Policy details data usage, retention, and your rights',
          'DMCA & Copyright outlines takedown and counter-notice processes',
          'Cookies Settings explain tracking preferences and consent'
        ]
      },
      {
        heading: 'Regulatory Readiness',
        description: 'Our legal and compliance teams monitor the evolving regulatory landscape.',
        bullets: [
          'Regular audits to ensure policy alignment across jurisdictions',
          'Data processing agreements with all major vendors',
          'Security protocols validated through independent assessments'
        ]
      }
    ],
    cta: {
      title: 'Review our policies',
      description: 'Dive into the legal documents that govern SilkFans and protect the community.',
      buttonText: 'Open Legal Center',
      buttonTo: '/info/terms-of-service'
    }
  },
  'terms-of-service': {
    category: 'Legal',
    heroTitle: 'Terms of Service',
    heroSubtitle: 'The agreement that keeps SilkFans fair and respectful.',
    intro: 'Our Terms of Service outline what you can expect from SilkFans and the expectations we have for creators, fans, and partners.',
    highlights: [
      {
        title: 'Scope & Eligibility',
        description: 'Who can use SilkFans, account requirements, and regional considerations.',
        icon: 'fas fa-user-lock'
      },
      {
        title: 'Content Ownership',
        description: 'Creators retain rights to their content while granting SilkFans essential licenses.',
        icon: 'fas fa-camera-retro'
      },
      {
        title: 'Platform Integrity',
        description: 'Rules that preserve community safety, prevent misuse, and outline enforcement steps.',
        icon: 'fas fa-shield-virus'
      }
    ],
    sections: [
      {
        heading: 'Key Sections',
        description: 'Understand the parts of the Terms that impact your day-to-day experience.',
        bullets: [
          'Account responsibilities and security obligations',
          'Payment, refunds, and dispute resolution',
          'Policy violations, suspension, and appeals'
        ]
      },
      {
        heading: 'Staying Updated',
        description: 'We notify users of material changes with clear summaries and effective dates.',
        bullets: [
          '30-day notice for most major updates',
          'Version history available for reference',
          'Feedback channels open for community input'
        ]
      }
    ],
    cta: {
      title: 'Read the latest Terms',
      description: 'Review the full legal text and download a copy for your records.',
      buttonText: 'Download Terms (PDF)',
      buttonTo: '/login'
    }
  },
  'privacy-policy': {
    category: 'Legal',
    heroTitle: 'Privacy Policy',
    heroSubtitle: 'Your data, your choice.',
    intro: 'We believe in data minimization, informed consent, and transparency. Our Privacy Policy explains what we collect, why we collect it, and how you stay in control.',
    highlights: [
      {
        title: 'Data Transparency',
        description: 'Clear explanations for account data, payments, communications, and analytics.',
        icon: 'fas fa-database'
      },
      {
        title: 'User Controls',
        description: 'Unsubscribe, delete, or export data directly from your account dashboard.',
        icon: 'fas fa-sliders-h'
      },
      {
        title: 'Security Standards',
        description: 'Encryption at rest and in transit, with regular penetration testing.',
        icon: 'fas fa-lock'
      }
    ],
    sections: [
      {
        heading: 'How We Use Data',
        description: 'SilkFans only collects data necessary to deliver the product experience you expect.',
        bullets: [
          'Account data enables login, personalization, and security alerts',
          'Payment data is processed securely through PCI-compliant partners',
          'Usage data helps us improve performance and safety'
        ]
      },
      {
        heading: 'Your Rights',
        description: 'We honor global privacy rights, including GDPR, CCPA, and other regional frameworks.',
        bullets: [
          'Access and portability via self-serve tools',
          'Deletion requests honored within statutory timelines',
          'Dedicated privacy team reachable at privacy@silkfans.com'
        ]
      }
    ],
    cta: {
      title: 'Control your data',
      description: 'Visit your account settings to manage privacy preferences.',
      buttonText: 'Privacy Settings',
      buttonTo: '/login'
    }
  },
  'dmca-copyright': {
    category: 'Legal',
    heroTitle: 'DMCA & Copyright',
    heroSubtitle: 'Protecting creators and respecting ownership.',
    intro: 'SilkFans respects intellectual property rights and responds to valid DMCA takedown and counter-notice requests.',
    highlights: [
      {
        title: 'Takedown Process',
        description: 'Submit detailed claims to ensure swift action on infringing content.',
        icon: 'fas fa-file-upload'
      },
      {
        title: 'Counter Notice',
        description: 'Creators can dispute takedowns with supporting evidence.',
        icon: 'fas fa-file-signature'
      },
      {
        title: 'Repeat Infringers',
        description: 'We enforce strict penalties for repeated violations.',
        icon: 'fas fa-ban'
      }
    ],
    sections: [
      {
        heading: 'Submitting a DMCA Notice',
        description: 'Include necessary details so we can verify and process your request efficiently.',
        bullets: [
          'Identify the copyrighted work and allegedly infringing material',
          'Provide contact information and a sworn statement of ownership',
          'Send notices to dmca@silkfans.com or via our legal portal'
        ]
      },
      {
        heading: 'Counter Notice Process',
        description: 'Creators may respond with a counter notice if they believe content was removed in error.',
        bullets: [
          'Submit evidence that you own or are licensed to use the content',
          'Agree to jurisdiction in the event of a legal dispute',
          'We restore content if no legal action is initiated within the statutory period'
        ]
      }
    ],
    cta: {
      title: 'Submit a DMCA request',
      description: 'Use our legal intake form or email dmca@silkfans.com for official notices.',
      buttonText: 'Open Legal Portal',
      buttonTo: '/login'
    }
  },
  'cookies-settings': {
    category: 'Legal',
    heroTitle: 'Cookies Settings',
    heroSubtitle: 'Customize how SilkFans uses cookies and trackers.',
    intro: 'Your privacy preferences matter. Learn about the cookies SilkFans uses and tailor them to your comfort level.',
    highlights: [
      {
        title: 'Essential Cookies',
        description: 'Required for secure login, session management, and fraud prevention.',
        icon: 'fas fa-cookie-bite'
      },
      {
        title: 'Performance Insights',
        description: 'Optional analytics help us improve stability and UI performance.',
        icon: 'fas fa-chart-line'
      },
      {
        title: 'Marketing Choices',
        description: 'Personalize promotions or opt out entirely—control stays with you.',
        icon: 'fas fa-bullseye'
      }
    ],
    sections: [
      {
        heading: 'Manage Your Preferences',
        description: 'Update cookie consent at any time from your account dashboard or browser settings.',
        bullets: [
          'Toggle analytics, personalization, and marketing cookies individually',
          'See detailed descriptions for each vendor and purpose',
          'Withdraw consent without affecting essential platform features'
        ]
      },
      {
        heading: 'Data Handling',
        description: 'We respect "Do Not Track" signals and regional consent frameworks.',
        bullets: [
          'GDPR and ePrivacy compliant consent flows',
          'Regular audits to remove deprecated cookies',
          'No sale of personal data to third parties'
        ]
      }
    ],
    cta: {
      title: 'Adjust your cookie preferences',
      description: 'Visit the privacy controls in your SilkFans account to update settings.',
      buttonText: 'Open Cookie Settings',
      buttonTo: '/login'
    }
  }
}

export default {
  name: 'InfoPage',
  data() {
    return {
      pages,
      defaultGradient,
      defaultHighlightIcon
    }
  },
  computed: {
    currentPage() {
      return this.pages[this.$route.params.slug] || null
    }
  },
  watch: {
    '$route.params.slug': {
      immediate: true,
      handler() {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    currentPage: {
      immediate: true,
      handler(page) {
        if (page?.heroTitle) {
          document.title = `${page.heroTitle} • SilkFans`
        } else {
          document.title = 'SilkFans'
        }
      }
    }
  }
}
</script>

<style scoped>
.info-page {
  min-height: 100vh;
  background-color: #f7f9fb;
}

.hero {
  color: #ffffff;
  padding: 4rem 0 3rem 0;
}

.hero-label {
  display: inline-block;
  padding: 0.4rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 999px;
  font-size: 0.85rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(4px);
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  max-width: 720px;
  margin: 0 auto;
  line-height: 1.6;
}

.intro-card {
  background-color: #ffffff;
  border-radius: 18px;
  padding: 2rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.intro-text {
  margin: 0;
  font-size: 1.05rem;
  color: #1a1a1a;
  line-height: 1.7;
  font-weight: 500;
}

.highlight-card {
  background-color: #ffffff;
  border-radius: 18px;
  padding: 1.8rem;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.highlight-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 50px rgba(0, 175, 240, 0.15);
}

.highlight-card .badge-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(0, 175, 240, 0.12);
  color: #00aff0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.highlight-card h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #1a1a1a;
}

.highlight-card p {
  color: #4a4a4a;
  margin: 0;
}

.section-card {
  background-color: #ffffff;
  border-radius: 18px;
  padding: 2.25rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.section-card + .section-card {
  margin-top: 2rem;
}

.section-card h2 {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.section-card p {
  font-size: 1.02rem;
  color: #4a4a4a;
  margin-bottom: 1rem;
  line-height: 1.7;
}

.section-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.section-list li {
  display: flex;
  align-items: flex-start;
  color: #1a1a1a;
  font-weight: 500;
  margin-bottom: 0.8rem;
}

.resources-card {
  background: linear-gradient(135deg, rgba(0, 175, 240, 0.1), rgba(0, 175, 240, 0.05));
  border-radius: 24px;
  padding: 2.5rem;
  border: 1px solid rgba(0, 175, 240, 0.15);
}

.resources-card h2 {
  font-weight: 700;
  color: #0c2d48;
  margin-bottom: 1.5rem;
}

.resource-item {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 1.75rem;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.resource-item h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #1a1a1a;
}

.resource-item p {
  color: #4a4a4a;
  margin: 0;
}

.cta-card {
  background-color: #ffffff;
  border-radius: 24px;
  padding: 3rem 2rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.cta-card h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-card p {
  font-size: 1.05rem;
  margin-bottom: 1.5rem;
  color: #4a4a4a;
}

.missing-card {
  background-color: #ffffff;
  border-radius: 24px;
  padding: 3rem 2.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.info-footer {
  background-color: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  margin-top: 4rem;
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
  max-width: 320px;
}

.info-footer h4 {
  color: #1a1a1a;
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-list li {
  margin-bottom: 0.55rem;
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

.footer-note {
  color: #8a96a3;
  font-size: 0.875rem;
  margin: 0;
}

@media (max-width: 992px) {
  .footer-description {
    max-width: 100%;
  }

  .footer-logo {
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .footer-logo img {
    height: 32px;
  }

  .footer-logo span {
    font-size: 1.2rem;
  }
}

@media (max-width: 992px) {
  .hero {
    padding: 3.5rem 0 2.5rem 0;
  }

  .hero-title {
    font-size: 2.4rem;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.05rem;
  }

  .intro-card {
    padding: 1.6rem;
  }

  .section-card {
    padding: 1.8rem;
  }
}
</style>

