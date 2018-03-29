import * as types from './constants/equipment-types'
import Refuge from './resource/equipment'
import axios from 'axios'


const state = {
    resTypeId: null,
    equipmentDetail: {
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
        dutyOrg:{
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
    saveEquipmentResTypeId({ commit, state }, params) {
        const resTypeId =  params
        commit(types.EQUIPMENT_SAVE_RESTYPEID, { resTypeId })
    },
    saveEquipmentDutyOrgId({ commit, state }, params) {
        const dutyOrgId =  params
        commit(types.EQUIPMENT_DUTY_ORG_ID, { dutyOrgId })
    },
    saveEquipmentDetailData({ commit, state }, params) {
        const equipmentDetail =  params
        commit(types.EQUIPMENT_SAVE_DETAIL, { equipmentDetail })
    },
    getEquipmentUnit ({ commit, state }, params) {
        axios({
            method: 'get',
            url: params.url,
            params: params.data
        }).then(
            response => {
                if(response.data.code === 200) {
                    const { data } = response.data;
                    commit(types.GET_EQUIPMENT_UNIT, { data });
                } else {
                }
            }
        ).catch( 
            error => {
                
            }
        )
    },
    getEquipmentResourceType ({ commit, state }, params) {
        axios({
            method: 'post',
            url: params.url,
            data: params.data
        }).then(
            response => {
                if(response.data.code === 200) {
                    const { data } = response.data;
                    commit(types.GET_EQUIPMENT_RESOURCE_TYPE, { data });
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
    [types.EQUIPMENT_SAVE_RESTYPEID](state, { resTypeId }) {
        state.resTypeId = resTypeId
    },
    [types.EQUIPMENT_DUTY_ORG_ID](state, { dutyOrgId }) {
        state.equipmentDetail.dutyOrg.id = dutyOrgId
    },
    [types.EQUIPMENT_SAVE_DETAIL](state, { equipmentDetail }) {
        const res = equipmentDetail
        state.equipmentDetail = {
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
    [types.GET_EQUIPMENT_UNIT](state, { data }) {
        state.unitData = []
        data.forEach((v, i) => {
            state.unitData.push({
                value: parseInt(v.key),
                label: v.value
            })
        });
    },
    [types.GET_EQUIPMENT_RESOURCE_TYPE](state, { data }) {
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
    }
}

export default {
  state,
  actions,
  mutations
}
