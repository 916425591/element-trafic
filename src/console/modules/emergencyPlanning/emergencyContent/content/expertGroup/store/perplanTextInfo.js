import * as types from '../constants/mutation-types'
import PerplanTextInfo from '../resource/perplanTextInfo'

const state = {
  list: [],
  total: 0
}

const actions = {
  getDoubleMirrorList({ commit, state }, params) {
    PerplanTextInfo.getDoubleMirrorList(params).then(response => {
     
    })
  }
}

const mutations = {
  [types.RECEIVE_MIRROR_BY_PAGE](state, { list }) {
    state.list = list
  },
  [types.RECEIVE_MIRROR_TOTAL](state, { total }) {
    state.total = parseInt(total, 10)
  }
}

export default {
  state,
  actions,
  mutations
}
