import * as types from '../constants/mutation-types';
const state = {
    nodes:''
};
const actions = {
    // 保存化学品类型类型
    saveTreeNode ({ commit, state }, params) {
        commit(types.SAVE_CHEMICAL_NODE, { params });
    },
};
const mutations = {
    // 保存化学品类型类型
    [types.SAVE_CHEMICAL_NODE] (state, { params }) {
        state.nodes = params;
    }
};
export default {
    state,
    actions,
    mutations
};