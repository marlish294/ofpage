// import { createStore } from 'vuex'
// import auth from './modules/auth'
// import socket from './modules/socket'

// export default createStore({
//     modules: {
//         auth,
//         socket
//     }
// })
import { createStore } from 'vuex'
import auth from './modules/auth'

console.log('🧠 [store/index.js] Vuex store initialized ✅')
alert('🧠 Vuex store initialized ✅ (from index.js)') // 🧩 Force visible popup

const store = createStore({
    modules: {
        auth
    }
})

export default store
