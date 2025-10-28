// import api from '../../services/api'

// const state = {
//     user: null,
//     token: localStorage.getItem('token'),
//     loading: false,
//     error: null
// }

// const mutations = {
//     SET_LOADING(state, loading) {
//         state.loading = loading
//     },
//     SET_ERROR(state, error) {
//         state.error = error
//     },
//     SET_USER(state, user) {
//         state.user = user
//     },
//     SET_TOKEN(state, token) {
//         state.token = token
//         if (token) {
//             localStorage.setItem('token', token)
//         } else {
//             localStorage.removeItem('token')
//         }
//     },
//     CLEAR_AUTH(state) {
//         state.user = null
//         state.token = null
//         state.error = null
//         localStorage.removeItem('token')
//     }
// }

// const actions = {
//     async login({ commit }, credentials) {
//         commit('SET_LOADING', true)
//         commit('SET_ERROR', null)

//         try {
//             const response = await api.post('/auth/login', credentials)
//             const { token, user } = response.data

//             commit('SET_TOKEN', token)
//             commit('SET_USER', user)

//             // Set default authorization header
//             api.defaults.headers.common['Authorization'] = `Bearer ${token}`

//             return { success: true, user }
//         } catch (error) {
//             const message = error.response?.data?.message || 'Login failed'
//             commit('SET_ERROR', message)
//             return { success: false, error: message }
//         } finally {
//             commit('SET_LOADING', false)
//         }
//     },

//     async register({ commit }, userData) {
//         commit('SET_LOADING', true)
//         commit('SET_ERROR', null)

//         try {
//             const response = await api.post('/auth/register', userData)
//             return { success: true, data: response.data }
//         } catch (error) {
//             const message = error.response?.data?.message || 'Registration failed'
//             commit('SET_ERROR', message)
//             return { success: false, error: message }
//         } finally {
//             commit('SET_LOADING', false)
//         }
//     },

//     async getCurrentUser({ commit, state }) {
//         if (!state.token) return { success: false }

//         try {
//             const response = await api.get('/auth/me')
//             const { user } = response.data

//             commit('SET_USER', user)
//             return { success: true, user }
//         } catch (error) {
//             commit('CLEAR_AUTH')
//             return { success: false }
//         }
//     },

//     async changePassword({ commit }, passwordData) {
//         commit('SET_LOADING', true)
//         commit('SET_ERROR', null)

//         try {
//             await api.post('/auth/change-password', passwordData)
//             return { success: true }
//         } catch (error) {
//             const message = error.response?.data?.message || 'Password change failed'
//             commit('SET_ERROR', message)
//             return { success: false, error: message }
//         } finally {
//             commit('SET_LOADING', false)
//         }
//     },

//     logout({ commit }) {
//         commit('CLEAR_AUTH')
//         delete api.defaults.headers.common['Authorization']
//     },

//     clearError({ commit }) {
//         commit('SET_ERROR', null)
//     }
// }

// const getters = {
//     user: state => state.user,
//     token: state => state.token,
//     isAuthenticated: state => !!state.token && !!state.user,
//     loading: state => state.loading,
//     error: state => state.error,
//     isUser: state => state.user?.role === 'USER',
//     isManager: state => state.user?.role === 'MANAGER',
//     isAdmin: state => state.user?.role === 'ADMIN'
// }

// export default {
//     namespaced: true,
//     state,
//     mutations,
//     actions,
//     getters
// }
alert('💾 auth.js module loaded ✅')
console.log('💾 [auth.js] module loaded ✅')

import api from '../../services/api'

// --------------------
// 🔹 STATE
// --------------------

const state = {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null
}

// ... keep rest of your code


// --------------------
// 🔹 MUTATIONS
// --------------------
const mutations = {
    SET_LOADING(state, loading) {
        state.loading = loading
    },
    SET_ERROR(state, error) {
        state.error = error
    },
    SET_USER(state, user) {
        state.user = user
    },
    SET_TOKEN(state, token) {
        state.token = token
        if (token) {
            localStorage.setItem('token', token)
        } else {
            localStorage.removeItem('token')
        }
    },
    CLEAR_AUTH(state) {
        state.user = null
        state.token = null
        state.error = null
        localStorage.removeItem('token')
    }
}

// --------------------
// 🔹 ACTIONS
// --------------------
const actions = {
    async login({ commit }, credentials) {
        console.log('🚀 [auth.js] login action triggered:', credentials)  // 🧩 add this line here

        commit('SET_LOADING', true)
        commit('SET_ERROR', null)

        try {
            console.log('🟢 [auth.js] Sending login request...', credentials)

            const response = await api.post('/auth/login', credentials)
            console.log('🧩 [auth.js] /auth/login response:', response.data)

            const { token, user } = response.data || {}

            if (!token || !user) {
                throw new Error('Invalid backend response: missing token or user')
            }

            // Save to store
            commit('SET_TOKEN', token)
            commit('SET_USER', user)

            // Attach token globally for API calls
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            console.log('✅ [auth.js] Login committed successfully →', user.role)

            // Return explicit object to Login.vue
            return { success: true, user }

        } catch (error) {
            console.error('💥 [auth.js] Login error:', error)
            const message = error.response?.data?.message || error.message || 'Login failed'
            commit('SET_ERROR', message)
            return { success: false, error: message }

        } finally {
            commit('SET_LOADING', false)
        }
    },

    async register({ commit }, userData) {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)

        try {
            const response = await api.post('/auth/register', userData)
            return { success: true, data: response.data }
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed'
            commit('SET_ERROR', message)
            return { success: false, error: message }
        } finally {
            commit('SET_LOADING', false)
        }
    },

    async getCurrentUser({ commit, state }) {
        if (!state.token) return { success: false }

        try {
            const response = await api.get('/auth/me')
            const { user } = response.data
            commit('SET_USER', user)
            return { success: true, user }
        } catch (error) {
            commit('CLEAR_AUTH')
            return { success: false }
        }
    },

    async changePassword({ commit }, passwordData) {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)

        try {
            await api.post('/auth/change-password', passwordData)
            return { success: true }
        } catch (error) {
            const message = error.response?.data?.message || 'Password change failed'
            commit('SET_ERROR', message)
            return { success: false, error: message }
        } finally {
            commit('SET_LOADING', false)
        }
    },

    logout({ commit, dispatch }) {
        console.log('Logging out user...')

        // Clear auth state
        commit('CLEAR_AUTH')

        // Clear API authorization header
        delete api.defaults.headers.common['Authorization']

        // Disconnect socket if connected
        dispatch('socket/disconnectSocket', null, { root: true })

        console.log('User logged out successfully')
    },

    clearError({ commit }) {
        commit('SET_ERROR', null)
    }
}

// --------------------
// 🔹 GETTERS
// --------------------
const getters = {
    user: state => state.user,
    token: state => state.token,
    isAuthenticated: state => !!state.token && !!state.user,
    loading: state => state.loading,
    error: state => state.error,
    isUser: state => state.user?.role === 'USER',
    isManager: state => state.user?.role === 'MANAGER',
    isAdmin: state => state.user?.role === 'ADMIN'
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
