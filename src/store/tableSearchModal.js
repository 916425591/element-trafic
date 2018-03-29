import * as types from './constants/tableSelect-type'


const state = {
    tableInfo: ''
}

const actions = {
    saveTableData({ commit, state }, params) {
        const tableInfo = params
        commit(types.SAVE_TABLE_DATA, { tableInfo })
    }
}

const mutations = {
    [types.SAVE_TABLE_DATA](state, { tableInfo }) {
        state.tableInfo = tableInfo
    }
}

export default {
  state,
  actions,
  mutations
}
