import * as types from '../memberOrg-types'

const state = {
  detail: ''
}

const actions = {
  saveMemberDetail({ commit, state }, params) {
    const detail = params;
    commit(types.TEAM_SAVE_DETAIL, { detail })
  }
}

const mutations = {
  [types.TEAM_SAVE_DETAIL](state, { detail }) {
    state.detail = detail
    console.log('detail',detail)
  }
}

export default {
  state,
  actions,
  mutations
}
