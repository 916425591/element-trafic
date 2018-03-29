import * as types from '../constants/mutation-types';
const state = {
    nodes:''
};
const actions = {
    // 保存知识类型类型
    saveLawTreeNode ({ commit, state }, params) {
        commit(types.SAVE_KNOWLEDGE_NODE, { params });
    },
};
const mutations = {
    // 保存知识类型类型
    [types.SAVE_KNOWLEDGE_NODE] (state, { params }) {
        state.nodes = params;
    }
};
export default {
    state,
    actions,
    mutations
};