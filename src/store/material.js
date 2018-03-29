// 
import * as types from './constants/material-types'
import Refuge from './resource/material'
import axios from 'axios'


const state = {
    resTypeId: null,
    materialDetail: {
        id: null,
        name: '',
        code: '',
        region: {
            id: null,
            name: ''
        },
        location: '',
        unitName: '',
        canUseQuantity: '',
        affiliationOrg: {
            id: null,
            name: ''
        },
        materialsType: '',
        valid: null,
        function: ''
    },
    unitData:[],
    resourceTypeData:[],
    ds_edit: true
}

const actions = {
    saveMaterialResTypeId({ commit, state }, params) {
        const resTypeId =  params
        commit(types.MATERIAL_SAVE_RESTYPEID, { resTypeId })
    },
    saveMaterialDutyOrgId({ commit, state }, params) {
        const dutyOrgId =  params
        commit(types.MATERIAL_DUTY_ORG_ID, { dutyOrgId })
    },
    saveMaterialDetailData({ commit, state }, params) {
        const materialDetail =  params
        commit(types.MATERIAL_SAVE_DETAIL, { materialDetail })
    },
    getMaterialUnit ({ commit, state }, params) {
        axios({
            method: 'get',
            url: params.url,
            params: params.data
        }).then(
            response => {
                if(response.data.code === 200) {
                    const { data } = response.data;
                    commit(types.GET_MATERIAL_UNIT, { data });
                } else {
                }
            }
        ).catch( 
            error => {
                
            }
        )
    },
    getMaterialResourceType ({ commit, state }, params) {
        axios({
            method: 'post',
            url: params.url,
            data: params.data
        }).then(
            response => {
                if(response.data.code === 200) {
                    const { data } = response.data;
                    commit(types.GET_MATERIAL_RESOURCE_TYPE, { data });
                } else {
                }
            }
        ).catch( 
            error => {
                
            }
        )
    },
    changeEditStatus({ commit, state }, params) {
        const editStatue =  params
        commit(types.EDIT_STATUS, { editStatue })
    }
}

const mutations = {
    [types.MATERIAL_SAVE_RESTYPEID](state, { resTypeId }) {
        state.resTypeId = resTypeId
    },
    [types.MATERIAL_DUTY_ORG_ID](state, { dutyOrgId }) {
        state.materialDetail.dutyOrg.id = dutyOrgId
    },
    [types.MATERIAL_SAVE_DETAIL](state, { materialDetail }) {
        const res = materialDetail
        state.materialDetail = {
            id: res.id,
            name: res.name,
            code: res.code,
            region: {
                id: res.region ? res.region.id : null,
                name: res.region ? res.region.name : ''
            },
            location: res.location,
            unitName: res.unitName,
            unit: res.unit,
            canUseQuantity: res.canUseQuantity,
            dutyOrg:{
                id: res.dutyOrg ? res.dutyOrg.id : null,
                name: res.dutyOrg ? res.dutyOrg.name : ''
            },
            affiliationOrg: {
                id: res.affiliationOrg ? res.affiliationOrg.id : null,
                name: res.affiliationOrg ? res.affiliationOrg.name : ''
            },
            materialsType: res.materialsType,
            valid: res.valid,
            function: res.function
        }
    },
    [types.GET_MATERIAL_UNIT](state, { data }) {
        state.unitData = []
        data.forEach((v, i) => {
            state.unitData.push({
                value: parseInt(v.key),
                label: v.value
            })
        });
    },
    [types.GET_MATERIAL_RESOURCE_TYPE](state, { data }) {
        state.resourceTypeData = []
        state.resourceTypeData.push({
            value: 'null',
            label: '请选择'
        });
        data.forEach((v, i) => {
            state.resourceTypeData.push({
                value: parseInt(v.id),
                label: v.name
            })
        });
    },
    [types.EDIT_STATUS](state, { editStatue }) {
        state.ds_edit = editStatue
    },
}

export default {
  state,
  actions,
  mutations
}
