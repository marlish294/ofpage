// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router'
// import store from './store'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// import Swal from 'sweetalert2'

// const app = createApp(App)

// // Make SweetAlert2 available globally
// app.config.globalProperties.$swal = Swal

// app.use(store)
// app.use(router)

// app.mount('#app')
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

// 🔍 debug startup logs
console.log('🧩 [main.js] starting app...')
console.log('📦 Store object:', store)
console.log('📦 Store modules:', store?._modulesNamespaceMap ? Object.keys(store._modulesNamespaceMap) : '❌ not found')

const app = createApp(App)
app.use(VueSweetalert2)
app.use(store)
app.use(router)
app.mount('#app')

console.log('🚀 [main.js] app mounted successfully!')

console.log('✅ Bootstrap JS loaded:', typeof bootstrap !== 'undefined')
