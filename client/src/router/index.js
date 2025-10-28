// import { createRouter, createWebHistory } from 'vue-router'
// import store from '../store'

// // Social routes (public)
// import SocialHome from '../views/social/Home.vue'
// import ModelDetail from '../views/social/ModelDetail.vue'
// import Login from '../views/auth/Login.vue'
// import Register from '../views/auth/Register.vue'

// // User routes
// import UserDashboard from '../views/user/Dashboard.vue'
// import UserChat from '../views/user/Chat.vue'

// // Manager routes
// import ManagerDashboard from '../views/manager/Dashboard.vue'
// import ManagerModel from '../views/manager/Model.vue'
// import ManagerChats from '../views/manager/Chats.vue'

// // Admin routes
// import AdminDashboard from '../views/admin/Dashboard.vue'
// import AdminUsers from '../views/admin/Users.vue'
// import AdminModels from '../views/admin/Models.vue'
// import AdminChats from '../views/admin/Chats.vue'

// const routes = [
//     // Social routes (public)
//     {
//         path: '/',
//         name: 'SocialHome',
//         component: SocialHome
//     },
//     {
//         path: '/model/:id',
//         name: 'ModelDetail',
//         component: ModelDetail,
//         props: true
//     },
//     {
//         path: '/login',
//         name: 'Login',
//         component: Login
//     },
//     {
//         path: '/register',
//         name: 'Register',
//         component: Register
//     },

//     // User routes
//     {
//         path: '/user',
//         name: 'UserDashboard',
//         component: UserDashboard,
//         meta: { requiresAuth: true, role: 'USER' }
//     },
//     {
//         path: '/user/chat/:modelId?',
//         name: 'UserChat',
//         component: UserChat,
//         props: true,
//         meta: { requiresAuth: true, role: 'USER' }
//     },

//     // Manager routes
//     {
//         path: '/manager',
//         name: 'ManagerDashboard',
//         component: ManagerDashboard,
//         meta: { requiresAuth: true, role: 'MANAGER' }
//     },
//     {
//         path: '/manager/model',
//         name: 'ManagerModel',
//         component: ManagerModel,
//         meta: { requiresAuth: true, role: 'MANAGER' }
//     },
//     {
//         path: '/manager/chats',
//         name: 'ManagerChats',
//         component: ManagerChats,
//         meta: { requiresAuth: true, role: 'MANAGER' }
//     },

//     // Admin routes
//     {
//         path: '/admin',
//         name: 'AdminDashboard',
//         component: AdminDashboard,
//         meta: { requiresAuth: true, role: 'ADMIN' }
//     },
//     {
//         path: '/admin/users',
//         name: 'AdminUsers',
//         component: AdminUsers,
//         meta: { requiresAuth: true, role: 'ADMIN' }
//     },
//     {
//         path: '/admin/models',
//         name: 'AdminModels',
//         component: AdminModels,
//         meta: { requiresAuth: true, role: 'ADMIN' }
//     },
//     {
//         path: '/admin/chats',
//         name: 'AdminChats',
//         component: AdminChats,
//         meta: { requiresAuth: true, role: 'ADMIN' }
//     },

//     // Redirect to appropriate dashboard based on role
//     {
//         path: '/dashboard',
//         redirect: to => {
//             const user = store.getters.user
//             if (!user) return '/login'

//             switch (user.role) {
//                 case 'USER': return '/user'
//                 case 'MANAGER': return '/manager'
//                 case 'ADMIN': return '/admin'
//                 default: return '/'
//             }
//         }
//     },

//     // Catch all route
//     {
//         path: '/:pathMatch(.*)*',
//         redirect: '/'
//     }
// ]

// const router = createRouter({
//     history: createWebHistory(process.env.BASE_URL),
//     routes
// })

// // Navigation guards
// router.beforeEach((to, from, next) => {
//     const user = store.getters.user
//     const token = store.getters.token

//     // Check if route requires authentication
//     if (to.meta.requiresAuth) {
//         if (!token || !user) {
//             next('/login')
//             return
//         }

//         // Check role-based access
//         if (to.meta.role && user.role !== to.meta.role) {
//             // Redirect to appropriate dashboard
//             switch (user.role) {
//                 case 'USER': next('/user')
//                 case 'MANAGER': next('/manager')
//                 case 'ADMIN': next('/admin')
//                 default: next('/')
//             }
//             return
//         }
//     }

//     // Redirect authenticated users away from auth pages
//     if ((to.name === 'Login' || to.name === 'Register') && token && user) {
//         switch (user.role) {
//             case 'USER': next('/user')
//             case 'MANAGER': next('/manager')
//             case 'ADMIN': next('/admin')
//             default: next('/')
//         }
//         return
//     }

//     next()
// })

// export default router







// import { createRouter, createWebHistory } from 'vue-router'
// import store from '../store'

// // Public views
// import SocialHome from '../views/social/Home.vue'
// import ModelDetail from '../views/social/ModelDetail.vue'
// import Login from '../views/auth/Login.vue'
// import Register from '../views/auth/Register.vue'

// // User
// import UserDashboard from '../views/user/Dashboard.vue'
// import UserChat from '../views/user/Chat.vue'

// // Manager
// import ManagerDashboard from '../views/manager/Dashboard.vue'
// import ManagerModel from '../views/manager/Model.vue'
// import ManagerChats from '../views/manager/Chats.vue'

// // Admin
// import AdminDashboard from '../views/admin/Dashboard.vue'
// import AdminUsers from '../views/admin/Users.vue'
// import AdminModels from '../views/admin/Models.vue'
// import AdminChats from '../views/admin/Chats.vue'

// const routes = [
//     { path: '/', name: 'SocialHome', component: SocialHome },
//     { path: '/model/:id', name: 'ModelDetail', component: ModelDetail, props: true },
//     { path: '/login', name: 'Login', component: Login },
//     { path: '/register', name: 'Register', component: Register },

//     // User routes
//     { path: '/user', name: 'UserDashboard', component: UserDashboard, meta: { requiresAuth: true, role: 'USER' } },
//     { path: '/user/chat/:modelId?', name: 'UserChat', component: UserChat, props: true, meta: { requiresAuth: true, role: 'USER' } },

//     // Manager routes
//     { path: '/manager', name: 'ManagerDashboard', component: ManagerDashboard, meta: { requiresAuth: true, role: 'MANAGER' } },
//     { path: '/manager/model', name: 'ManagerModel', component: ManagerModel, meta: { requiresAuth: true, role: 'MANAGER' } },
//     { path: '/manager/chats', name: 'ManagerChats', component: ManagerChats, meta: { requiresAuth: true, role: 'MANAGER' } },

//     // Admin routes
//     { path: '/admin', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAuth: true, role: 'ADMIN' } },
//     { path: '/admin/users', name: 'AdminUsers', component: AdminUsers, meta: { requiresAuth: true, role: 'ADMIN' } },
//     { path: '/admin/models', name: 'AdminModels', component: AdminModels, meta: { requiresAuth: true, role: 'ADMIN' } },
//     { path: '/admin/chats', name: 'AdminChats', component: AdminChats, meta: { requiresAuth: true, role: 'ADMIN' } },

//     // Catch all
//     { path: '/:pathMatch(.*)*', redirect: '/' }
// ]

// const router = createRouter({
//     history: createWebHistory(),
//     routes
// })

// // ✅ FIXED NAV GUARD — now guaranteed not to hang
// router.beforeEach((to, from, next) => {
//     const user = store.getters['auth/user']
//     const token = store.getters['auth/token']

//     console.log('🧭 [router] navigating to:', to.path)
//     console.log('🧭 [router] user:', user)
//     console.log('🧭 [router] token:', token)

//     // if route requires auth and no token → redirect to login
//     if (to.meta.requiresAuth && (!token || !user)) {
//         alert('⛔ No token or user found — redirecting to /login')
//         return next('/login')
//     }

//     // if route requires specific role and user doesn’t match → redirect
//     if (to.meta.requiresAuth && to.meta.role && user?.role !== to.meta.role) {
//         alert(`⚠️ Role mismatch: ${user.role} cannot access ${to.path}`)
//         switch (user.role) {
//             case 'USER':
//                 return next('/user')
//             case 'MANAGER':
//                 return next('/manager')
//             case 'ADMIN':
//                 return next('/admin')
//             default:
//                 return next('/')
//         }
//     }

//     // prevent logged-in users from returning to login/register
//     if ((to.name === 'Login' || to.name === 'Register') && token && user) {
//         switch (user.role) {
//             case 'USER': return next('/user')
//             case 'MANAGER': return next('/manager')
//             case 'ADMIN': return next('/admin')
//             default: return next('/')
//         }
//     }

//     next()
// })

// export default router
import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

// Public views
import SocialHome from '../views/social/Home.vue'
import ModelDetail from '../views/social/ModelDetail.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'

// User views
import UserDashboard from '../views/user/Dashboard.vue'
import UserChat from '../views/user/Chat.vue'

// Manager views
import ManagerDashboard from '../views/manager/Dashboard.vue'
import ManagerModel from '../views/manager/Model.vue'
import ManagerChats from '../views/manager/Chats.vue'

// Admin views
import AdminDashboard from '../views/admin/Dashboard.vue'
import AdminUsers from '../views/admin/Users.vue'
import AdminModels from '../views/admin/Models.vue'
import AdminChats from '../views/admin/Chats.vue'

const routes = [
    { path: '/', name: 'SocialHome', component: SocialHome },
    { path: '/model/:id', name: 'ModelDetail', component: ModelDetail, props: true },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },

    // User routes
    { path: '/user', name: 'UserDashboard', component: UserDashboard, meta: { requiresAuth: true, role: 'USER' } },
    { path: '/user/chat/:modelId?', name: 'UserChat', component: UserChat, props: true, meta: { requiresAuth: true, role: 'USER' } },

    // Manager routes
    { path: '/manager', name: 'ManagerDashboard', component: ManagerDashboard, meta: { requiresAuth: true, role: 'MANAGER' } },
    { path: '/manager/model', name: 'ManagerModel', component: ManagerModel, meta: { requiresAuth: true, role: 'MANAGER' } },
    { path: '/manager/chats', name: 'ManagerChats', component: ManagerChats, meta: { requiresAuth: true, role: 'MANAGER' } },

    // Admin routes
    { path: '/admin', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAuth: true, role: 'ADMIN' } },
    { path: '/admin/users', name: 'AdminUsers', component: AdminUsers, meta: { requiresAuth: true, role: 'ADMIN' } },
    { path: '/admin/models', name: 'AdminModels', component: AdminModels, meta: { requiresAuth: true, role: 'ADMIN' } },
    { path: '/admin/chats', name: 'AdminChats', component: AdminChats, meta: { requiresAuth: true, role: 'ADMIN' } },

    // Catch all
    { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// ✅ Navigation guards (fixed)
router.beforeEach((to, from, next) => {
    const user = store.getters['auth/user']
    const token = store.getters['auth/token']

    // Logout case: allow going to /login without blocking
    if (to.path === '/login' && from.path.startsWith('/admin')) {
        store.dispatch('auth/logout')
        return next()
    }

    // If route needs auth
    if (to.meta.requiresAuth) {
        if (!token || !user) {
            return next('/login')
        }

        // Role mismatch
        if (to.meta.role && user.role !== to.meta.role) {
            switch (user.role) {
                case 'USER': return next('/user')
                case 'MANAGER': return next('/manager')
                case 'ADMIN': return next('/admin')
                default: return next('/')
            }
        }
    }

    // Prevent logged-in users from returning to auth pages
    if ((to.name === 'Login' || to.name === 'Register') && token && user) {
        switch (user.role) {
            case 'USER': return next('/user')
            case 'MANAGER': return next('/manager')
            case 'ADMIN': return next('/admin')
            default: return next('/')
        }
    }

    next()
})

export default router
