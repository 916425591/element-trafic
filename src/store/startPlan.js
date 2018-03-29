import * as types from './constants/startPlan-types';
import Classify from './resource/startPlan';

const state = {
    detail: ''
};

const actions = {
    saveStartPlanDetail({ commit, state }, params) {
        console.log('dasdas',params)
        const detail = params
        commit(types.SAVE_START_PLAN_DETAIL, { detail })
    }
};

const mutations = {
    [types.SAVE_START_PLAN_DETAIL](state, { detail }) {
        state.detail = detail
    }
};

export default {
    state,
    actions,
    mutations
};
