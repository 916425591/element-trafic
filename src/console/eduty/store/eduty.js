import * as types from '../constants/eduty-types';
import Classify from '../resource/eduty';

const state = {
    tableInfo: '',
    wrokItem: '',
    planInfo: '',
    notice: ''
};

const actions = {
    saveEdutyTableData({ commit, state }, params) {
        commit(types.EDUTY_TABLE_LIST, { params })
    },
    saveEdutyWorkItem({ commit, state }, params) {
        commit(types.EDUTY_TABLE_WORK_ITEM, { params })
    },
    saveEdutyPlan({ commit, state }, params) {
        commit(types.EDUTY_PLAN_INFO, { params })
    },
    saveEdutyNoctice({ commit, state }, params) {
        commit(types.EDUTY_NOTICE_INFO, { params })
    },
};

const mutations = {
    [types.EDUTY_TABLE_LIST](state, { params }) {
        state.tableInfo = params
    },
    [types.EDUTY_TABLE_WORK_ITEM](state, { params }) {
        state.wrokItem = params
    },
    [types.EDUTY_PLAN_INFO](state, { params }) {
        state.planInfo = params
    },
    [types.EDUTY_NOTICE_INFO](state, { params }) {
        state.notice = params
    }
};

export default {
    state,
    actions,
    mutations
};
