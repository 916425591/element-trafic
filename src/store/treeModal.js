import * as types from './constants/treeModal-types'
// import Refuge from './resource/treeModal'


const state = {
    TreeInfo: ''
}

const actions = {
    saveDemoData({ commit, state }, params) {
        const TreeInfo = params
        console.log(TreeInfo,'TreeInfo')
        commit(types.SAVE_DATA, { TreeInfo })
    }
}

const mutations = {
    [types.SAVE_DATA](state, { TreeInfo }) {
        console.log(TreeInfo)
        state.TreeInfo = TreeInfo
        console.log(TreeInfo,'TreeInfo')
    }
}

export default {
  state,
  actions,
  mutations
}
