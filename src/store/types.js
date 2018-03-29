import * as types from './constants/types-types';
const state = {
    editStatus: true
};
const actions = {
    // 类型类型
    saveTypesType ({ commit, state }, params) {
        commit(types.SET_TYPE_STATUS, { params });
    }
};
const mutations = {
    // 类型类型
    [types.SET_TYPE_STATUS] (state, { params }) {
        state.editStatus = params;
    }
};
export default {
    state,
    actions,
    mutations
} ;