import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

import centerWork from './eduty'

Vue.use(Vuex)

const debug = process.env.NODE_ENV === 'development'

export default new Vuex.Store({
  modules: {
    centerWork
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})


