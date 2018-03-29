import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

/** tree弹窗组件*/
import treeModal from './laws'
/**弹框 */
// import dialogs from './dialogs'

Vue.use(Vuex)

const debug = process.env.NODE_ENV === 'development'

export default new Vuex.Store({
  modules: {
    treeModal
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})


