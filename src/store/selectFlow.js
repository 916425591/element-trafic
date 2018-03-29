import * as types from './constants/selectFlow-types'


const state = {
    selectNode: '',
    selectWork: '',
    selectContent: ''
}

const actions = {
    getSelectFlowNode({ commit, state }, params) {
        console.log(params, 'getSelectFlowNode')
        const selectNode = params
        commit(types.GET_SELECT_FLOW_NODE, { selectNode })
    },
    getSelectFlowWork({ commit, state }, params) {
        const selectWork = params
        commit(types.GET_SELECT_FLOW_WORK, { selectWork })
    },
    getSelectFlowCOntent({ commit, state }, params) {
        const selectContent = params
        commit(types.GET_SELECT_FLOW_CONTENT, { selectContent })
    }
}

const mutations = {
    [types.GET_SELECT_FLOW_NODE](state, { selectNode }) {
        state.selectNode = selectNode
    },
    [types.GET_SELECT_FLOW_WORK](state, { selectWork }) {
        state.selectWork = selectWork
    },
    [types.GET_SELECT_FLOW_CONTENT](state, { selectContent }) {
        state.selectContent = selectContent
    }
}

export default {
  state,
  actions,
  mutations
}
