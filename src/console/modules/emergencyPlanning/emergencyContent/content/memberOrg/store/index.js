import Vue from 'vue'
import Vuex from 'vuex'
import memberOrg from './memberOrg'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV === 'development'

export default new Vuex.Store({
  modules: {
    memberOrg
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
