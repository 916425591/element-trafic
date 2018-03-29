import * as types from './constants/team-types'
import Refuge from './resource/team'
import axios from 'axios'


const state = {
    resTypeId: null,
    teamDetail: {
        id: null,
        name: '',
        code: '',
        dutyOrg: {
            id: null,
            name: ''
        },
        buildDate: '',
        function: '',
        location: '',
        region: {
            id: null,
            name: ''
        },
        affiliationOrg: {
            id: null,
            name: ''
            
        },
        personSource: '',
        concentrateTime: '',
        equipping: '',
        memo: ''
    },
    ds_edit: true,
    personId: '',
    memberDetail: '',
    memberList:[],
    resourceTypeData:[]
}

const actions = {
    saveTeamResTypeId({ commit, state }, params) {
        const resTypeId =  params
        commit(types.TEAM_SAVE_RESTYPEID, { resTypeId })
    },
    saveTeamDutyOrgId({ commit, state }, params) {
        const dutyOrgId =  params
        commit(types.TEAM_DUTY_ORG_ID, { dutyOrgId })
    },
    saveTeamDetailData({ commit, state }, params) {
        const teamDetail =  params
        commit(types.TEAM_SAVE_DETAIL, { teamDetail })
    },
    savePersonId({ commit, state }, params) {
        const personId =  params
        commit(types.TEAM_SAVE_PERSONID, { personId })
    },
    saveMemberDetail({ commit, state }, params) {
        const memberDetail =  params
        commit(types.TEAM_SAVE_MEMBER, { memberDetail })
    },
    getTeamResourceType ({ commit, state }, params) {
        axios({
            method: 'post',
            url: params.url,
            data: params.data
        }).then(
            response => {
                if(response.data.code === 200) {
                    const { data } = response.data;
                    commit(types.GET_TEAM_RESOURCE_TYPE, { data });
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
    },
    getTeamMemberList({ commit, state }, params) {
        const memberList =  params
        commit(types.GET_TEAM_MEMBER_LIST, { memberList })
    }
}

const mutations = {
    [types.GET_TEAM_MEMBER_LIST](state, { memberList }) {
        state.memberList = memberList
    },
    [types.TEAM_SAVE_RESTYPEID](state, { resTypeId }) {
        state.resTypeId = resTypeId
    },
    [types.TEAM_DUTY_ORG_ID](state, { dutyOrgId }) {
        state.teamDetail.dutyOrg.id = dutyOrgId
    },
    [types.TEAM_SAVE_DETAIL](state, { teamDetail }) {
        const res = teamDetail
        state.teamDetail = {
            id: res.id,
            name: res.name,
            code: res.code,
            dutyOrg: {
                id: res.dutyOrg ? res.dutyOrg.id : null,
                name: res.dutyOrg ? res.dutyOrg.name : ''
            },
            buildDate: res.buildDate,
            function: res.function,
            location: res.location,
            region: {
                id: res.region ? res.region.id : null,
                name: res.region ? res.region.name : ''
            },
            affiliationOrg: {
                id: res.affiliationOrg ? res.affiliationOrg.id : null,
                name: res.affiliationOrg ? res.affiliationOrg.name : ''
                
            },
            personSource: res.personSource,
            concentrateTime: res.concentrateTime,
            equipping: res.equipping,
            memo: res.memo
        }
    },
    [types.TEAM_SAVE_PERSONID](state, { personId }) {
        state.personId = personId
    },
    [types.TEAM_SAVE_MEMBER](state, { memberDetail }) {
        state.memberDetail = memberDetail
    },
    [types.GET_TEAM_RESOURCE_TYPE](state, { data }) {
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
