import * as types from './constants/resource-types'
import Refuge from './resource/resourceType'
import axios from 'axios'

const state = {
  resourcesList: '',
  detail: '1',
  id: '',
  resourceTypeData:[]
}

const actions = {
  queryResourcesList({ commit, state }, params) {    
      Refuge.queryResourcesList(params).then(response => {
        const resourcesList = response.data.data
        commit(types.RESOURCE_TYPE_LIST, { resourcesList })
      })
  },
  queryResourcesDetail({ commit, state }, params) {
    Refuge.queryResourcesDetail(params).then(response => {
      const detail = response.data
      
      commit(types.RESOURCE_TYPE_DETAIL, { detail })
    })
  },
  saveResourceTypeTree({ commit, state }, params) {
    const { id } = params
    commit(types.DEMO_SAVE_DATA, { id })
  },
  getResourceResourceType ({ commit, state }, params) {
    axios({
        method: 'post',
        url: params.url,
        data: params.data
    }).then(
        response => {
            if(response.data.code === 200) {
                const { data } = response.data;
                commit(types.GET_RESOURCE_RESOURCE_TYPE, { data });
            } else {
            }
        }
    ).catch( 
        error => {
            
        }
    )
},
}

const mutations = {
  [types.RESOURCE_TYPE_LIST](state, { resourcesList }) {
    state.resourcesList = resourcesList
  },
  [types.RESOURCE_TYPE_DETAIL](state, { detail }) {
    state.detail = detail
  },
  [types.DEMO_SAVE_DATA](state, { id }) {
    state.id = id
  },
  [types.GET_RESOURCE_RESOURCE_TYPE](state, { data }) {
    state.resourceTypeData = []
    state.resourceTypeData.push({
      value: 'null',
      label: '请选择'
    });
    data.forEach((v, i) => {
        state.resourceTypeData.push({
            value: parseInt(v.category),
            label: v.name
        })
    });
  }
}

export default {
  state,
  actions,
  mutations
}
