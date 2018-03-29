import Vue from 'vue'
import Vuex from 'vuex'
import perplanTextInfo from './perplanTextInfo'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV === 'development'

export default new Vuex.Store({
  modules: {
    perplanTextInfo
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
