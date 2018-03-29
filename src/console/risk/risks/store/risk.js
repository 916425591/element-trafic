import * as types from '../constants/mutation-types';


const state = {
    riskTypeNode:''
};

const actions = {
    // 保存类型
    saveRiskTreeNode ({ commit, state }, params) {
        commit(types.RISK_TYPE_NODE, { params });
    },
};

const mutations = {
    // 保存类型
    [types.RISK_TYPE_NODE] (state, { params }) {
        state.riskTypeNode = params;
    }
};

export default {
    state,
    actions,
    mutations
};
