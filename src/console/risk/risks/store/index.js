// import Vue from 'vue'
// import Vuex from 'vuex'
// import laws from './laws'
// import createLogger from 'vuex/dist/logger'

// Vue.use(Vuex)

// const debug = process.env.NODE_ENV === 'development'

// export default new Vuex.Store({
//   modules: {
//     laws
//   },
//   strict: debug,
//   plugins: debug ? [createLogger()] : []
// })



import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
// import app from './modules/app'
// import user from './modules/user'
// import userCode from './userCode'

/** tree弹窗组件*/
import treeModal from './laws'
/**弹框 */
// import dialogs from './dialogs'

Vue.use(Vuex)

const debug = process.env.NODE_ENV === 'development'

export default new Vuex.Store({
  modules: {
    // userCode,
    // app,
    // user,
    treeModal
    // dialogs
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})


