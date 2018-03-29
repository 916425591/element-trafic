import * as types from './constants/dialogs-types';

const state = {
    tableModalInfo: ''
};
const actions = {
    setTabelModalInfo ({ commit, state }, params) {
        commit(types.SET_TABLE_MODAL_INFO, { params });
    }
};
const mutations = {
    [types.SET_TABLE_MODAL_INFO] (state, { params }) {
        state.tableModalInfo = params;
        console.log('dasdasasd',params)
    }
};

export default {
    state,
    actions,
    mutations
};
