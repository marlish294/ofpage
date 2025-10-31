<template>
  <div id="app">
    <NavBar v-if="!isAuthPage" />
    <router-view />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'

export default {
  name: 'App',
  components: {
    NavBar
  },
  computed: {
    isAuthPage() {
      return this.$route.path === '/login' || this.$route.path === '/register'
    }
  }
}
</script>

<style>
/* Design System - CSS Variables */
:root {
  /* Brand Colors */
  --color-primary: #00aff0;
  --color-secondary: #b6edfd;
  --color-primary-hover: #0099d6;
  --color-primary-light: rgba(0, 175, 240, 0.1);
  
  /* Text Colors */
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #666666;
  --color-text-white: #ffffff;
  --color-text-charcoal: #2c3e50;
  
  /* Background Colors */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8f9fa;
  --color-bg-soft-dark: #1a1a1a;
  --color-bg-light: #fafbfc;
  
  /* Border & Shadow */
  --border-radius: 16px;
  --border-radius-small: 14px;
  --border-radius-large: 18px;
  --shadow-soft: 0 2px 8px rgba(0, 0, 0, 0.04);
  --shadow-medium: 0 4px 16px rgba(0, 0, 0, 0.08);
  --shadow-hover: 0 8px 24px rgba(0, 175, 240, 0.12);
  --border-subtle: 1px solid rgba(0, 0, 0, 0.06);
  
  /* Spacing Scale */
  --spacing-xs: 0.5rem;
  --spacing-sm: 0.75rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  
  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 2rem;
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
}

/* Global Styles */
* {
  box-sizing: border-box;
}

#app {
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--color-text-charcoal);
  min-height: 100vh;
  background-color: var(--color-bg-secondary);
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

p {
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
}

/* Buttons */
.btn {
  border-radius: var(--border-radius);
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  transition: all var(--transition-base);
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-text-white);
  box-shadow: var(--shadow-soft);
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
  box-shadow: var(--shadow-medium);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:focus {
  outline: none;
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.btn-outline-primary {
  background-color: transparent;
  color: var(--color-primary);
  border: 1.5px solid var(--color-primary);
}

.btn-outline-primary:hover {
  background-color: var(--color-primary);
  color: var(--color-text-white);
  box-shadow: var(--shadow-soft);
}

.btn-light {
  background-color: var(--color-text-white);
  color: var(--color-text-primary);
  box-shadow: var(--shadow-soft);
}

.btn-light:hover {
  box-shadow: var(--shadow-medium);
  transform: translateY(-1px);
}

.btn-link {
  background: none;
  border: none;
  color: var(--color-text-white);
  padding: 0.5rem 1rem;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.btn-link:hover {
  color: var(--color-secondary);
  opacity: 0.9;
}

/* Cards */
.card {
  border: none;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-soft);
  transition: all var(--transition-base);
  background-color: var(--color-bg-primary);
  overflow: hidden;
}

.card:hover {
  box-shadow: var(--shadow-medium);
  transform: translateY(-2px);
}

.card-img-top {
  border-radius: var(--border-radius) var(--border-radius) 0 0;
}

/* Model Cards */
.model-card {
  cursor: pointer;
  transition: all var(--transition-base);
  border-radius: var(--border-radius);
  overflow: hidden;
}

.model-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

/* Form Controls */
.form-control,
.form-select {
  border-radius: var(--border-radius-small);
  border: var(--border-subtle);
  padding: 0.75rem 1rem;
  font-size: var(--font-size-base);
  transition: all var(--transition-base);
  background-color: var(--color-bg-primary);
}

.form-control:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.form-label {
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.input-group-text {
  border-radius: var(--border-radius-small) 0 0 var(--border-radius-small);
  border: var(--border-subtle);
  background-color: var(--color-bg-light);
}

/* Alerts */
.alert {
  border-radius: var(--border-radius);
  border: none;
  padding: var(--spacing-md) var(--spacing-lg);
  box-shadow: var(--shadow-soft);
}

.alert-danger {
  background-color: #ffeef2;
  color: #ff4d6d;
}

/* Badges */
.badge {
  border-radius: 20px;
  padding: 0.375rem 0.75rem;
  font-weight: 500;
  font-size: var(--font-size-xs);
}

.bg-success {
  background-color: #00c78b !important;
}

/* Navbar */
.navbar {
  padding: var(--spacing-md) 0;
  box-shadow: var(--shadow-soft);
}

.navbar-brand {
  font-weight: 600;
  font-size: var(--font-size-xl);
  color: var(--color-text-white) !important;
  text-decoration: none;
}

.nav-link {
  color: var(--color-text-white) !important;
  font-weight: 500;
  padding: 0.5rem 1rem !important;
  border-radius: var(--border-radius-small);
  transition: all var(--transition-fast);
  margin: 0 0.25rem;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--color-secondary) !important;
}

.dropdown-menu {
  border-radius: var(--border-radius);
  border: none;
  box-shadow: var(--shadow-medium);
  padding: var(--spacing-xs);
  margin-top: var(--spacing-xs);
}

.dropdown-item {
  border-radius: var(--border-radius-small);
  padding: var(--spacing-sm) var(--spacing-md);
  transition: all var(--transition-fast);
}

.dropdown-item:hover {
  background-color: var(--color-bg-light);
}

/* Text Utilities */
.text-primary {
  color: var(--color-primary) !important;
}

.bg-primary {
  background-color: var(--color-primary) !important;
}

/* Spacing Utilities */
.py-section {
  padding: var(--spacing-2xl) 0;
}

.mb-section {
  margin-bottom: var(--spacing-2xl);
}

/* Chat Container */
.chat-container {
  height: 500px;
  overflow-y: auto;
  border-radius: var(--border-radius);
  background-color: var(--color-bg-primary);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-soft);
}

.message {
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  max-width: 70%;
}

.message.user {
  background-color: var(--color-secondary);
  margin-left: auto;
  color: var(--color-text-primary);
}

.message.model {
  background-color: var(--color-bg-light);
  margin-right: auto;
}

/* Sidebar */
.sidebar {
  height: 100vh;
  background-color: var(--color-bg-primary);
  border-right: var(--border-subtle);
  box-shadow: var(--shadow-soft);
}

/* Avatar */
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-secondary);
}

/* Stats Card */
.stats-card {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  color: var(--color-text-white);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-medium);
}

.stats-card .card-body {
  padding: var(--spacing-xl);
}

/* Table */
.table {
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  background-color: var(--color-bg-primary);
}

.table th {
  border-top: none;
  font-weight: 600;
  color: var(--color-text-primary);
  background-color: var(--color-bg-light);
  padding: var(--spacing-md);
}

/* Loading */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  padding: var(--spacing-2xl);
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  color: var(--color-primary);
}

/* Jumbotron/Hero */
.jumbotron {
  border-radius: var(--border-radius-large);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-medium);
}

/* Container Spacing */
.container-fluid {
  padding-left: var(--spacing-lg);
  padding-right: var(--spacing-lg);
}

@media (max-width: 768px) {
  .container-fluid {
    padding-left: var(--spacing-md);
    padding-right: var(--spacing-md);
  }
  
  :root {
    --border-radius: 14px;
    --border-radius-small: 12px;
    --border-radius-large: 16px;
  }
}
</style>
