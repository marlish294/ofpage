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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body {
  background-color: #f8f9fa;
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.5rem;
}

.card {
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  transition: box-shadow 0.15s ease-in-out;
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background-color: #6f42c1;
  border-color: #6f42c1;
}

.btn-primary:hover {
  background-color: #5a32a3;
  border-color: #5a32a3;
}

.text-primary {
  color: #6f42c1 !important;
}

.bg-primary {
  background-color: #6f42c1 !important;
}

.chat-container {
  height: 500px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
}

.message {
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
}

.message.user {
  background-color: #e3f2fd;
  margin-left: 2rem;
}

.message.model {
  background-color: #f3e5f5;
  margin-right: 2rem;
}

.sidebar {
  height: 100vh;
  background-color: #f8f9fa;
  border-right: 1px solid #dee2e6;
}

.model-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.model-card:hover {
  transform: translateY(-2px);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.stats-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 1rem;
}

.stats-card .card-body {
  padding: 2rem;
}

.table th {
  border-top: none;
  font-weight: 600;
  color: #495057;
}

.badge {
  font-size: 0.75rem;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
