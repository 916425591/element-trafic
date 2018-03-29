import * as types from '../constants/mutation-types';


const state = {
    protectTargetTypeNode:''
};

const actions = {
    // 保存类型
    saveProtectTargetTreeNode ({ commit, state }, params) {
        commit(types.PROTECT_TARGET_TYPE_NODE, { params });
    },
};

const mutations = {
    // 保存类型
    [types.PROTECT_TARGET_TYPE_NODE] (state, { params }) {
        state.protectTargetTypeNode = params;
    }
};

export default {
    state,
    actions,
    mutations
};
