import * as types from '../constants/mutation-types';


const state = {
    riskHiddenDangerTypeNode:''
};

const actions = {
    // 保存类型
    saveRiskHiddenDangerTreeNode ({ commit, state }, params) {
        commit(types.RISK_TYPE_HIDDEN_DANGER_NODE, { params });
    },
};

const mutations = {
    // 保存类型
    [types.RISK_TYPE_HIDDEN_DANGER_NODE] (state, { params }) {
        state.riskHiddenDangerTypeNode = params;
    }
};

export default {
    state,
    actions,
    mutations
};
