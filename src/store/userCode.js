import * as types from './constants/userCode-types';
import Main from '@/common/components/console-layout/Main.vue';


const state = {
  userCode: '19',
  // url: '//10.168.4.198:8080',
  //url: '//10.168.4.198:8080', //可用
   // url: '//10.168.4.240:9103', //BOB
    urlChina:'//10.168.4.181:9103',//华
    urlDong:'//10.168.4.174:9102',//董
  url: '//10.168.4.181:9102',//勇
  planId: null,
  oldPathurl: 'http://www.baidu.com/',
  quartersType: null,
  contentNodeId: null,
  dsMap:'',
    globalWidht:'',
    globalHeight:'',
    globaShrink:true
};

const actions = {
  SetPlanId ({ commit, state }, params) {
    commit(types.SET_PLAN_ID, { params });
  },
  setContentNodeId({ commit, state }, params) {
    commit(types.SET_CONTENT_NODE_ID, { params });
  },
  setQuarteryType({ commit, state }, params) {
    commit(types.SET_QUARTER_TYPE, { params });
  },
  setUserCode({ commit, state }, params) {
    commit(types.SET_USER_CODE, { params });
  }
};

const mutations = {
  [types.SET_PLAN_ID] (state, { params }) {
    state.planId = params;
  },
  [types.SET_CONTENT_NODE_ID] (state, { params }) {
    state.contentNodeId = params;
  },
  [types.SET_QUARTER_TYPE] (state, { params }) {
    state.quartersType = params;
  },
  [types.SET_USER_CODE] (state, { params }) {
    state.userCode = params;
  }
};

export default {
  state,
  actions,
  mutations
};
