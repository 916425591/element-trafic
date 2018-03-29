import * as types from '../constants/centerWork-types';
import Classify from '../resource/centerWork';

const state = {
    tableInfo: '',
    incident: '',
    detail: '',
    nodes: '',
    resourceData: ''
};

const actions = {
    saveScdTableData({ commit, state }, params) {
        commit(types.SAVE_DATA, { tableInfo })
    },
    saveWrongCenter({ commit, state }, params) {
        const incident = params
        commit(types.SAVE_INCIDENT_DATA, { incident })
    },
    saveIncidentDetail({ commit, state }, params) {
        const detail = params
        commit(types.SAVE_INCIDENT_DETAIL, { detail })
    },
    saveNodes({ commit, state }, params) {
        commit(types.SAVE_NODES, { params })
    },
    saveResourceData({ commit, state }, params) {
        commit(types.RESOURCE_DATA, { params })
    }
};

const mutations = {
    [types.SAVE_DATA](state, { tableInfo }) {
        state.tableInfo = tableInfo
    },
    [types.SAVE_INCIDENT_DATA](state, { incident }) {
        state.incident = incident
    },
    [types.SAVE_INCIDENT_DETAIL](state, { detail }) {
        state.detail = detail
    },
    [types.SAVE_NODES](state, { params }) {
        state.nodes = params
    },
    [types.RESOURCE_DATA](state, { params }) {
        state.resourceData = params
    }
};

export default {
    state,
    actions,
    mutations
};
