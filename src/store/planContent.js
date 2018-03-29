import * as types from './constants/planContent-types'
import axios from 'axios'
const state = {
  total: 0,
  list: [],
  status: null,
  planType: {
    title: '',
    code: '',
    id: null,
    parentName: '',
    switchStatus: true,
    parentId: null
  },
  planStatus: true,
  planDetail: '',
  showMes: null,
  publishPlanId: null,
  publishNodeId: null,
  planContentId: ''
}

const actions = {
  setSearchInformation({ commit, state }, params) {
    axios({
      method: 'post',
      url: params.url,
      data: params.data
    }).then(
      response => {
        if(response.data.code === 200) {
          const res = response.data.data
          const total = res.total
          const list = res.list
          commit(types.SET_SEARCH_INFOMATION_TOTAL, { total })
          commit(types.SET_SEARCH_INFOMATION_LIST, { list })
        } else {
          this.$Message.error(response.data.message)
        }
      }
    ).catch( 
      error => {
      }
    )
  },
  setStatus({ commit, state }, params) {
    const status = params
    commit(types.SET_PLAN_SUBMIT_STATUS, { status });
  },
  changeListNode({ commit, state }, params) {
    const data = params
    commit(types.CHANGE_LIST_NODE, { data });
  },
  setPlanType({ commit, state }, params) {
    const data = params
    commit(types.SET_PLAN_TYPE, { data });
  },
  setPlanTypeStatus({ commit, state }, params) {
    const data = params
    commit(types.SET_PLAN_TYPE_STATUS, { data });
  },
  savePlanCaseInfo({ commit, state }, params) {
    const data = params
    commit(types.SAVE_PLAN_DETAIL, { data });
  },
  setShowMessage({ commit, state }, params) {
    const data = params
    commit(types.SET_SHOW_MESSAGE, { data });
  },
  savePublishPlanId({ commit, state }, params) {
      const data = params
      commit(types.SAVE_PUBLISH_PLAN_ID, { data });
  },
  savePublishNodeId({ commit, state }, params) {
      const data = params
      commit(types.SAVE_PUBLISH_NODE_ID, { data });
  },
  savePlanContentId({ commit, state }, params) {
    const data = params
    commit(types.SAVE_CONTENT_PLAN_ID, { data });
}
}

const mutations = {
  [types.SET_SEARCH_INFOMATION_TOTAL] (state, { total }) {
    state.total = parseInt(total)
  },
  [types.SET_SEARCH_INFOMATION_LIST] (state, { list }) {
    state.list = list
  },
  [types.SET_PLAN_SUBMIT_STATUS] (state, { status }) {
    state.status = status
  },
  [types.CHANGE_LIST_NODE] (state, { data }) {
    const oldList = state.list
    oldList.forEach((v, i) => {
      if(data.id === v.id){
        oldList[i].id = data.id,
        oldList[i].name = data.name,
        oldList[i].keyWords = data.keyWords,
        oldList[i].chiefEditOrgName = data.org,
        oldList[i].chiefEditOrg = data.orgId,
        oldList[i].incidentTypeName = data.type,
        oldList[i].incidentTypeId = data.typeId,
        oldList[i].regionId = data.areaId,
        oldList[i].planTypeId = data.planTypeId,
        oldList[i].planTypeName = data.planType,
        oldList[i].incidentLevelId = data.incidentLevelId,
        oldList[i].incidentLevelName = data.incidentLevelName
      }
    });
  },
  [types.SET_PLAN_TYPE] (state, { data }) {
    state.planType = {
      title: data.title ? data.title : '',
      code: data.code ? data.code : '',
      id: data.id ? data.id : '',
      parentName: data.parentName ? data.parentName : '',
      switchStatus: data.switchStatus ? data.switchStatus : '',
      parentId: data.parentId ? data.parentId : ''
    }
  },
  [types.SET_PLAN_TYPE_STATUS] (state, { data }) {
    state.planStatus = data
  },
  [types.SAVE_PLAN_DETAIL] (state, { data }) {
    state.planDetail = data
  },
  [types.SET_SHOW_MESSAGE] (state, { data }) {
    state.showMes = data
  },
  [types.SAVE_PUBLISH_PLAN_ID] (state, { data }) {
      state.publishPlanId = data
  },
  [types.SAVE_PUBLISH_NODE_ID] (state, { data }) {
      state.publishNodeId = data
  },
  [types.SAVE_CONTENT_PLAN_ID] (state, { data }) {
      state.planContentId = data
  }
}

export default {
  state,
  actions,
  mutations
};
