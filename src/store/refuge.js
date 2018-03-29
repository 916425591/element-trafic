import * as types from './constants/refuge-types'
import Refuge from './resource/refuge'
import axios from 'axios'


const state = {
    resTypeId: null,
    refugeDetail: {
        id: null,
        name: '',
        code: '',
        region: {
            id: null,
            name: ''
        },
        address: '', //详细地址
        dutyOrg: {
            id: null,
            name: ''
        },
        area: null, //面积
        aisleNumber: null, // 通道数量
        maximum: null, // 最大容纳人数
        personNum: null, // 已容纳人数
        functions: '', // 职能
        valid: null, // 是否有效
    },
    resourceTypeData:[],
    ds_edit: true
}

const actions = {
    saveRefugeResTypeId({ commit, state }, params) {
        const resTypeId =  params
        commit(types.REFUGE_SAVE_RESTYPEID, { resTypeId })
    },
    saveRefugeDutyOrgId({ commit, state }, params) {
        const dutyOrgId =  params
        commit(types.REFUGE_DUTY_ORG_ID, { dutyOrgId })
    },
    saveRefugeDetailData({ commit, state }, params) {
        const refugeDetail =  params
        commit(types.REFUGE_SAVE_DETAIL, { refugeDetail })
    },
    getRefugeResourceType ({ commit, state }, params) {
        axios({
            method: 'post',
            url: params.url,
            data: params.data
        }).then(
            response => {
                if(response.data.code === 200) {
                    const { data } = response.data;
                    commit(types.GET_REFUGE_RESOURCE_TYPE, { data });
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
    [types.REFUGE_SAVE_RESTYPEID](state, { resTypeId }) {
        state.resTypeId = resTypeId
    },
    [types.REFUGE_DUTY_ORG_ID](state, { dutyOrgId }) {
        state.refugeDetail.dutyOrg.id = dutyOrgId
    },
    [types.REFUGE_SAVE_DETAIL](state, { refugeDetail }) {
        const res = refugeDetail
        state.refugeDetail = {
            id: res.id,
            name: res.name,
            code: res.code,
            region: {
                id: res.region ? res.region.id : null,
                name: res.region ? res.region.name : ''
            },
            address: res.address,
            dutyOrg: {
                id: res.dutyOrg ? res.dutyOrg.id : null,
                name: res.dutyOrg ? res.dutyOrg.name : ''
            },
            area: res.area,
            aisleNumber: res.aisleNumber,
            maximum: res.maximum,
            personNum: res.personNum,
            functions: res.functions,
            valid: res.valid,
        }
    },
    [types.GET_REFUGE_RESOURCE_TYPE](state, { data }) {
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
