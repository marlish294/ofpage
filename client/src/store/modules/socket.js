import { io } from 'socket.io-client'

const state = {
    socket: null,
    connected: false,
    messages: {},
    currentChat: null
}

const mutations = {
    SET_SOCKET(state, socket) {
        state.socket = socket
    },
    SET_CONNECTED(state, connected) {
        state.connected = connected
    },
    SET_CURRENT_CHAT(state, modelId) {
        state.currentChat = modelId
    },
    ADD_MESSAGE(state, { modelId, message }) {
        if (!state.messages[modelId]) {
            state.messages[modelId] = []
        }
        state.messages[modelId].push(message)
    },
    SET_MESSAGES(state, { modelId, messages }) {
        state.messages[modelId] = messages
    },
    CLEAR_MESSAGES(state) {
        state.messages = {}
    }
}

const actions = {
    connectSocket({ commit, state, rootGetters }) {
        if (state.socket) return

        const token = rootGetters['auth/token']
        if (!token) {
            console.log('No token available for socket connection')
            return
        }

        console.log('Connecting to socket with token:', token.substring(0, 10) + '...')

        const socket = io('http://localhost:3000', {
            auth: { token },
            transports: ['websocket', 'polling']
        })

        socket.on('connect', () => {
            console.log('Socket connected successfully')
            commit('SET_CONNECTED', true)
        })

        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason)
            commit('SET_CONNECTED', false)
        })

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error)
        })

        socket.on('new_message', (message) => {
            console.log('Received new message:', message)
            commit('ADD_MESSAGE', {
                modelId: message.model?.id,
                message
            })
        })

        socket.on('error', (error) => {
            console.error('Socket error:', error)
        })

        commit('SET_SOCKET', socket)
    },

    disconnectSocket({ commit, state }) {
        if (state.socket) {
            state.socket.disconnect()
            commit('SET_SOCKET', null)
            commit('SET_CONNECTED', false)
        }
    },

    joinChat({ state }, data) {
        if (state.socket) {
            state.socket.emit('join_chat', data)
        }
    },

    leaveChat({ state }, data) {
        if (state.socket) {
            state.socket.emit('leave_chat', data)
        }
    },

    sendMessage({ state }, { modelId, content }) {
        if (state.socket) {
            state.socket.emit('send_message', { modelId, content })
        }
    },

    getChatHistory({ state }, { modelId, limit = 50, offset = 0 }) {
        if (state.socket) {
            state.socket.emit('get_chat_history', { modelId, limit, offset })
        }
    },

    setCurrentChat({ commit }, modelId) {
        commit('SET_CURRENT_CHAT', modelId)
    }
}

const getters = {
    socket: state => state.socket,
    connected: state => state.connected,
    currentChat: state => state.currentChat,
    messages: state => state.messages,
    getMessagesForModel: state => modelId => {
        return state.messages[modelId] || []
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
