// // 
import * as types from './constants/vehicle-types'
import Refuge from './resource/vehicle'
import axios from 'axios'


const state = {
    resTypeId: null,
    vehicleDetail: {
        id: null,
        name: '',
        code: '',
        region: {
            id: null,
            name: ''
        },
        location: '', //存放地点
        dutyOrg: {
            id: null,
            name: ''
        },
        function: '', //职能
        plateNumber: '', // 车牌号
        radioRoda: '', // 车载电台号
        attachment: '', // 随车装备
        status: null, // 状态
        mode: '', // 型号
        memo: '', // 备注
    },
    resourceTypeData:[],
    ds_edit: true
}

const actions = {
    saveVehicleResTypeId({ commit, state }, params) {
        const resTypeId =  params
        commit(types.VEHICLE_SAVE_RESTYPEID, { resTypeId })
    },
    saveVehicleDutyOrgId({ commit, state }, params) {
        const dutyOrgId =  params
        commit(types.VEHICLE_DUTY_ORG_ID, { dutyOrgId })
    },
    saveVehicleDetailData({ commit, state }, params) {
        const vehicleDetail =  params
        commit(types.VEHICLE_SAVE_DETAIL, { vehicleDetail })
    },
    getVehicleResourceType ({ commit, state }, params) {
        axios({
            method: 'post',
            url: params.url,
            data: params.data
        }).then(
            response => {
                if(response.data.code === 200) {
                    const { data } = response.data;
                    commit(types.GET_VEHICLE_RESOURCE_TYPE, { data });
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
    [types.VEHICLE_SAVE_RESTYPEID](state, { resTypeId }) {
        state.resTypeId = resTypeId
    },
    [types.VEHICLE_DUTY_ORG_ID](state, { dutyOrgId }) {
        state.vehicleDetail.dutyOrg.id = dutyOrgId
    },
    [types.VEHICLE_SAVE_DETAIL](state, { vehicleDetail }) {
        const res = vehicleDetail
        state.vehicleDetail = {
            id: res.id,
            name: res.name,
            code: res.code,
            region: {
                id: res.region ? res.region.id : null,
                name: res.region ? res.region.name : ''
            },
            location: res.location,
            dutyOrg:{
                id: res.dutyOrg ? res.dutyOrg.id : null,
                name: res.dutyOrg ? res.dutyOrg.name : ''
            },
            function: res.function,
            plateNumber: res.plateNumber,
            radioRoda: res.radioRoda,
            attachment: res.attachment,
            status: res.status,
            mode: res.mode,
            memo: res.memo,
        }
    },
    [types.GET_VEHICLE_RESOURCE_TYPE](state, { data }) {
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
