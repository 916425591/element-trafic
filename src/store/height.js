import * as types from './constants/height-types';

const state = {
  height: '100%',
  tableInfo: {
    numberBranches: 0,//条数
    tableHeight: 0 //table高度
  },
  tableInfoIndex: { //内容页面的左侧tree结构
    numberBranches: 0,//条数
    tableHeight: 0 //table高度
  }
};

const actions = {
  setHeightContent ({ commit, state }, params) {
    commit(types.HEIGHT_CONTENT, { params });
  },
  tableHeightMessage({ commit, state }, params) {
    commit(types.TABLE_HEIGHT, { params });
  },
  tableHeightMessageIndex({ commit, state }, params) {
    commit(types.TABLE_HEIGHT_INDEX, { params });
  }
};

const mutations = {
  [types.HEIGHT_CONTENT] (state, { params }) {
    state.height = params;
  },
  [types.TABLE_HEIGHT] (state, { params }) {
    const h = state.height
    state.tableInfo.tableHeight = (h - 100 - params) + 'px'
    state.tableInfo.numberBranches = parseInt((h - 100 - params) / 50) - 2
  },
  [types.TABLE_HEIGHT_INDEX] (state, { params }) {
    const h = state.height
    state.tableInfoIndex.tableHeight = (h - 100 - params) + 'px'
    state.tableInfoIndex.numberBranches = parseInt((h - 100 - params) / 50) - 2
  }
};

export default {
  state,
  actions,
  mutations
};
